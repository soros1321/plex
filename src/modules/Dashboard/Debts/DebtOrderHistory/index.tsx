import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
// import { formatDate } from '../../../../utils';
import {
	Wrapper,
	Title,
	DebtOrderHistoryTable
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class DebtOrderHistory extends React.Component<Props, {}> {
	render() {
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
							/*
							this.props.debtOrders.map((debt) => (
							<tr key={loan.id}>
								<td>{loan.amount} {loan.currency}</td>
								<td>{loan.id}</td>
								<td>{loan.paid ? 'Repaid ' + formatDate(loan.paidOnTimestamp) : '-'}</td>
								<td className="terms">{loan.terms} Interest{loan.installments ? ' (Installments)' : ''}</td>
							</tr>
							))
							*/
						}
					</tbody>
				</DebtOrderHistoryTable>
			</Wrapper>
		);
	}
}

export { DebtOrderHistory };
