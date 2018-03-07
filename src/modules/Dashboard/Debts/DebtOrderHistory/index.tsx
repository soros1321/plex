import * as React from 'react';
import { DebtOrderMoreDetail } from '../../../../models';
import { shortenString } from '../../../../utils';
// import { formatDate } from '../../../../utils';
import {
	Wrapper,
	Title,
	DebtOrderHistoryTable
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderMoreDetail[];
}

class DebtOrderHistory extends React.Component<Props, {}> {
	render() {
		const { debtOrders } = this.props;
		return (
			<Wrapper>
				<Title>Past debts and loan request</Title>
				<DebtOrderHistoryTable hover={true}>
					<thead>
						<tr>
							<th>Amount</th>
							<th>ID</th>
							<th>Status</th>
							<th>Terms</th>
						</tr>
					</thead>
					<tbody>
						{
							debtOrders.map((debtOrder) => (
								<tr key={debtOrder.identifier}>
									<td>{debtOrder.principalAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol}</td>
									<td>{shortenString(debtOrder.identifier)}</td>
									<td>{debtOrder.principalAmount.eq(debtOrder.repaidAmount) ? 'Paid' : 'Unpaid'}</td>
									<td className="terms">
										{(debtOrder.termLength && debtOrder.amortizationUnit ? debtOrder.termLength.toNumber() + ' ' + debtOrder.amortizationUnit : '-')}
									</td>
								</tr>
							))
						}
					</tbody>
				</DebtOrderHistoryTable>
			</Wrapper>
		);
	}
}

export { DebtOrderHistory };
