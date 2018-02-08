import * as React from 'react';
import { LoanEntity } from '../../../models';
import { Header } from '../../../components';
import { Row, Col } from 'reactstrap';
import './Debts.css';

interface Props {
	totalRequested: number;
	totalRepayed: number;
	loans: LoanEntity[];
}

class Debts extends React.Component<Props, {}> {
	render() {
		return (
			<div className="main-wrapper">
				<Header title="Your debts" />
				<Row className="dashboard-metrics">
					<Col xs="6">
						<div className="value">{this.props.totalRequested || 0} ETH</div>
						<div className="label">Total Requested</div>
					</Col>
					<Col xs="6">
						<div className="value">{this.props.totalRepayed || 0} ETH</div>
						<div className="label">Total Repayed</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export { Debts };
