import * as React from 'react';
import {
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import './RequestLoanSummary.css';

interface Props {
	amount: string;
	description: string;
	principle: string;
	interest: string;
	repaymentDate: string;
	repaymentTerms: string;
	summaryJSON: string;
	onCopyClipboard: () => void;
}

class RequestLoanSummary extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
	}

	handleCopyClipboard() {
		this.props.onCopyClipboard();
	}

	render() {
		const leftInfoItems = [
			{title: 'AMOUNT', content: this.props.amount},
			{title: 'PRINCIPLE', content: this.props.principle},
			{title: 'REPAYMENT DATE', content: this.props.repaymentDate}
		];
		const rightInfoItems = [
			{title: 'DESCRIPTION', content: this.props.description},
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
			<div className="request-loan-summary-container">
				<Label className="title">Loan request summary</Label>
				<Row className="gray">
					<Row>
						<Col xs="12" md="6">
							{leftInfoItemRows}
						</Col>
						<Col xs="12" md="6">
							{rightInfoItemRows}
						</Col>
					</Row>
					<FormGroup className="summary-json-container">
						<Label for="summary-json">JSON</Label>
						<Input type="textarea" name="summary-json" value={this.props.summaryJSON} readOnly={true} />
						<Button className="button" onClick={this.handleCopyClipboard}>Copy</Button>
					</FormGroup>
				</Row>
			</div>
		);
	}
}

export { RequestLoanSummary };
