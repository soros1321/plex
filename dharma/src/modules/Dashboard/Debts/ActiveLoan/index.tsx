import * as React from 'react';
import { LoanEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import './ActiveLoan.css';

interface Props {
	loan: LoanEntity;
}

class ActiveLoan extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);

		this.formatDate = this.formatDate.bind(this);
	}

	formatDate(timestamp: number) {
		const d = new Date(timestamp);
		const year = d.getFullYear() + '';
		return (d.getMonth() + 1) + '/' + d.getDate() + '/' + year.substring(0, 2);
	}

	render() {
		const loan = this.props.loan;
		const now = Math.round((new Date()).getTime() / 1000);
		const pastIcon = require('../../../../assets/img/ok_circle.png');
		const futureIcon = require('../../../../assets/img/circle_outline.png');

		return (
			<Row className="active-loan-container">
				<Col xs="4" md="1" className="image-container">
					<div className="image" />
				</Col>
				<Col xs="8" md="5" className="detail-container">
					<div className="amount">{loan.amount} {loan.currency}</div>
					<div className="url"><a href={`dharma.io/${loan.id}`}>{`dharma.io/${loan.id}`}</a></div>
					<div className="active">Active</div>
					<div className="terms">{loan.terms}</div>
				</Col>
				<Col xs="12" md="6" className="repayment-container">
					<div className="title">Repayment Schedule</div>
					{loan.repaymentSchedules.map((paymentSchedule) => (
						<div className={'date-container ' + (now > paymentSchedule.date ? 'inactive' : '')}>
							<div className="date-icon">
									<img src={now > paymentSchedule.date ? pastIcon : futureIcon} />
							</div>
							<div className="strikethrough" />
							<div className="repayment-date">{this.formatDate(paymentSchedule.date * 1000)}</div>
						</div>
					))
					}
				</Col>
			</Row>
		);
	}
}

export { ActiveLoan };
