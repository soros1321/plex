import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import './InvestmentsMetrics.css';

interface Props {
	investments: InvestmentEntity[];
}

class InvestmentsMetrics extends React.Component<Props, {}> {
	render() {
		let totalLended: number = 0;
		let totalEarned: number = 0;
		this.props.investments.forEach((investment) => {
			totalLended += investment.amountLended;
			totalEarned += investment.amountPaid;
		});
		return (
			<Row className="dashboard-metrics">
				<Col xs="6">
					<div className="value">{totalLended} ETH</div>
					<div className="label">Total Lended</div>
				</Col>
				<Col xs="6">
					<div className="value">{totalEarned} ETH</div>
					<div className="label">Total Earned</div>
				</Col>
			</Row>
		);
	}
}

export { InvestmentsMetrics };
