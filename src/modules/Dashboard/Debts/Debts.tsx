import * as React from 'react';
import { DebtOrderEntity, DebtOrderMoreDetail } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { DebtsMetricsContainer } from './DebtsMetrics/DebtsMetricsContainer';
import { ActiveDebtOrder } from './ActiveDebtOrder';
import { DebtOrderHistory } from './DebtOrderHistory';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';

interface Props {
	dharma: Dharma;
	debtOrders: DebtOrderEntity[];
}

interface State {
	allDebtOrders: DebtOrderMoreDetail[];
	activeDebtOrders: DebtOrderMoreDetail[];
	inactiveDebtOrders: DebtOrderMoreDetail[];
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
		const allDebtOrders: DebtOrderMoreDetail[] = [];
		const activeDebtOrders: DebtOrderMoreDetail[] = [];
		const inactiveDebtOrders: DebtOrderMoreDetail[] = [];
		for (let debtOrder of debtOrders) {
			try {
				const dharmaDebtOrder = {
					principalAmount: debtOrder.principalAmount,
					principalToken: debtOrder.principalToken,
					termsContract: debtOrder.termsContract,
					termsContractParameters: debtOrder.termsContractParameters
				};

				const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
				const debtOrderMoreDetail = {
					...debtOrder,
					termLength: fromDebtOrder.termLength,
					amortizationUnit: fromDebtOrder.amortizationUnit,
					interestRate: fromDebtOrder.interestRate,
					repaidAmount: new BigNumber(0),
					status: ''
				};

				try {
					const repaidAmount = await dharma.servicing.getValueRepaid(debtOrder.issuanceHash);
					debtOrderMoreDetail.repaidAmount = repaidAmount;
					debtOrderMoreDetail.status = repaidAmount.lt(debtOrder.principalAmount) ? 'active' : 'inactive';
					if (debtOrderMoreDetail.status === 'active') {
						activeDebtOrders.push(debtOrderMoreDetail);
					} else {
						inactiveDebtOrders.push(debtOrderMoreDetail);
					}
					allDebtOrders.push(debtOrderMoreDetail);
				} catch (ex) {
					debtOrderMoreDetail.status = 'pending';
					activeDebtOrders.push(debtOrderMoreDetail);
					allDebtOrders.push(debtOrderMoreDetail);
				}
			} catch (e) {
				// console.log(e);
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
						<ActiveDebtOrder debtOrder={debtOrder} key={debtOrder.issuanceHash} />
					))
				}
				<DebtOrderHistory debtOrders={inactiveDebtOrders} />
			</MainWrapper>
		);
	}
}

export { Debts };
