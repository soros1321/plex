import * as React from 'react';
import { LoanEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import './DebtsMetrics.css';

interface Props {
	loans: LoanEntity[];
}

class DebtsMetrics extends React.Component<Props, {}> {
	render() {
		let totalRequested: number = 0;
		let totalRepayed: number = 0;
		this.props.loans.forEach((loan) => {
			totalRequested += loan.amount;
			totalRepayed += loan.amountPaid;
		});
		return (
			<Row className="dashboard-metrics">
				<Col xs="6">
					<div className="value">{totalRequested} ETH</div>
					<div className="label">Total Requested</div>
				</Col>
				<Col xs="6">
					<div className="value">{totalRepayed} ETH</div>
					<div className="label">Total Repayed</div>
				</Col>
			</Row>
		);
	}
}

export { DebtsMetrics };
