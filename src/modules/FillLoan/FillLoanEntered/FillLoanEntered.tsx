import * as React from 'react';
import { Link, browserHistory } from 'react-router';
import { amortizationUnitToFrequency, shortenString } from '../../../utils';
import { PaperLayout } from '../../../layouts';
import {
	Header,
	ConfirmationModal,
	MainWrapper,
	Bold
} from '../../../components';
import { SuccessModal } from './SuccessModal';
import { Col } from 'reactstrap';
import {
	LoanInfoContainer,
	HalfCol,
	InfoItem,
	Title,
	Content,
	ButtonContainer,
	DeclineButton,
	FillLoanButton
} from './styledComponents';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';

interface Props {
	location?: any;
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
}

interface States {
	confirmationModal: boolean;
	successModal: boolean;
	principalAmount: number;
	principalToken: string;
	principalTokenSymbol: string;
	termLength: number;
	amortizationUnit: any;
	interestRate: number;
	debtorSignature: any;
	description: string;
}

class FillLoanEntered extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.state = {
			confirmationModal: false,
			successModal: false,
			principalAmount: 0,
			principalToken: '',
			principalTokenSymbol: '',
			termLength: 0,
			amortizationUnit: '',
			interestRate: 0,
			debtorSignature: {},
			description: ''
		};
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
		this.handleFillOrder = this.handleFillOrder.bind(this);
	}

	async componentWillReceiveProps(nextProps: Props) {
		try {
			if (nextProps.dharma && nextProps.location.query) {
				const debtOrder = nextProps.location.query;
				debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
				this.setState({
					principalAmount: debtOrder.principalAmount.toNumber(),
					principalToken: debtOrder.principalToken,
					principalTokenSymbol: debtOrder.principalTokenSymbol,
					debtorSignature: JSON.parse(debtOrder.debtorSignature),
					description: debtOrder.description
				});

				if (debtOrder.termsContract && debtOrder.termsContractParameters) {
					const fromDebtOrder = await nextProps.dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);
					this.setState({
						termLength: fromDebtOrder.termLength.toNumber(),
						amortizationUnit: fromDebtOrder.amortizationUnit,
						interestRate: fromDebtOrder.interestRate.toNumber()
					});
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	async handleFillOrder() {
		try {
			const { dharma } = this.props;

			const simpleInterestLoan = {
				principalAmount: new BigNumber(this.state.principalAmount),
				principalToken: this.state.principalToken,
				interestRate: new BigNumber(this.state.interestRate),
				amortizationUnit: this.state.amortizationUnit,
				termLength: new BigNumber(this.state.termLength)
			};
			const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
			debtOrder.debtor = this.props.accounts[0];
			// debtOrder.debtorSignature = this.state.debtorSignature;

			// Sign as creditor
			debtOrder.creditor = this.props.accounts[0];

			const creditorSignature = await this.props.dharma.sign.asCreditor(debtOrder);
			const signedDebtOrder = Object.assign({ creditorSignature }, debtOrder);
			console.log(signedDebtOrder);
			const response = await dharma.order.fillAsync(signedDebtOrder);

			// Sign as debtor
			// const signedDebtOrder = Object.assign({ this.state.debtorSignature }, debtOrder);
			console.log(response);
		} catch (e) {
			console.log(e);
		}
	}

	successModalToggle() {
		this.setState({
			confirmationModal: false,
			successModal: !this.state.successModal
		});
		if (this.state.successModal) {
			browserHistory.push('/dashboard');
		}
	}

	render() {
		const leftInfoItems = [
			{title: 'Principal', content: this.state.principalAmount + ' ' + this.state.principalTokenSymbol},
			{title: 'Term Length', content: (this.state.termLength && this.state.amortizationUnit ? this.state.termLength + ' ' + this.state.amortizationUnit : '-')}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: (this.state.interestRate ? this.state.interestRate + '%' : '-')},
			{title: 'Installment Frequency', content: (this.state.amortizationUnit ? amortizationUnitToFrequency(this.state.amortizationUnit) : '-')}
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
				</Content>
			</InfoItem>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
				</Content>
			</InfoItem>
		));

		const confirmationModalContent = (
			<span>
				You will fill this debt order <Bold>{shortenString(this.state.debtorSignature.r)}</Bold>. This operation will debit <Bold>{this.state.principalAmount} {this.state.principalTokenSymbol}</Bold> from your account.
			</span>
		);
		const descriptionContent = (
			<span>
				Here are the details of loan request <Bold>{this.state.debtorSignature.r}</Bold>. If the terms look fair to you, fill the loan and Dharma will //insert statement.
			</span>
		);
		return (
			<PaperLayout>
				<MainWrapper>
					<Header title={'Fill a loan'} description={descriptionContent} />
					<LoanInfoContainer>
						<HalfCol>
							{leftInfoItemRows}
						</HalfCol>
						<HalfCol>
							{rightInfoItemRows}
						</HalfCol>
						<Col xs="12">
							<InfoItem>
								<Title>
									Description
								</Title>
								<Content>
									{this.state.description}
								</Content>
							</InfoItem>
						</Col>
					</LoanInfoContainer>
					<ButtonContainer>
						<Link to="/fill">
							<DeclineButton>Decline</DeclineButton>
						</Link>
						<FillLoanButton onClick={this.confirmationModalToggle}>Fill Loan</FillLoanButton>
					</ButtonContainer>
					<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.handleFillOrder} closeButtonText="Cancel" submitButtonText="Fill Order" />
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} debtorSignature={this.state.debtorSignature.r} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
