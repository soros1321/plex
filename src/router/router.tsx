import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from '../AppContainer';
import {
	WelcomeContainer,
	FillLoanEmpty,
	DefaultContent,
	TestForm,
	RequestLoanFormContainer,
	RequestLoanSuccessContainer,
	DashboardContainer,
	FillLoanEnteredContainer,
	Terms,
	Privacy
} from '../modules';
import { ParentContainer } from '../layouts';
import * as Web3 from 'web3';
import { web3Connected, dharmaInstantiated, setAccounts, setDebtOrders, setInvestments } from './actions';
import { setError } from '../components/Error/actions';
const promisify = require('tiny-promisify');

// Import Dharma libraries
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';

// Import Currently Deployed Dharma contracts (should only be done in test context -- otherwise)
import {
	DebtRegistry,
	DebtKernel,
	RepaymentRouter,
	TokenTransferProxy,
	TokenRegistry,
	DebtToken,
	TermsContractRegistry
} from '@dharmaprotocol/contracts';

// Import testing Debt Orders (if exist)
import { DebtOrderEntity, InvestmentEntity } from '../models';
const migratedDebtOrders = require('../migrations/migratedDebtOrders.json');

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
			return;
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
			return;
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

		const dharma = new Dharma(web3.currentProvider, dharmaConfig);
		dispatch(dharmaInstantiated(dharma));
		await this.migrateDebtOrders(dharma, accounts[0]);
	}

	async migrateDebtOrders(dharma: Dharma, defaultAccount: string) {
		const { dispatch } = this.props.store;
		if (!migratedDebtOrders.length) {
			return;
		}

		const debtOrders: DebtOrderEntity[] = [];
		const investments: InvestmentEntity[] = [];

		for (let migratedDebtOrder of migratedDebtOrders) {
			const debtOrder: DebtOrderEntity = {
				...migratedDebtOrder,
				debtorSignature: JSON.stringify(migratedDebtOrder.debtorSignature),
				principalAmount: new BigNumber(migratedDebtOrder.principalAmount)
			};

			const investment: InvestmentEntity = {
				...migratedDebtOrder,
				debtorSignature: JSON.stringify(migratedDebtOrder.debtorSignature),
				creditorSignature: JSON.stringify(migratedDebtOrder.creditorSignature),
				principalAmount: new BigNumber(migratedDebtOrder.principalAmount)
			};

			try {
				// Check whether this debtOrder exist on current network
				const dharmaDebtOrder = {
					principalAmount: debtOrder.principalAmount,
					principalToken: debtOrder.principalToken,
					termsContract: debtOrder.termsContract,
					termsContractParameters: debtOrder.termsContractParameters
				};
				await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
				if (migratedDebtOrder.debtor === defaultAccount) {
					debtOrders.push(debtOrder);
				}
				try {
					// If there is a repaid value, means this order is filled
					await dharma.servicing.getValueRepaid(investment.issuanceHash);
					if (migratedDebtOrder.creditor === defaultAccount) {
						investments.push(investment);
					}
				} catch (ex) {
					// console.log(ex);
				}
			} catch (e) {
				// console.log(e);
			}
		}
		dispatch(setDebtOrders(debtOrders));
		dispatch(setInvestments(investments));
	}

	render() {
		const history = syncHistoryWithStore(browserHistory, this.props.store);
		return (
			<Router history={history}>
				<Route path="/" component={AppContainer} >
					<IndexRoute component={WelcomeContainer} />
					<Route path="/bazaar" component={DefaultContent} />
					<Route path="/whitepaper" component={DefaultContent} />
					<Route path="/blog" component={DefaultContent} />
					<Route path="/github" component={DefaultContent} />
					<Route path="/chat" component={DefaultContent} />
					<Route path="/twitter" component={DefaultContent} />
					<Route path="/dashboard" component={DashboardContainer} />
					<Route path="/request" component={ParentContainer}>
						<IndexRoute component={RequestLoanFormContainer} />
						<Route path="success/:issuanceHash" component={RequestLoanSuccessContainer} />
					</Route>
					<Route path="/fill" component={ParentContainer}>
						<IndexRoute component={FillLoanEmpty} />
						<Route path="loan" component={FillLoanEnteredContainer} />
					</Route>
					<Route path="/test" component={TestForm} />
					<Route path="/terms" component={Terms} />
					<Route path="/privacy" component={Privacy} />
				</Route>
			</Router>
		);
	}
}

export {AppRouter};
