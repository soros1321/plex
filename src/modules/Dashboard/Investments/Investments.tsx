import * as React from 'react';
import { InvestmentEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { InvestmentsMetricsContainer } from './InvestmentsMetrics/InvestmentsMetricsContainer';
import { ActiveInvestment } from './ActiveInvestment';
import { InvestmentHistory } from './InvestmentHistory';
import Dharma from '@dharmaprotocol/dharma.js';
import { debtOrderFromJSON } from '../../../utils';

interface Props {
	dharma: Dharma;
	investments: InvestmentEntity[];
}

interface State {
	allInvestments: InvestmentEntity[];
	activeInvestments: InvestmentEntity[];
	inactiveInvestments: InvestmentEntity[];
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
		if (this.props.dharma && this.props.investments) {
			this.getInvestmentsDetails(this.props.dharma, this.props.investments);
		}
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
		const allInvestments: InvestmentEntity[] = [];
		const activeInvestments: InvestmentEntity[] = [];
		const inactiveInvestments: InvestmentEntity[] = [];
		for (let investment of investments) {
			try {
				const investmentInfo = debtOrderFromJSON(investment.json);

				// The repaid value from debtor is the earned amount for creditor
				const earnedAmount = await dharma.servicing.getValueRepaid(investment.issuanceHash);
				investment.earnedAmount = earnedAmount;
				investment.status = investmentInfo.principalAmount && earnedAmount.lt(investmentInfo.principalAmount) ? 'active' : 'inactive';
				if (investment.status === 'active') {
					activeInvestments.push(investment);
				} else {
					inactiveInvestments.push(investment);
				}
				allInvestments.push(investment);
			} catch (ex) {
				// console.log(ex);
			}
		}
		this.setState({
			allInvestments,
			activeInvestments,
			inactiveInvestments
		});
	}

	render() {
		const { allInvestments, activeInvestments, inactiveInvestments } = this.state;

		return (
			<MainWrapper>
				<Header title="Your investments" />
				<InvestmentsMetricsContainer investments={allInvestments} />
				{ activeInvestments.map((investment) => (
						<ActiveInvestment investment={investment} key={investment.issuanceHash} />
					))
				}
				<InvestmentHistory investments={inactiveInvestments} />
			</MainWrapper>
		);
	}
}

export { Investments };
