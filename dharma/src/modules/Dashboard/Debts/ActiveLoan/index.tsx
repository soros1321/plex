import * as React from 'react';
import { LoanEntity } from '../../../../models';
import { Row, Col } from 'reactstrap';
import './ActiveLoan.css';

interface Props {
	loan: LoanEntity;
}

interface RepaymentSchedule {
	timestamp: number;
	type: string;
}

class ActiveLoan extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);

		this.formatDate = this.formatDate.bind(this);
	}

	formatDate(timestamp: number, type: string) {
		const d = new Date(timestamp * 1000);
		return (type === 'date') ? d.toLocaleDateString() : d.toLocaleTimeString();
	}

	render() {
		const loan = this.props.loan;
		const now = Math.round((new Date()).getTime() / 1000);
		const pastIcon = require('../../../../assets/img/ok_circle.png');
		const futureIcon = require('../../../../assets/img/circle_outline.png');
		const repaymentSchedules: RepaymentSchedule[] = [];
		let repaymentDate = loan.createdOnDate;
		if (loan.installments) {
			let count = 0;
			switch (loan.collateralLockupPeriod) {
				case '1day':
					while (count < 4) {
						repaymentDate += (60 * 60 * 4); // per 4 hours
						repaymentSchedules.push({timestamp: repaymentDate, type: 'time'});
						count++;
					}
					break;
				case '1week':
					while (count < 7) {
						repaymentDate += (60 * 60 * 24); // per day
						repaymentSchedules.push({timestamp: repaymentDate, type: 'date'});
						count++;
					}
					break;
				case 'custom':
					if (loan.collateralCustomLockupPeriod) {
						while (count < loan.collateralCustomLockupPeriod) {
							repaymentDate += (60 * 60 * 24 * 7); // per week
							repaymentSchedules.push({timestamp: repaymentDate, type: 'date'});
							count++;
						}
					}
					break;
				default:
					break;
			}
		} else {
			switch (loan.collateralLockupPeriod) {
				case '1day':
					repaymentDate += (60 * 60 * 24);
					break;
				case '1week':
					repaymentDate += (60 * 60 * 24 * 7);
					break;
				case 'custom':
					if (loan.collateralCustomLockupPeriod) {
						repaymentDate += (60 * 60 * 24 * loan.collateralCustomLockupPeriod);
					}
					break;
				default:
					break;
			}
			repaymentSchedules.push({timestamp: repaymentDate, type: 'date'});
		}

		const repaymentScheduleItems: JSX.Element[] = [];
		let maxDisplay = 0;
		repaymentSchedules.forEach((paymentSchedule) => {
			if (maxDisplay < 5) {
				if (maxDisplay === 4 && repaymentSchedules.length > 5) {
					repaymentScheduleItems.push((
							<div className={'date-container active'} key={paymentSchedule.timestamp}>
								<div className="date-icon">
										<img src={futureIcon} />
								</div>
								<div className="strikethrough" />
								<div className="more">+ {repaymentSchedules.length - maxDisplay} more</div>
							</div>
						)
					);
				} else {
					repaymentScheduleItems.push((
							<div className={'date-container ' + (now > paymentSchedule.timestamp ? '' : 'active')} key={paymentSchedule.timestamp}>
								<div className="date-icon">
										<img src={now > paymentSchedule.timestamp ? pastIcon : futureIcon} />
								</div>
								<div className="strikethrough" />
								<div className="repayment-date">{this.formatDate(paymentSchedule.timestamp, paymentSchedule.type)}</div>
							</div>
						)
					);
				}
			}
			maxDisplay++;
		});

		return (
			<Row className="active-loan-container">
				<Col xs="4" md="1" className="image-container">
					<div className="image" />
				</Col>
				<Col xs="8" md="5" className="detail-container">
					<div className="amount">{loan.amount} {loan.currency}</div>
					<div className="url"><a href={`dharma.io/${loan.id}`}>{`dharma.io/${loan.id}`}</a></div>
					<div className="active">Active</div>
					<div className="terms">{loan.terms} Interest{loan.installments ? ' (Installments)' : ''}</div>
				</Col>
				<Col xs="12" md="6" className="repayment-container">
					<div className="title">Repayment Schedule</div>
					{repaymentScheduleItems}
				</Col>
			</Row>
		);
	}
}

export { ActiveLoan };
