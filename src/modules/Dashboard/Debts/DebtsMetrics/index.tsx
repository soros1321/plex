import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import './DebtsMetrics.css';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class DebtsMetrics extends React.Component<Props, {}> {
	render() {
		let totalREPRequested: number = 0;
		let totalMKRRequested: number = 0;
		let totalZRXRequested: number = 0;
		let totalRepayed: number = 0;
		this.props.debtOrders.forEach((debtOrder) => {
			switch (debtOrder.principalTokenSymbol) {
				case 'REP':
					totalREPRequested += debtOrder.principalAmount;
					break;
				case 'MKR':
					totalMKRRequested += debtOrder.principalAmount;
					break;
				case 'ZRX':
					totalZRXRequested += debtOrder.principalAmount;
					break;
				default:
					break;
			}
		});
		return (
			<Row className="dashboard-metrics">
				<Col xs="6">
					<div className="value">{totalREPRequested} REP, {totalMKRRequested} MKR, {totalZRXRequested} ZRX</div>
					<div className="label">Total Requested</div>
				</Col>
				<Col xs="6">
					<div className="value">{totalRepayed} REP, {totalRepayed} MKR, {totalRepayed} ZRX</div>
					<div className="label">Total Repayed</div>
				</Col>
			</Row>
		);
	}
}

export { DebtsMetrics };
