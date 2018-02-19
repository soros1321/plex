import * as React from 'react';
import * as Web3 from "web3";
import { PageLayout } from './layouts';

const promisify = require('tiny-promisify');

// Import Dharma libraries
import Dharma from "@dharmaprotocol/dharma.js";

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
import DebtRegistry from './artifacts/DebtRegistry.json';
import DebtKernel from './artifacts/DebtKernel.json';
import RepaymentRouter from './artifacts/RepaymentRouter.json';
import TokenTransferProxy from './artifacts/TokenTransferProxy.json';
import TokenRegistry from './artifacts/TokenRegistry.json';
import DebtToken from './artifacts/DebtToken.json';
import TermsContractRegistry from "./artifacts/TermsContractRegistry.json";

interface State {
	dharma: Dharma;
	web3: Web3;
	accounts: string[];
}

class App extends React.Component<{}, State> {
	async componentDidMount() {
		if (typeof (window as any).web3 !== 'undefined') {
			this.setState({ web3: (window as any).web3 });
			await this.instantiateDharma();
		}
	}

	async instantiateDharma() {
		const networkId = await promisify(this.state.web3.version.getNetwork)();
		const accounts = await promisify(this.state.web3.eth.getAccounts)();

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
