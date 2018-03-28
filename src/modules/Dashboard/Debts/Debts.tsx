import * as React from 'react';
import { DebtOrderEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { DebtsMetricsContainer } from './DebtsMetrics/DebtsMetricsContainer';
import { ActiveDebtOrderContainer } from './ActiveDebtOrder/ActiveDebtOrderContainer';
import { DebtOrderHistory } from './DebtOrderHistory';

interface Props {
	debtOrders: DebtOrderEntity[];
}

interface State {
	allDebtOrders: DebtOrderEntity[];
	activeDebtOrders: DebtOrderEntity[];
	inactiveDebtOrders: DebtOrderEntity[];
}

class Debts extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			allDebtOrders: [],
			activeDebtOrders: [],
			inactiveDebtOrders: []
		};
	}

	componentDidMount() {
		this.getDebtOrdersDetails(this.props.debtOrders);
	}

	componentWillReceiveProps(nextProps: Props) {
		this.getDebtOrdersDetails(nextProps.debtOrders);
	}

	getDebtOrdersDetails(debtOrders: DebtOrderEntity[]) {
		if (!debtOrders || !debtOrders.length) {
			return;
		}
		const allDebtOrders: DebtOrderEntity[] = [];
		const activeDebtOrders: DebtOrderEntity[] = [];
		const inactiveDebtOrders: DebtOrderEntity[] = [];
		for (let debtOrder of debtOrders) {
			if (debtOrder.status === 'inactive') {
				inactiveDebtOrders.push(debtOrder);
			} else {
				activeDebtOrders.push(debtOrder);
			}
			allDebtOrders.push(debtOrder);
		}
		this.setState({
			allDebtOrders,
			activeDebtOrders,
			inactiveDebtOrders
		});
	}

	render() {
		const { allDebtOrders, activeDebtOrders, inactiveDebtOrders } = this.state;

		return (
			<MainWrapper>
				<Header title="Your debts" />
				<DebtsMetricsContainer debtOrders={allDebtOrders} />
				{ activeDebtOrders.map((debtOrder) => (
						<ActiveDebtOrderContainer debtOrder={debtOrder} key={debtOrder.issuanceHash} />
					))
				}
				<DebtOrderHistory debtOrders={inactiveDebtOrders} />
			</MainWrapper>
		);
	}
}

export { Debts };
