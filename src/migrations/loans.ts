require('dotenv').config();
const ROOT_DIR = __dirname + '/../../../';
const Web3 = require('web3');
const Dharma = require('@dharmaprotocol/dharma.js');
const {
	DebtRegistry,
	DebtKernel,
	RepaymentRouter,
	TokenTransferProxy,
	TokenRegistry,
	DebtToken,
	TermsContractRegistry
} = require('@dharmaprotocol/contracts');
const promisify = require('tiny-promisify');
const BigNumber = require('bignumber.js');
const ABIDecoder = require('abi-decoder');
const compact = require('lodash.compact');
const fs = require('fs');
const BitlyClient = require('bitly');
const bitly = new BitlyClient(process.env.REACT_APP_BITLY_ACCESS_TOKEN);

// Sample data
const sampleDebtOrders = require(ROOT_DIR + 'src/migrations/sampleDebtOrders.json');

const normalizeDebtOrder = (debtOrder: any) => {
	const _debtOrder = {
		...debtOrder,
		principalAmount: debtOrder!.principalAmount!.toNumber(),
		debtorFee: debtOrder!.debtorFee!.toNumber(),
		creditorFee: debtOrder!.creditorFee!.toNumber(),
		relayerFee: debtOrder!.relayerFee!.toNumber(),
		underwriterFee: debtOrder!.underwriterFee!.toNumber(),
		underwriterRiskRating: debtOrder!.underwriterRiskRating!.toNumber(),
		expirationTimestampInSec: debtOrder!.expirationTimestampInSec!.toNumber(),
		salt: debtOrder!.salt!.toNumber(),
		debtorSignature: JSON.stringify(debtOrder.debtorSignature),
		creditorSignature: JSON.stringify(debtOrder.creditorSignature),
		underwriterSignature: JSON.stringify(debtOrder.underwriterSignature)
	};
	return _debtOrder;
};

let	web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let defaultAccount: string = '';
let dharma: any = null;

// Add abi to ABIDecoder
ABIDecoder.addABI(DebtKernel.abi);
ABIDecoder.addABI(RepaymentRouter.abi);

if (web3.isConnected()) {
	instantiateDharma();
}

async function instantiateDharma() {
	try {
		const networkId = await promisify(web3.version.getNetwork)();
		const accounts = await promisify(web3.eth.getAccounts)();
		if (!accounts.length) {
			throw new Error('ETH account not available');
		}
		defaultAccount = accounts[0];

		if (!(networkId in DebtKernel.networks &&
			networkId in RepaymentRouter.networks &&
			networkId in TokenTransferProxy.networks &&
			networkId in TokenRegistry.networks &&
			networkId in DebtToken.networks &&
			networkId in TermsContractRegistry.networks &&
			networkId in DebtRegistry.networks)) {
			throw new Error('Unable to connect to the blockchain');
		}

		const dharmaConfig = {
			kernelAddress: DebtKernel.networks[networkId].address,
			repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
			tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
			tokenRegistryAddress: TokenRegistry.networks[networkId].address,
			debtTokenAddress: DebtToken.networks[networkId].address,
			termsContractRegistry: TermsContractRegistry.networks[networkId].address,
			debtRegistryAddress: DebtRegistry.networks[networkId].address
		};

		dharma = new Dharma.default(web3.currentProvider, dharmaConfig);
		fillDebtOrders();
	} catch (e) {
		throw new Error(e);
	}
}

async function fillDebtOrders() {
	try {
		if (!web3 || !dharma) {
			throw new Error('Unable to connect to blockchain');
		}
		if (!sampleDebtOrders) {
			throw new Error('Unable to find sample debt order data');
		}

		const tokenRegistry = await dharma.contracts.loadTokenRegistry();
		let migratedDebtOrders: any[] = [];
		for (let debtOrder of sampleDebtOrders) {
			const principalToken = await tokenRegistry.getTokenAddressBySymbol.callAsync(debtOrder.principalTokenSymbol);

			const simpleInterestLoan = {
				principalToken,
				principalAmount: new BigNumber(debtOrder.principalAmount),
				interestRate: new BigNumber(debtOrder.interestRate),
				amortizationUnit: debtOrder.amortizationUnit,
				termLength: new BigNumber(debtOrder.termLength)
			};
			const dharmaDebtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
			dharmaDebtOrder.debtor = defaultAccount;

			// Set the token allowance to unlimited
			await dharma.token.setUnlimitedProxyAllowanceAsync(principalToken);
			dharmaDebtOrder.debtorSignature = await dharma.sign.asDebtor(dharmaDebtOrder);

			// Get issuance hash for this debt order
			const issuanceHash = await dharma.order.getIssuanceHash(dharmaDebtOrder);

			console.log('Issuance Hash: ' + issuanceHash);

			// Generate the shortUrl for this debtOrder
			const urlParams = normalizeDebtOrder(Object.assign({ description: debtOrder.description, principalTokenSymbol: debtOrder.principalTokenSymbol }, dharmaDebtOrder));
			const bitlyResult = await bitly.shorten(process.env.REACT_APP_NGROK_HOSTNAME + '/fill/loan?' + encodeUrlParams(urlParams));
			let fillLoanShortUrl: string = '';
			if (bitlyResult.status_code === 200) {
				fillLoanShortUrl = bitlyResult.data.url;
				console.log('- Short Url generated');
			} else {
				console.log('- Unable to generate short url');
			}

			// Get terms length / interest rate / amortization unit info
			const generatedDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
			let storeDebtOrder = {
				json: JSON.stringify(dharmaDebtOrder),
				principalTokenSymbol: debtOrder.principalTokenSymbol,
				description: debtOrder.description,
				issuanceHash,
				fillLoanShortUrl,
				repaidAmount: new BigNumber(0),
				termLength: generatedDebtOrder.termLength,
				interestRate: generatedDebtOrder.interestRate,
				amortizationUnit: generatedDebtOrder.amortizationUnit,
				status: 'pending'
			};

			if (debtOrder.fill) {
				// Sign as creditor
				dharmaDebtOrder.creditor = defaultAccount;
				dharmaDebtOrder.creditorSignature = await dharma.sign.asCreditor(dharmaDebtOrder);
				storeDebtOrder.json = JSON.stringify(dharmaDebtOrder);

				const txHash = await dharma.order.fillAsync(dharmaDebtOrder, {from: dharmaDebtOrder.creditor});
				const receipt = await promisify(web3.eth.getTransactionReceipt)(txHash);
				const [debtOrderFilledLog] = compact(ABIDecoder.decodeLogs(receipt.logs));
				if (debtOrderFilledLog.name === 'LogDebtOrderFilled') {
					console.log('- Debt order filled');

					// Pay the debt order
					const repaymentAmount = new BigNumber(debtOrder.repaymentAmount);
					const repaymentSuccess = await makeRepayment(
						storeDebtOrder.issuanceHash,
						repaymentAmount,
						dharmaDebtOrder.principalToken,
						{from: dharmaDebtOrder.debtor}
					);
					if (repaymentSuccess) {
						console.log('- Repayment success');
						storeDebtOrder.repaidAmount = repaymentAmount;
						storeDebtOrder.status = repaymentAmount.lt(dharmaDebtOrder.principalAmount) ? 'active' : 'inactive';
						migratedDebtOrders.push(storeDebtOrder);
					} else {
						console.log('- Repayment failed');
					}
				} else {
					console.log('- Unable to fill debt order');
				}
			} else {
				console.log('- Skipping filling debt order');
				migratedDebtOrders.push(storeDebtOrder);
			}
			console.log('\n');
		}
		fs.writeFile(ROOT_DIR + 'src/migrations/migratedDebtOrders.json', JSON.stringify(migratedDebtOrders, null, 2), (err: any) => {
			if (err) {
				throw err;
			}
			console.log('src/migrations/migratedDebtOrders.json updated!');
		});
	} catch (e) {
		throw new Error(e);
	}
}

async function makeRepayment(issuanceHash: string, amount: any, principalToken: string, options: any): Promise<boolean> {
	try {
		const txHash = await dharma.servicing.makeRepayment(
			issuanceHash,
			amount,
			principalToken,
			options
		);
		const receipt = await promisify(web3.eth.getTransactionReceipt)(txHash);
		const [logs] = compact(ABIDecoder.decodeLogs(receipt.logs));
		return (logs.name === 'LogRepayment');
	} catch (e) {
		throw new Error(e);
	}
}

function encodeUrlParams(params: any): string {
	const encodedParams = Object.keys(params).map(function(k: string) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
	}).join('&');
	return encodedParams;
}
