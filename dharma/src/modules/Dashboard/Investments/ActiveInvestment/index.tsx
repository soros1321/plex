import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
import { formatDate, formatTime } from '../../../../utils';
import { Row, Col } from 'reactstrap';
import './ActiveInvestment.css';

interface Props {
	investment: InvestmentEntity;
}

interface RepaymentSchedule {
	timestamp: number;
	type: string;
}

class ActiveInvestment extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		const investment = this.props.investment;
		const now = Math.round((new Date()).getTime() / 1000);
		const pastIcon = require('../../../../assets/img/ok_circle.png');
		const futureIcon = require('../../../../assets/img/circle_outline.png');
		const repaymentSchedules: RepaymentSchedule[] = [];
		let repaymentTimestamp = investment.createdOnTimestamp;
		if (investment.installments) {
			let count = 0;
			switch (investment.collateralLockupPeriod) {
				case '1day':
					while (count < 4) {
						repaymentTimestamp += (60 * 60 * 4); // per 4 hours
						repaymentSchedules.push({timestamp: repaymentTimestamp, type: 'time'});
						count++;
					}
					break;
				case '1week':
					while (count < 7) {
						repaymentTimestamp += (60 * 60 * 24); // per day
						repaymentSchedules.push({timestamp: repaymentTimestamp, type: 'date'});
						count++;
					}
					break;
				case 'custom':
					if (investment.collateralCustomLockupPeriod) {
						while (count < investment.collateralCustomLockupPeriod) {
							repaymentTimestamp += (60 * 60 * 24 * 7); // per week
							repaymentSchedules.push({timestamp: repaymentTimestamp, type: 'date'});
							count++;
						}
					}
					break;
				default:
					break;
			}
		} else {
			switch (investment.collateralLockupPeriod) {
				case '1day':
					repaymentTimestamp += (60 * 60 * 24);
					break;
				case '1week':
					repaymentTimestamp += (60 * 60 * 24 * 7);
					break;
				case 'custom':
					if (investment.collateralCustomLockupPeriod) {
						repaymentTimestamp += (60 * 60 * 24 * investment.collateralCustomLockupPeriod);
					}
					break;
				default:
					break;
			}
			repaymentSchedules.push({timestamp: repaymentTimestamp, type: 'date'});
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
								<div className="repayment-date">{paymentSchedule.type === 'date' ? formatDate(paymentSchedule.timestamp) : formatTime(paymentSchedule.timestamp)}</div>
							</div>
						)
					);
				}
			}
			maxDisplay++;
		});

		return (
			<Row className="active-investment-container">
				<Col xs="4" md="1" className="image-container">
					<div className="image" />
				</Col>
				<Col xs="8" md="5" className="detail-container">
					<div className="amount">{investment.amountLended} {investment.currency}</div>
					<div className="url"><a href={`dharma.io/${investment.id}`}>{`dharma.io/${investment.id}`}</a></div>
					<div className={investment.defaulted ? 'defaulted' : 'active'}>{investment.defaulted ? 'Defaulted' : 'Active'}</div>
					<div className="terms">{investment.terms} Interest{investment.installments ? ' (Installments)' : ''}</div>
				</Col>
				<Col xs="12" md="6" className="repayment-container">
					<div className="title">Repayment Schedule</div>
					{repaymentScheduleItems}
				</Col>
			</Row>
		);
	}
}

export { ActiveInvestment };
