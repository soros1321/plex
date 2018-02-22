import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import { BigNumber } from 'bignumber.js';
import {
	Wrapper,
	HalfCol,
	Value,
	Label,
	Divider
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class DebtsMetrics extends React.Component<Props, {}> {
	render() {
		let totalREPRequested: BigNumber = new BigNumber(0);
		let totalMKRRequested: BigNumber = new BigNumber(0);
		let totalZRXRequested: BigNumber = new BigNumber(0);
		let totalRepayed: number = 0;
		this.props.debtOrders.forEach((debtOrder) => {
			switch (debtOrder.principalTokenSymbol) {
				case 'REP':
					totalREPRequested = totalREPRequested.plus(debtOrder.principalAmount);
					break;
				case 'MKR':
					totalMKRRequested = totalMKRRequested.plus(debtOrder.principalAmount);
					break;
				case 'ZRX':
					totalZRXRequested = totalZRXRequested.plus(debtOrder.principalAmount);
					break;
				default:
					break;
			}
		});
		return (
			<Wrapper>
				<HalfCol>
					<Value>
						{totalREPRequested.toNumber()} REP
						<Divider>|</Divider>
						{totalMKRRequested.toNumber()} MKR
						<Divider>|</Divider>
						{totalZRXRequested.toNumber()} ZRX
					</Value>
					<Label>Total Requested</Label>
				</HalfCol>
				<HalfCol>
					<Value>
						{totalRepayed} REP
						<Divider>|</Divider>
						{totalRepayed} MKR
						<Divider>|</Divider>
						{totalRepayed} ZRX
					</Value>
					<Label>Total Repayed</Label>
				</HalfCol>
			</Wrapper>
		);
	}
}

export { DebtsMetrics };
