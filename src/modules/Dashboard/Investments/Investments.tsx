import * as React from 'react';
import { InvestmentEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { InvestmentsMetricsContainer } from './InvestmentsMetrics/InvestmentsMetricsContainer';
import { ActiveInvestmentContainer } from './ActiveInvestment/ActiveInvestmentContainer';
import { InvestmentHistory } from './InvestmentHistory';

interface Props {
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
		this.getInvestmentsDetails(this.props.investments);
	}

	componentWillReceiveProps(nextProps: Props) {
		this.getInvestmentsDetails(nextProps.investments);
	}

	async getInvestmentsDetails(investments: InvestmentEntity[]) {
		if (!investments || !investments.length) {
			return;
		}
		const allInvestments: InvestmentEntity[] = [];
		const activeInvestments: InvestmentEntity[] = [];
		const inactiveInvestments: InvestmentEntity[] = [];
		for (let investment of investments) {
			if (investment.status === 'active') {
				activeInvestments.push(investment);
			} else {
				inactiveInvestments.push(investment);
			}
			allInvestments.push(investment);
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
						<ActiveInvestmentContainer investment={investment} key={investment.issuanceHash} />
					))
				}
				<InvestmentHistory investments={inactiveInvestments} />
			</MainWrapper>
		);
	}
}

export { Investments };
