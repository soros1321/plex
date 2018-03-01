import * as React from 'react';
import { InvestmentEntity } from '../../../models';
import { Header, MainWrapper } from '../../../components';
import { InvestmentsMetrics } from './InvestmentsMetrics';
import { ActiveInvestment } from './ActiveInvestment';
import { InvestmentHistory } from './InvestmentHistory';

interface Props {
	investments: InvestmentEntity[];
}

class Investments extends React.Component<Props, {}> {
	render() {
		const activeInvestments: InvestmentEntity[] = [];
		const pastInvestments: InvestmentEntity[] = [];
		this.props.investments.forEach((investment) => {
			if (investment.active) {
				activeInvestments.push(investment);
			} else {
				pastInvestments.push(investment);
			}
		});

		return (
			<MainWrapper>
				<Header title="Your investments" />
				<InvestmentsMetrics investments={this.props.investments} />
				{ activeInvestments.map((investment) => (
						<ActiveInvestment investment={investment} key={investment.id} />
					))
				}
				<InvestmentHistory investments={pastInvestments} />
			</MainWrapper>
		);
	}
}

export { Investments };
