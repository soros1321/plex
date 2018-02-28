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
import { encodeUrlParams } from '../../../utils';
const BitlyClient = require('bitly');

interface Props {
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
	handleRequestDebtOrder: (debtOrder: DebtOrderEntity) => void;
}

interface DebtOrderWithDescriptionIssuanceHash extends DebtOrder {
	description: string;
	issuanceHash: string;
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
			const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);
			const debtOrderWithDescriptionIssuanceHash: DebtOrderWithDescriptionIssuanceHash = {
				...debtOrder,
				description: description,
				issuanceHash: issuanceHash
			};

			this.setState({ debtOrder: JSON.stringify(debtOrderWithDescriptionIssuanceHash) });
			this.confirmationModalToggle();
		} catch (e) {
			this.setState({ errorMessage: 'Unable to generate Debt Order' });
			window.scrollTo(0, 0);
			return;
		}
	}

	async handleSignDebtOrder() {
		try {
			this.setState({ errorMessage: '' });
			if (!this.state.debtOrder) {
				this.setState({ errorMessage: 'No Debt Order has been generated yet' });
				window.scrollTo(0, 0);
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

			const bitly = BitlyClient(process.env.REACT_APP_BITLY_ACCESS_TOKEN);

			let result = await bitly.shorten(process.env.REACT_APP_NGROK_HOSTNAME + '/request/success/' + debtorSignature.r);
			let requestSuccessShortUrl: string = '';
			if (result.status_code === 200) {
				requestSuccessShortUrl = result.data.url;
			}

			const generatedDebtOrder = await this.props.dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);

			const urlParams = {
				debtorSignature: debtorSignature.r,
				debtor: generatedDebtOrder.debtor,
				principalAmount: generatedDebtOrder.principalAmount.toNumber(),
				principalTokenSymbol: this.state.formData.loan.principalTokenSymbol,
				interestRate: generatedDebtOrder.interestRate.toNumber(),
				amortizationUnit: generatedDebtOrder.amortizationUnit,
				termLength: generatedDebtOrder.termLength.toNumber(),
				description: debtOrder.description
			};
			result = await bitly.shorten(process.env.REACT_APP_NGROK_HOSTNAME + '/fill/loan?' + encodeUrlParams(urlParams));
			let fillLoanShortUrl: string = '';
			if (result.status_code === 200) {
				fillLoanShortUrl = result.data.url;
			}

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
				description: debtOrder.description,
				issuanceHash: debtOrder.issuanceHash,
				requestSuccessShortUrl: requestSuccessShortUrl,
				fillLoanShortUrl: fillLoanShortUrl
			};
			this.props.handleRequestDebtOrder(storeDebtOrder);
			browserHistory.push(`/request/success/${storeDebtOrder.debtorSignature}`);
		} catch (e) {
			this.setState({
				errorMessage: 'Unable to sign Debt Order',
				confirmationModal: false
			});
			window.scrollTo(0, 0);
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
		const descriptionContent = <span>Here's a quick description of what a debt order is and why you should request one.</span>;
		return (
			<PaperLayout>
				<ErrorComponent errorMessage={this.state.errorMessage} />
				<MainWrapper>
					<Header title={'Request a loan'} description={descriptionContent} />
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
