const Web3 = require('web3');
const Dharma = require('@dharmaprotocol/dharma.js');
const promisify = require('tiny-promisify');
const BigNumber = require('bignumber.js');
const ABIDecoder = require('abi-decoder');
const compact = require('lodash.compact');

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
const DebtRegistry = require('../../../src/artifacts/DebtRegistry.json');
const DebtKernel = require('../../../src/artifacts/DebtKernel.json');
const RepaymentRouter = require('../../../src/artifacts/RepaymentRouter.json');
const TokenTransferProxy = require('../../../src/artifacts/TokenTransferProxy.json');
const TokenRegistry = require('../../../src/artifacts/TokenRegistry.json');
const DebtToken = require('../../../src/artifacts/DebtToken.json');
const TermsContractRegistry = require('../../../src/artifacts/TermsContractRegistry.json');

// Sample data
const sampleDebtOrders = require('../../../src/migrations/sampleDebtOrders.json');

let	web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let defaultAccount = '';

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

		const dharma = new Dharma.default(web3.currentProvider, dharmaConfig);
		fillDebtOrders(dharma);
	} catch (e) {
		throw new Error(e);
	}
}

async function fillDebtOrders(dharma: any) {
	try {
		if (!web3 || !dharma) {
			throw new Error('Unable to connect to blockchain');
		}
		if (!sampleDebtOrders) {
			throw new Error('Unable to find sample debt order data');
		}

		const tokenRegistry = await dharma.contracts.loadTokenRegistry();
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

			/*
			const tokenBalance = await dharma.token.getBalanceAsync(principalToken, dharmaDebtOrder.creditor);
			const tokenAllowance = await dharma.token.getProxyAllowanceAsync(principalToken, dharmaDebtOrder.creditor);
			 */

			dharmaDebtOrder.debtorSignature = await dharma.sign.asDebtor(dharmaDebtOrder);
			dharmaDebtOrder.creditorSignature = await dharma.sign.asCreditor(dharmaDebtOrder);

			const txHash = await dharma.order.fillAsync(dharmaDebtOrder, {from: defaultAccount});
			const receipt = await promisify(web3.eth.getTransactionReceipt)(txHash);
			const debtOrderFilledLog = ABIDecoder.decodeLogs(receipt.logs);
			console.log(txHash);
			console.log(debtOrderFilledLog);
		}
	} catch (e) {
		throw new Error(e);
	}
}
