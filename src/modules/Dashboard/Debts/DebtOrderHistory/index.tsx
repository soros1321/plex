import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
// import { formatDate } from '../../../../utils';
import { Table } from 'reactstrap';
import './DebtOrderHistory.css';

interface Props {
	debtOrders: DebtOrderEntity[];
}

class DebtOrderHistory extends React.Component<Props, {}> {
	render() {
		return (
			<div className="debt-order-history-container">
				<div className="title">Past debts and loan request</div>
				<Table className="debt-order-history-table" hover={true}>
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
				</Table>
			</div>
		);
	}
}

export { DebtOrderHistory };
