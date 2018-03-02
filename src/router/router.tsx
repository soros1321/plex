import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from '../App';
import {
	WelcomeContainer,
	FillLoanEmpty,
	DefaultContent,
	TestForm,
	RequestLoanWeb3Container,
	RequestLoanSuccessContainer,
	DashboardContainer,
	FillLoanEnteredContainer
} from '../modules';
import { ParentContainer } from '../layouts';
import * as Web3 from 'web3';
import { web3Connected, dharmaInstantiated, setAccounts, setError } from '../common/actions';
const promisify = require('tiny-promisify');

// Import Dharma libraries
import Dharma from '@dharmaprotocol/dharma.js';

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
const DebtRegistry = require('../artifacts/DebtRegistry.json');
const DebtKernel = require('../artifacts/DebtKernel.json');
const RepaymentRouter = require('../artifacts/RepaymentRouter.json');
const TokenTransferProxy = require('../artifacts/TokenTransferProxy.json');
const TokenRegistry = require('../artifacts/TokenRegistry.json');
const DebtToken = require('../artifacts/DebtToken.json');
const TermsContractRegistry = require('../artifacts/TermsContractRegistry.json');

interface Props {
	store: any;
}

class AppRouter extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	async componentDidMount() {
		const { dispatch } = this.props.store;
		let web3: any = null;
		if (typeof (window as any).web3 !== 'undefined') {
			web3 = await new Web3((window as any).web3.currentProvider);
		} else {
			web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
		}
		if (web3.isConnected()) {
			dispatch(web3Connected(web3));
			await this.instantiateDharma(web3);
		}
	}

	async instantiateDharma(web3: Web3) {
		const { dispatch } = this.props.store;
		const networkId = await promisify(web3.version.getNetwork)();
		const accounts = await promisify(web3.eth.getAccounts)();

		if (!accounts.length) {
			dispatch(setError('Unable to find active account on current Ethereum network'));
		}

		dispatch(setAccounts(accounts));

		if (!(networkId in DebtKernel.networks &&
			networkId in RepaymentRouter.networks &&
			networkId in TokenTransferProxy.networks &&
			networkId in TokenRegistry.networks &&
			networkId in DebtToken.networks &&
			networkId in TermsContractRegistry.networks &&
			networkId in DebtRegistry.networks)) {
			dispatch(setError('Unable to connect to the blockchain'));
		} else {
			const dharmaConfig = {
				kernelAddress: DebtKernel.networks[networkId].address,
				repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
				tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
				tokenRegistryAddress: TokenRegistry.networks[networkId].address,
				debtTokenAddress: DebtToken.networks[networkId].address,
				termsContractRegistry: TermsContractRegistry.networks[networkId].address,
				debtRegistryAddress: DebtRegistry.networks[networkId].address
			};

			const dharma = new Dharma(web3.currentProvider, dharmaConfig);
			dispatch(dharmaInstantiated(dharma));
		}
	}

	render() {
		const history = syncHistoryWithStore(browserHistory, this.props.store);
		return (
			<Router history={history}>
				<Route path="/" component={App} >
					<IndexRoute component={WelcomeContainer} />
					<Route path="/bazaar" component={DefaultContent} />
					<Route path="/whitepaper" component={DefaultContent} />
					<Route path="/blog" component={DefaultContent} />
					<Route path="/github" component={DefaultContent} />
					<Route path="/chat" component={DefaultContent} />
					<Route path="/twitter" component={DefaultContent} />
					<Route path="/dashboard" component={DashboardContainer} />
					<Route path="/request" component={ParentContainer}>
						<IndexRoute component={RequestLoanWeb3Container} />
						<Route path="success/:debtorSignature" component={RequestLoanSuccessContainer} />
					</Route>
					<Route path="/fill" component={ParentContainer}>
						<IndexRoute component={FillLoanEmpty} />
						<Route path="loan" component={FillLoanEnteredContainer} />
					</Route>
					<Route path="/test" component={TestForm} />
					<Route path="/terms" component={DefaultContent} />
				</Route>
			</Router>
		);
	}
}

export {AppRouter};
