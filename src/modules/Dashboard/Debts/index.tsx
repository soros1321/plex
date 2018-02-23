import * as React from 'react';
import { DebtOrderEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { DebtsMetrics } from './DebtsMetrics';
import { ActiveDebtOrder } from './ActiveDebtOrder';
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
						<ActiveDebtOrder debtOrder={debtOrder} key={debtOrder.debtorSignature} />
					))
				}
				<DebtOrderHistory debtOrders={pastDebtOrders} />
			</MainWrapper>
		);
	}
}

export { Debts };
