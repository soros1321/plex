import * as React from 'react';
import {
	Row,
	Col,
	Button
} from 'reactstrap';
import { Header, ConfirmationModal } from '../../../components';
import { Link } from 'react-router';
import { SuccessModal } from './SuccessModal/SuccessModal';
import { browserHistory } from 'react-router';
import './FillLoanEntered.css';

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
			{title: 'AMOUNT', content: this.props.amount},
			{title: 'COUNTERPARTY', content: this.props.counterparty},
			{title: 'PRINCIPLE', content: this.props.principle},
			{title: 'REPAYMENT DATE', content: this.props.repaymentDate}
		];
		const rightInfoItems = [
			{title: 'DESCRIPTION', content: this.props.description},
			{title: 'UNDERWRITER', content: this.props.underwriter},
			{title: 'INTEREST', content: this.props.interest},
			{title: 'REPAYMENT TERMS', content: this.props.repaymentTerms}
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<div className="info-item" key={item.title}>
				<div className="title">
					{item.title}
				</div>
				<div className="content">
					// Some Content
					{item.content}
				</div>
			</div>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<div className="info-item" key={item.title}>
				<div className="title">
					{item.title}
				</div>
				<div className="content">
					// Some Content
					{item.content}
				</div>
			</div>
		));

		return (
			<div className="main-wrapper">
				<Header title={'Fill a loan'} description={'Here are the details of loan request ' + this.props.requestId + '. If the terms look fair to you, fill the loan and Dharma will //insert statement.'} />
				<Row className="loan-info-container">
					<Col xs="12" md="6">
						{leftInfoItemRows}
					</Col>
					<Col xs="12" md="6">
						{rightInfoItemRows}
					</Col>
				</Row>
				<Row className="button-container margin-top-30">
					<Col xs="12" md="6">
						<Link to="/fill">
							<Button className="button secondary width-95">Decline</Button>
						</Link>
					</Col>
					<Col xs="12" md="6" className="align-right">
						<Button className="button width-95" onClick={this.confirmationModalToggle}>Fill Loan</Button>
					</Col>
				</Row>
				<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={`You will fill this debt order ${this.props.requestId}. This operation will debit ${this.props.amount} ${this.props.currency} from your account.`} onToggle={this.confirmationModalToggle} onSubmit={this.successModalToggle} closeButtonText="Cancel" submitButtonText="Fill Order" />
				<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} requestId={this.props.requestId} />
			</div>
		);
	}
}

export { FillLoanEntered };
