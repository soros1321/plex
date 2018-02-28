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
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';

interface Props {
	location?: any;
	dharma: Dharma;
}

interface States {
	confirmationModal: boolean;
	successModal: boolean;
	principalAmount: number | undefined;
	principalTokenSymbol: string;
	termLength: number | undefined;
	amortizationUnit: string;
	interestRate: number | undefined;
	debtorSignature: string;
	description: string;
}

class FillLoanEntered extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.state = {
			confirmationModal: false,
			successModal: false,
			principalAmount: undefined,
			principalTokenSymbol: '',
			termLength: undefined,
			amortizationUnit: '',
			interestRate: undefined,
			debtorSignature: '',
			description: ''
		};
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
	}

	async componentWillReceiveProps(nextProps: Props) {
		try {
			if (nextProps.dharma && nextProps.location.query) {
				const debtOrder = nextProps.location.query;
				debtOrder.principalAmount = new BigNumber(debtOrder.principalAmount);
				if (debtOrder.termsContract && debtOrder.termsContractParameters) {
					const fromDebtOrder = await nextProps.dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);
					this.setState({
						principalAmount: fromDebtOrder.principalAmount.toNumber(),
						principalTokenSymbol: debtOrder.principalTokenSymbol,
						termLength: fromDebtOrder.termLength.toNumber(),
						amortizationUnit: fromDebtOrder.amortizationUnit,
						interestRate: fromDebtOrder.interestRate.toNumber(),
						debtorSignature: debtOrder.debtorSignature,
						description: debtOrder.description
					});
				} else {
					this.setState({
						principalAmount: debtOrder.principalAmount.toNumber(),
						principalTokenSymbol: debtOrder.principalTokenSymbol,
						debtorSignature: debtOrder.debtorSignature,
						description: debtOrder.description
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
				You will fill this debt order <Bold>{shortenString(this.state.debtorSignature)}</Bold>. This operation will debit <Bold>{this.state.principalAmount} {this.state.principalTokenSymbol}</Bold> from your account.
			</span>
		);
		const descriptionContent = (
			<span>
				Here are the details of loan request <Bold>{this.state.debtorSignature}</Bold>. If the terms look fair to you, fill the loan and Dharma will //insert statement.
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
					<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.successModalToggle} closeButtonText="Cancel" submitButtonText="Fill Order" />
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} debtorSignature={this.state.debtorSignature} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
