import * as React from 'react';
import { LoanEntity } from '../../../../models';
import { Table } from 'reactstrap';
import './LoanHistory.css';

interface Props {
	loans: LoanEntity[];
}

class LoanHistory extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.formatDate = this.formatDate.bind(this);
	}

	formatDate(timestamp: number) {
		const d = new Date(timestamp * 1000);
		return d.toLocaleDateString();
	}

	render() {
		return (
			<div className="loan-history-container">
				<div className="title">Past debts and loan request</div>
				<Table className="loan-history-table" hover={true}>
					<thead>
						<tr>
							<th>Amount</th>
							<th>ID</th>
							<th>Status</th>
							<th>Terms</th>
						</tr>
					</thead>
					<tbody>
						{this.props.loans.map((loan) => (
							<tr key={loan.id}>
								<td>{loan.amount} {loan.currency}</td>
								<td>{loan.id}</td>
								<td>{loan.paid ? 'Repaid ' + this.formatDate(loan.paidOnTimestamp) : '-'}</td>
								<td className="terms">{loan.terms} Interest{loan.installments ? ' (Installments)' : ''}</td>
							</tr>
						))
						}
					</tbody>
				</Table>
			</div>
		);
	}
}

export { LoanHistory };
