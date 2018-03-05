import * as React from 'react';
import { DebtOrderEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { DebtsMetrics } from './DebtsMetrics';
import { ActiveDebtOrderContainer } from './ActiveDebtOrder/ActiveDebtOrderContainer';
import { DebtOrderHistory } from './DebtOrderHistory';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class Debts extends React.Component<Props, {}> {
	render() {
		const activeDebtOrders: DebtOrderEntity[] = this.props.debtOrders;
		const pastDebtOrders: DebtOrderEntity[] = [];
		/*
		this.props.loans.forEach((loan) => {
			if (loan.active) {
				activeLoans.push(loan);
			} else {
				pastLoans.push(loan);
			}
		});
		*/

		return (
			<MainWrapper>
				<Header title="Your debts" />
				<DebtsMetrics debtOrders={this.props.debtOrders} />
				{ activeDebtOrders.map((debtOrder) => (
						<ActiveDebtOrderContainer debtOrder={debtOrder} key={debtOrder.identifier} />
					))
				}
				<DebtOrderHistory debtOrders={pastDebtOrders} />
			</MainWrapper>
		);
	}
}

export { Debts };
