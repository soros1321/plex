import * as React from 'react';
import { Link, browserHistory } from 'react-router';
import { DebtOrderEntity } from '../../../models';
import { amortizationUnitToFrequency } from '../../../utils';
import { PaperLayout } from '../../../layouts';
import {
	Header,
	ConfirmationModal,
	MainWrapper,
	Bold
} from '../../../components';
import { SuccessModal } from './SuccessModal';
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

interface Props {
	params?: any;
	debtOrder: DebtOrderEntity;
	getDebtOrder: (debtorSignature: string) => void;
}

interface States {
	confirmationModal: boolean;
	successModal: boolean;
}

class FillLoanEntered extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.state = {
			confirmationModal: false,
			successModal: false
		};
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
	}

	componentDidMount() {
		const debtorSignature = this.props.params.debtorSignature;
		this.props.getDebtOrder(debtorSignature);
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
		if (!this.props.debtOrder) {
			return null;
		}
		const { debtOrder } = this.props;
		const leftInfoItems = [
			{title: 'Principal', content: debtOrder.principalAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol},
			{title: 'Term Length', content: debtOrder.termLength.toNumber() + ' ' + debtOrder.amortizationUnit},
			{title: 'Description', content: debtOrder.description}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: debtOrder.interestRate.toNumber() + '%'},
			{title: 'Installment Frequency', content: amortizationUnitToFrequency(debtOrder.amortizationUnit)}
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
				You will fill this debt order <Bold>${this.props.params.debtorSignature}</Bold>. This operation will debit <Bold>${debtOrder.principalAmount} ${debtOrder.principalTokenSymbol}</Bold> from your account.
			</span>
		);
		return (
			<PaperLayout>
				<MainWrapper>
					<Header title={'Fill a loan'} description={'Here are the details of loan request ' + this.props.params.debtorSignature + '. If the terms look fair to you, fill the loan and Dharma will //insert statement.'} />
					<LoanInfoContainer>
						<HalfCol>
							{leftInfoItemRows}
						</HalfCol>
						<HalfCol>
							{rightInfoItemRows}
						</HalfCol>
					</LoanInfoContainer>
					<ButtonContainer>
						<Link to="/fill">
							<DeclineButton>Decline</DeclineButton>
						</Link>
						<FillLoanButton onClick={this.confirmationModalToggle}>Fill Loan</FillLoanButton>
					</ButtonContainer>
					<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.successModalToggle} closeButtonText="Cancel" submitButtonText="Fill Order" />
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} requestId={this.props.params.debtorSignature} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
