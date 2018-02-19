import * as React from 'react';
import * as Web3 from 'web3';
import getWeb3 from './utils/getWeb3';
import { PageLayout } from './layouts';

const promisify = require('tiny-promisify');

// Import Dharma libraries
import Dharma from '@dharmaprotocol/dharma.js';

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
const DebtRegistry = require('./artifacts/DebtRegistry.json');
const DebtKernel = require('./artifacts/DebtKernel.json');
const RepaymentRouter = require('./artifacts/RepaymentRouter.json');
const TokenTransferProxy = require('./artifacts/TokenTransferProxy.json');
const TokenRegistry = require('./artifacts/TokenRegistry.json');
const DebtToken = require('./artifacts/DebtToken.json');
const TermsContractRegistry = require('./artifacts/TermsContractRegistry.json');

interface State {
	dharma: Dharma;
	web3: Web3;
	accounts: string[];
}

class App extends React.Component<{}, State> {
	componentWillMount() {
		getWeb3
			.then(results => {
				this.setState({
					web3: results.web3
				});

				// Instantiate contract once web3 provided.
				this.instantiateDharma();
			})
			.catch((e) => {
				console.log('Error instantiating Dharma contracts:' + e);
			});
	}

	async instantiateDharma() {
		const networkId = await promisify(this.state!.web3!.version.getNetwork)();
		const accounts = await promisify(this.state!.web3!.eth.getAccounts)();

		if (!(networkId in DebtKernel.networks &&
			networkId in RepaymentRouter.networks &&
			networkId in TokenTransferProxy.networks &&
			networkId in TokenRegistry.networks &&
			networkId in DebtToken.networks &&
			networkId in TermsContractRegistry.networks &&
			networkId in DebtRegistry.networks)) {
			throw new Error('Cannot find Dharma smart contracts on current Ethereum network.');
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

		const dharma = new Dharma(this.state.web3.currentProvider, dharmaConfig);

		console.log('Dharma libraries are set up!');
		console.log(dharma);

		this.setState({ dharma, accounts });
	}

	render() {
		return (
			<div>
				<PageLayout>
					{this.props.children}
				</PageLayout>
			</div>
		);
	}
}

export default App;
