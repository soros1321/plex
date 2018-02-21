import * as React from 'react';
import {
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import { DebtOrderEntity } from '../../../../models';
import './RequestLoanSummary.css';

interface Props {
	debtOrder: DebtOrderEntity;
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
		const { debtOrder } = this.props;
		const leftInfoItems = [
			{title: 'AMOUNT', content: debtOrder.principalAmount + ' ' + debtOrder.principalTokenSymbol},
			{title: 'PRINCIPLE', content: ''},
			{title: 'REPAYMENT DATE', content: ''}
		];
		const rightInfoItems = [
			{title: 'DESCRIPTION', content: ''},
			{title: 'INTEREST', content: debtOrder.interestRate + '%'},
			{title: 'REPAYMENT TERMS', content: debtOrder.termLength + ' ' + debtOrder.amortizationUnit}
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<div className="info-item" key={item.title}>
				<div className="title">
					{item.title}
				</div>
				<div className="content">
					{item.content || 'Some Content'}
				</div>
			</div>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<div className="info-item" key={item.title}>
				<div className="title">
					{item.title}
				</div>
				<div className="content">
					{item.content || 'Some Content'}
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
						<Input type="textarea" name="summary-json" value={JSON.stringify(debtOrder, undefined, 4)} readOnly={true} />
						<Button className="button" onClick={this.handleCopyClipboard}>Copy</Button>
					</FormGroup>
				</Row>
			</div>
		);
	}
}

export { RequestLoanSummary };
