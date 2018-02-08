import * as React from 'react';
import { Row, Col } from 'reactstrap';
import './DebtsMetrics.css';

interface Props {
	totalRequested: number;
	totalRepayed: number;
}

class DebtsMetrics extends React.Component<Props, {}> {
	render() {
		return (
			<Row className="dashboard-metrics">
				<Col xs="6">
					<div className="value">{this.props.totalRequested} ETH</div>
					<div className="label">Total Requested</div>
				</Col>
				<Col xs="6">
					<div className="value">{this.props.totalRepayed} ETH</div>
					<div className="label">Total Repayed</div>
				</Col>
			</Row>
		);
	}
}

export { DebtsMetrics };
