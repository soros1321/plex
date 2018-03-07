const Web3 = require('web3');
const Dharma = require('@dharmaprotocol/dharma.js');
const promisify = require('tiny-promisify');
const BigNumber = require('bignumber.js');
const ABIDecoder = require('abi-decoder');
const compact = require('lodash.compact');
const fs = require('fs');

const ROOT_DIR = __dirname + '/../../../';

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
const DebtRegistry = require(ROOT_DIR + 'src/artifacts/DebtRegistry.json');
const DebtKernel = require(ROOT_DIR + 'src/artifacts/DebtKernel.json');
const RepaymentRouter = require(ROOT_DIR + 'src/artifacts/RepaymentRouter.json');
const TokenTransferProxy = require(ROOT_DIR + 'src/artifacts/TokenTransferProxy.json');
const TokenRegistry = require(ROOT_DIR + 'src/artifacts/TokenRegistry.json');
const DebtToken = require(ROOT_DIR + 'src/artifacts/DebtToken.json');
const TermsContractRegistry = require(ROOT_DIR + 'src/artifacts/TermsContractRegistry.json');

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
		let filledDebtOrders: any[] = [];
		for (let debtOrder of sampleDebtOrders) {
			const principalToken = await tokenRegistry.getTokenAddress.callAsync(debtOrder.principalTokenSymbol);

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

			const txHash = await dharma.order.fillAsync(dharmaDebtOrder, {from: dharmaDebtOrder.creditor});
			const receipt = await promisify(web3.eth.getTransactionReceipt)(txHash);
			const [debtOrderFilledLog] = compact(ABIDecoder.decodeLogs(receipt.logs));
			if (debtOrderFilledLog.name === 'LogDebtOrderFilled') {
				const filledDebtOrder = Object.assign({ issuanceHash }, dharmaDebtOrder);

				// Pay the debt order
				const repaymentAmount = new BigNumber(debtOrder.repaymentAmount);
				const repaymentSuccess = await makeRepayment(
					filledDebtOrder.issuanceHash,
					repaymentAmount,
					filledDebtOrder.principalToken,
					{from: filledDebtOrder.debtor}
				);
				if (repaymentSuccess) {
					filledDebtOrders.push(filledDebtOrder);
				}
			}
		}
		fs.writeFile(ROOT_DIR + 'src/migrations/filledDebtOrders.json', JSON.stringify(filledDebtOrders, null, 2), (err: any) => {
			if (err) {
				throw err;
			}
			console.log('src/migrations/filledDebtOrders.json updated!');
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
