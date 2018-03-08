import * as React from 'react';
import { InvestmentEntity, InvestmentMoreDetail } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { InvestmentsMetricsContainer } from './InvestmentsMetrics/InvestmentsMetricsContainer';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';

/*
import { ActiveInvestment } from './ActiveInvestment';
import { InvestmentHistory } from './InvestmentHistory';
*/

interface Props {
	dharma: Dharma;
	investments: InvestmentEntity[];
}

interface State {
	allInvestments: InvestmentMoreDetail[];
	activeInvestments: InvestmentMoreDetail[];
	inactiveInvestments: InvestmentMoreDetail[];
}

class Investments extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			allInvestments: [],
			activeInvestments: [],
			inactiveInvestments: []
		};
	}

	componentDidMount() {
		this.getInvestmentsDetails(this.props.dharma, this.props.investments);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.investments) {
			this.getInvestmentsDetails(nextProps.dharma, nextProps.investments);
		}
	}

	async getInvestmentsDetails(dharma: Dharma, investments: InvestmentEntity[]) {
		if (!investments.length) {
			return;
		}
		const allInvestments: InvestmentMoreDetail[] = [];
		const activeInvestments: InvestmentMoreDetail[] = [];
		const inactiveInvestments: InvestmentMoreDetail[] = [];
		for (let investment of investments) {
			try {
				const dharmaDebtOrder = {
					principalAmount: investment.principalAmount,
					principalToken: investment.principalToken,
					termsContract: investment.termsContract,
					termsContractParameters: investment.termsContractParameters
				};

				const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
				const investmentMoreDetail = {
					...investment,
					termLength: fromDebtOrder.termLength,
					amortizationUnit: fromDebtOrder.amortizationUnit,
					interestRate: fromDebtOrder.interestRate,
					earnedAmount: new BigNumber(0),
					status: ''
				};

				try {
					// The repaid value from debtor is the earned amount for creditor
					const earnedAmount = await dharma.servicing.getValueRepaid(investment.issuanceHash);
					investmentMoreDetail.earnedAmount = earnedAmount;
					investmentMoreDetail.status = earnedAmount.lt(investment.principalAmount) ? 'active' : 'inactive';
					if (investmentMoreDetail.status === 'active') {
						activeInvestments.push(investmentMoreDetail);
					} else {
						inactiveInvestments.push(investmentMoreDetail);
					}
					allInvestments.push(investmentMoreDetail);
				} catch (ex) {
					// console.log(ex);
				}
			} catch (e) {
				// console.log(e);
			}
		}
		this.setState({
			allInvestments,
			activeInvestments,
			inactiveInvestments
		});
	}

	render() {
		const { allInvestments } = this.state;

		return (
			<MainWrapper>
				<Header title="Your investments" />
				<InvestmentsMetricsContainer investments={allInvestments} />
			</MainWrapper>
		);
	}
}

export { Investments };
