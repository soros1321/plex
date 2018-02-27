import * as React from 'react';
import { PaperLayout } from '../../../layouts';
import {
	Header,
	ConfirmationModal,
	MainWrapper,
	Bold
} from '../../../components';
import { Link } from 'react-router';
import { SuccessModal } from './SuccessModal';
import { browserHistory } from 'react-router';
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
	requestId: string;
	amount: string;
	currency: string;
	description: string;
	counterparty: string;
	underwriter: string;
	principle: string;
	interest: string;
	repaymentDate: string;
	repaymentTerms: string;
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
			{title: 'Principal', content: this.props.amount},
			{title: 'Term Length', content: this.props.counterparty},
			{title: 'Description', content: this.props.principle}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: this.props.description},
			{title: 'Installment Frequency', content: this.props.underwriter}
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
				You will fill this debt order <Bold>${this.props.requestId}</Bold>. This operation will debit ${this.props.amount} ${this.props.currency} from your account.
			</span>
		);
		return (
			<PaperLayout>
				<MainWrapper>
					<Header title={'Fill a loan'} description={'Here are the details of loan request ' + this.props.requestId + '. If the terms look fair to you, fill the loan and Dharma will //insert statement.'} />
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
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} requestId={this.props.requestId} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
