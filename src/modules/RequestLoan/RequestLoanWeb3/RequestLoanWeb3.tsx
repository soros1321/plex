import * as React from 'react';
import { PaperLayout } from '../../../layouts';
import { browserHistory } from 'react-router';
import { schema, uiSchema } from './schema';
import {
	Header,
	JSONSchemaForm,
	MainWrapper,
	Bold,
	ConfirmationModal
} from '../../../components';
import { DebtOrderEntity } from '../../../models';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { DebtOrder } from '@dharmaprotocol/dharma.js/dist/types/src/types';
import { BigNumber } from 'bignumber.js';
import { Error as ErrorComponent } from '../../../components/Error/Error';

interface Props {
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
	handleRequestDebtOrder: (debtOrder: DebtOrderEntity) => void;
}

interface DebtOrderWithDescription extends DebtOrder {
	description: string;
}

interface State {
	formData: any;
	principalAmount: number;
	principalTokenSymbol: string;
	interestRate: number;
	debtOrder: string;
	confirmationModal: boolean;
	errorMessage: string;
}

class RequestLoanWeb3 extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSignDebtOrder = this.handleSignDebtOrder.bind(this);
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.validateForm = this.validateForm.bind(this);

		this.state = {
			formData: {},
			principalAmount: 0,
			principalTokenSymbol: '',
			interestRate: 0,
			debtOrder: '',
			confirmationModal: false,
			errorMessage: ''
		};
	}

	handleChange(formData: any) {
		this.setState({
			formData: formData,
			principalAmount: formData.loan.principalAmount || 0,
			principalTokenSymbol: formData.loan.principalTokenSymbol || '',
			interestRate: formData.terms.interestRate || 0
		});
	}

	async handleSubmit() {
		try {
			this.setState({ errorMessage: '' });
			const { principalAmount, principalTokenSymbol, description } = this.state.formData.loan;
			const { interestRate, amortizationUnit, termLength } = this.state.formData.terms;
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
			const debtOrderWithDescription: DebtOrderWithDescription = {
				...debtOrder,
				description: description
			};

			this.setState({ debtOrder: JSON.stringify(debtOrderWithDescription) });
			this.confirmationModalToggle();
		} catch (e) {
			this.setState({ errorMessage: 'Unable to generate Debt Order' });
			return;
		}
	}

	async handleSignDebtOrder() {
		try {
			this.setState({ errorMessage: '' });
			if (!this.state.debtOrder) {
				this.setState({ errorMessage: 'No Debt Order has been generated yet' });
				return;
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

			const generatedDebtOrder = await this.props.dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);
			const storeDebtOrder: DebtOrderEntity = {
				debtorSignature: debtorSignature.r,
				debtor: generatedDebtOrder.debtor,
				principalAmount: generatedDebtOrder.principalAmount,
				principalToken: generatedDebtOrder.principalToken,
				principalTokenSymbol: this.state.formData.loan.principalTokenSymbol,
				interestRate: generatedDebtOrder.interestRate,
				amortizationUnit: generatedDebtOrder.amortizationUnit,
				termLength: generatedDebtOrder.termLength,
				termsContract: generatedDebtOrder.termsContract,
				termsContractParameters: generatedDebtOrder.termsContractParameters,
				description: debtOrder.description
			};
			this.props.handleRequestDebtOrder(storeDebtOrder);
			browserHistory.push(`/request/success/${storeDebtOrder.debtorSignature}`);
		} catch (e) {
			this.setState({
				errorMessage: 'Unable to sign debt order',
				confirmationModal: false
			});
			return;
		}
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	validateForm(formData: any, errors: any) {
		if (formData.terms.termLength % 1 !== 0) {
			errors.terms.termLength.addError('Term length can not have decimals.');
		}
		return errors;
	}

	render() {
		const confirmationModalContent = (
			<span>
				You are requesting a loan of <Bold>{this.state.principalAmount} {this.state.principalTokenSymbol}</Bold> at a <Bold>{this.state.interestRate}%</Bold> interest rate per the terms in the contract on the previous page. Are you sure you want to do this?
			</span>
		);
		return (
			<PaperLayout>
				<ErrorComponent errorMessage={this.state.errorMessage} />
				<MainWrapper>
					<Header title={'Request a loan'} description={'Here\'s a quick description of what a debt order is and why you should request one.'} />
					<JSONSchemaForm
						schema={schema}
						uiSchema={uiSchema}
						formData={this.state.formData}
						buttonText="Generate Debt Order"
						onHandleChange={this.handleChange}
						onHandleSubmit={this.handleSubmit}
						validate={this.validateForm}
					/>
				</MainWrapper>
				<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.handleSignDebtOrder} closeButtonText="&#8592; Modify Request" submitButtonText="Complete Request" />
			</PaperLayout>
		);
	}
}

export {RequestLoanWeb3};
