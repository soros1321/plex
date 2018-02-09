import * as React from 'react';
import { InvestmentEntity } from '../../../models';
import { Header } from '../../../components';
import { InvestmentsMetrics } from './InvestmentsMetrics';
import { ActiveInvestment } from './ActiveInvestment';

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
			<div className="main-wrapper">
				<Header title="Your investments" />
				<InvestmentsMetrics investments={this.props.investments} />
				{ activeInvestments.map((investment) => (
						<ActiveInvestment investment={investment} key={investment.id} />
					))
				}
			</div>
		);
	}
}

export { Investments };
