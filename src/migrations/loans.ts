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
			dharmaDebtOrder.creditor = defaultAccount;

			// Set the token allowance to unlimited
			await dharma.token.setUnlimitedProxyAllowanceAsync(principalToken);

			// Sign as debtor
			dharmaDebtOrder.debtorSignature = await dharma.sign.asDebtor(dharmaDebtOrder);

			// Sign as creditor
			dharmaDebtOrder.creditorSignature = await dharma.sign.asCreditor(dharmaDebtOrder);

			// Get issuance hash for this debt order
			const issuanceHash = await dharma.order.getIssuanceHash(dharmaDebtOrder);
			console.log('Issuance Hash: ' + issuanceHash);
			if (debtOrder.fill) {
				const txHash = await dharma.order.fillAsync(dharmaDebtOrder, {from: dharmaDebtOrder.creditor});
				const receipt = await promisify(web3.eth.getTransactionReceipt)(txHash);
				const [debtOrderFilledLog] = compact(ABIDecoder.decodeLogs(receipt.logs));
				if (debtOrderFilledLog.name === 'LogDebtOrderFilled') {
					console.log('- Debt order filled');
					const filledDebtOrder = Object.assign({ issuanceHash }, dharmaDebtOrder);
					filledDebtOrder.principalTokenSymbol = debtOrder.principalTokenSymbol;
					filledDebtOrder.description = debtOrder.description;

					// Generate the shortUrl for this debtOrder
					const urlParams = {
						principalAmount: filledDebtOrder.principalAmount.toNumber(),
						principalToken: principalToken,
						termsContract: filledDebtOrder.termsContract,
						termsContractParameters: filledDebtOrder.termsContractParameters,
						debtorSignature: JSON.stringify(filledDebtOrder.debtorSignature),
						debtor: filledDebtOrder.debtor,
						description: debtOrder.description,
						principalTokenSymbol: filledDebtOrder.principalTokenSymbol
					};
					const bitlyResult = await bitly.shorten(process.env.REACT_APP_NGROK_HOSTNAME + '/fill/loan?' + encodeUrlParams(urlParams));
					let fillLoanShortUrl: string = '';
					if (bitlyResult.status_code === 200) {
						fillLoanShortUrl = bitlyResult.data.url;
						console.log('- Short Url generated');
					} else {
						console.log('- Unable to generate short url');
					}
					filledDebtOrder.fillLoanShortUrl = fillLoanShortUrl;

					// Pay the debt order
					const repaymentAmount = new BigNumber(debtOrder.repaymentAmount);
					const repaymentSuccess = await makeRepayment(
						filledDebtOrder.issuanceHash,
						repaymentAmount,
						filledDebtOrder.principalToken,
						{from: filledDebtOrder.debtor}
					);
					if (repaymentSuccess) {
						console.log('- Repayment success');
						migratedDebtOrders.push(filledDebtOrder);
					} else {
						console.log('- Repayment failed');
					}
				} else {
					console.log('- Unable to fill debt order');
				}
			} else {
				console.log('- Skipping filling debt order');
				dharmaDebtOrder.issuanceHash = issuanceHash;
				dharmaDebtOrder.principalTokenSymbol = debtOrder.principalTokenSymbol;
				dharmaDebtOrder.description = debtOrder.description;

				// Generate the shortUrl for this debtOrder
				const urlParams = {
					principalAmount: dharmaDebtOrder.principalAmount.toNumber(),
					principalToken: principalToken,
					termsContract: dharmaDebtOrder.termsContract,
					termsContractParameters: dharmaDebtOrder.termsContractParameters,
					debtorSignature: JSON.stringify(dharmaDebtOrder.debtorSignature),
					debtor: dharmaDebtOrder.debtor,
					description: debtOrder.description,
					principalTokenSymbol: dharmaDebtOrder.principalTokenSymbol
				};
				const bitlyResult = await bitly.shorten(process.env.REACT_APP_NGROK_HOSTNAME + '/fill/loan?' + encodeUrlParams(urlParams));
				let fillLoanShortUrl: string = '';
				if (bitlyResult.status_code === 200) {
					fillLoanShortUrl = bitlyResult.data.url;
					console.log('- Short Url generated');
				} else {
					console.log('- Unable to generate short url');
				}
				dharmaDebtOrder.fillLoanShortUrl = fillLoanShortUrl;
				migratedDebtOrders.push(dharmaDebtOrder);
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
