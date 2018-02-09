import * as React from 'react';
import { LoanEntity } from '../../../models';
import { Header } from '../../../components';
import { DebtsMetrics } from './DebtsMetrics';
import { ActiveLoan } from './ActiveLoan';
import { LoanHistory } from './LoanHistory';
import './Debts.css';

interface Props {
	loans: LoanEntity[];
}

class Debts extends React.Component<Props, {}> {
	render() {
		const activeLoans: LoanEntity[] = [];
		const pastLoans: LoanEntity[] = [];
		this.props.loans.forEach((loan) => {
			if (loan.active) {
				activeLoans.push(loan);
			} else {
				pastLoans.push(loan);
			}
		});

		return (
			<div className="main-wrapper">
				<Header title="Your debts" />
				<DebtsMetrics loans={this.props.loans} />
				{ activeLoans.map((loan) => (
						<ActiveLoan loan={loan} key={loan.id} />
					))
				}
				<LoanHistory loans={pastLoans} />
			</div>
		);
	}
}

export { Debts };
