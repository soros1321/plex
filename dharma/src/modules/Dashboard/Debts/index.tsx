import * as React from 'react';
import { LoanEntity } from '../../../models';
import { Header } from '../../../components';
import { DebtsMetrics } from './DebtsMetrics';
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
				<DebtsMetrics totalRequested={this.props.totalRequested} totalRepayed={this.props.totalRepayed} />
			</div>
		);
	}
}

export { Debts };
