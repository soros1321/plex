const Web3 = require('web3');
const Dharma = require('@dharmaprotocol/dharma.js');
const promisify = require('tiny-promisify');

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
		generateDebtOrder(dharma);
	} catch (e) {
		throw new Error(e);
	}
}

async function generateDebtOrder(dharma: any) {
	try {
		if (!web3 || !dharma) {
			throw new Error('Unable to connect to blockchain');
		}
		if (!sampleDebtOrders) {
			throw new Error('Unable to find sample debt order data');
		}
		console.log(sampleDebtOrders[0]);
	} catch (e) {
		throw new Error(e);
	}
}
