import * as React from 'react';
import { LoanEntity } from '../../../models';
import { Header } from '../../../components';
import { DebtsMetrics } from './DebtsMetrics';
import { ActiveLoan } from './ActiveLoan';
import './Debts.css';

interface Props {
	totalRequested: number;
	totalRepayed: number;
	loans: LoanEntity[];
}

class Debts extends React.Component<Props, {}> {
	render() {
		const activeLoans: LoanEntity[] = [];
		this.props.loans.forEach((loan) => {
			if (loan.active) {
				activeLoans.push(loan);
			}
		});

		return (
			<div className="main-wrapper">
				<Header title="Your debts" />
				<DebtsMetrics totalRequested={this.props.totalRequested} totalRepayed={this.props.totalRepayed} />
				{ activeLoans.map((loan) => (
						<ActiveLoan loan={loan} key={loan.id} />
					))
				}
			</div>
		);
	}
}

export { Debts };
