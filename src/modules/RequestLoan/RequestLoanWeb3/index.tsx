import * as React from 'react';
// import * as Web3 from 'web3';
import { schema, uiSchema } from './schema';
import {
	Header,
	JSONSchemaForm,
	MainWrapper,
	Bold,
	ConfirmationModal
} from '../../../components';
import { browserHistory } from 'react-router';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';

const BigNumber = require('bignumber.js');

interface Props {
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
}

interface State {
	formData: any;
	debtOrder: string;
	confirmationModal: boolean;
}

class RequestLoanWeb3 extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSignDebtOrder = this.handleSignDebtOrder.bind(this);
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);

		this.state = {
			formData: {},
			debtOrder: '',
			confirmationModal: false
		};
	}

	handleChange(formData: any) {
		this.setState({ formData });
	}

	async handleSubmit() {
		const { principalAmount, principalTokenSymbol, interestRate, amortizationUnit, termLength } = this.state.formData;
		const dharma = this.props.dharma;

		const tokenRegistry = await dharma.contracts.loadTokenRegistry();
		const principalToken = await tokenRegistry.getTokenAddress.callAsync(principalTokenSymbol);

		const simpleInterestLoan = {
			principalToken,
			principalAmount: new BigNumber(principalAmount),
			interestRate: new BigNumber(interestRate),
			amortizationUnit,
			termLength: new BigNumber(termLength)
		};

		const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);

		this.setState({ debtOrder: JSON.stringify(debtOrder) });
		this.confirmationModalToggle();
	}

	async handleSignDebtOrder() {
		if (!this.state.debtOrder) {
			throw new Error('No Debt order has been generated yet');
		}
		const debtOrder = JSON.parse(this.state.debtOrder);

		debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
		debtOrder.debtor = this.props.accounts[0];

		// Sign as debtor
		const debtorSignature = await this.props.dharma.sign.asDebtor(debtOrder);
		const signedDebtOrder = Object.assign({ debtorSignature }, debtOrder);

		this.setState({
			debtOrder: JSON.stringify(signedDebtOrder),
			confirmationModal: false
		});
		browserHistory.push('/request/success');
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	render() {
		const confirmationModalContent = (
			<span>
				You are requesting a loan of <Bold>{this.state.formData.principalAmount} {this.state.formData.principalTokenSymbol}</Bold> with interest rate of <Bold>{this.state.formData.interestRate}%</Bold> per the terms in the contract on the previous page. Are you sure you want to do this?
			</span>
		);
		return (
			<MainWrapper>
				<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
				<JSONSchemaForm
					schema={schema}
					uiSchema={uiSchema}
					formData={this.state.formData}
					buttonText="Generate Debt Order"
					onHandleChange={this.handleChange}
					onHandleSubmit={this.handleSubmit}
				/>
				<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.handleSignDebtOrder} closeButtonText="&#8592; Modify Request" submitButtonText="Complete Request" />
			</MainWrapper>
		);
	}
}

export {RequestLoanWeb3};
