import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
/*
import {
	Wrapper,
	HalfCol,
	Value,
	Label
} from './styledComponents';
*/

interface Props {
	investments: InvestmentEntity[];
}

class InvestmentsMetrics extends React.Component<Props, {}> {
	render() {
		return null;
		/*
		let totalLended: number = 0;
		let totalEarned: number = 0;
		this.props.investments.forEach((investment) => {
			totalLended += investment.amountLended;
			totalEarned += investment.amountPaid;
		});
		return (
			<Wrapper>
				<HalfCol>
					<Value>{totalLended} ETH</Value>
					<Label>Total Lended</Label>
				</HalfCol>
				<HalfCol>
					<Value>{totalEarned} ETH</Value>
					<Label>Total Earned</Label>
				</HalfCol>
			</Wrapper>
		);
		*/
	}
}

export { InvestmentsMetrics };
