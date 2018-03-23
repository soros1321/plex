import * as React from 'react';
import { DebtOrderEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { DebtsMetricsContainer } from './DebtsMetrics/DebtsMetricsContainer';
import { ActiveDebtOrderContainer } from './ActiveDebtOrder/ActiveDebtOrderContainer';
import { DebtOrderHistory } from './DebtOrderHistory';
import Dharma from '@dharmaprotocol/dharma.js';
import { debtOrderFromJSON } from '../../../utils';

interface Props {
	dharma: Dharma;
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
		if (this.props.dharma && this.props.debtOrders) {
			this.getDebtOrdersDetails(this.props.dharma, this.props.debtOrders);
		}
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.debtOrders) {
			this.getDebtOrdersDetails(nextProps.dharma, nextProps.debtOrders);
		}
	}

	async getDebtOrdersDetails(dharma: Dharma, debtOrders: DebtOrderEntity[]) {
		if (!debtOrders.length) {
			return;
		}
		const allDebtOrders: DebtOrderEntity[] = [];
		const activeDebtOrders: DebtOrderEntity[] = [];
		const inactiveDebtOrders: DebtOrderEntity[] = [];
		for (let debtOrder of debtOrders) {
			try {
				const debtOrderInfo = debtOrderFromJSON(debtOrder.json);
				const repaidAmount = await dharma.servicing.getValueRepaid(debtOrder.issuanceHash);
				debtOrder.repaidAmount = repaidAmount;
				debtOrder.status = repaidAmount.lt(debtOrderInfo.principalAmount) ? 'active' : 'inactive';
				if (debtOrder.status === 'active') {
					activeDebtOrders.push(debtOrder);
				} else {
					inactiveDebtOrders.push(debtOrder);
				}
				allDebtOrders.push(debtOrder);
			} catch (ex) {
				debtOrder.status = 'pending';
				activeDebtOrders.push(debtOrder);
				allDebtOrders.push(debtOrder);
			}
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
