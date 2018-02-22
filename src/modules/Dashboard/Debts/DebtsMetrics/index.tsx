import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import { BigNumber } from 'bignumber.js';
import './DebtsMetrics.css';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class DebtsMetrics extends React.Component<Props, {}> {
	render() {
		let totalREPRequested: BigNumber = new BigNumber(0);
		let totalMKRRequested: BigNumber = new BigNumber(0);
		let totalZRXRequested: BigNumber = new BigNumber(0);
		let totalRepayed: number = 0;
		this.props.debtOrders.forEach((debtOrder) => {
			switch (debtOrder.principalTokenSymbol) {
				case 'REP':
					totalREPRequested = totalREPRequested.plus(debtOrder.principalAmount);
					break;
				case 'MKR':
					totalMKRRequested = totalMKRRequested.plus(debtOrder.principalAmount);
					break;
				case 'ZRX':
					totalZRXRequested = totalZRXRequested.plus(debtOrder.principalAmount);
					break;
				default:
					break;
			}
		});
		return (
			<Row className="dashboard-metrics">
				<Col xs="6">
					<div className="value">{totalREPRequested.toNumber()} REP, {totalMKRRequested.toNumber()} MKR, {totalZRXRequested.toNumber()} ZRX</div>
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
