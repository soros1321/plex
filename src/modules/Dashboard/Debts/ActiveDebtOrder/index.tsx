import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import { formatDate, formatTime } from '../../../../utils';
import {
	Wrapper,
	ImageContainer,
	Image,
	DetailContainer,
	Amount,
	Url,
	StatusActive,
	StatusPending,
	Terms,
	RepaymentScheduleContainer,
	Title,
	Schedule,
	ScheduleIconContainer,
	ScheduleIcon,
	Strikethrough,
	PaymentDate,
	ShowMore
} from './styledComponents';

interface Props {
	debtOrder: DebtOrderEntity;
}

interface RepaymentSchedule {
	timestamp: number;
	type: string;
}

class ActiveDebtOrder extends React.Component<Props, {}> {
	render() {
		const debtOrder = this.props.debtOrder;
		const now = Math.round((new Date()).getTime() / 1000);
		const pastIcon = require('../../../../assets/img/ok_circle.png');
		const futureIcon = require('../../../../assets/img/circle_outline.png');
		const repaymentSchedules: RepaymentSchedule[] = [];
		/*
		let repaymentTimestamp = loan.createdOnTimestamp;
		if (loan.installments) {
			let count = 0;
			switch (loan.collateralLockupPeriod) {
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
					if (loan.collateralCustomLockupPeriod) {
						while (count < loan.collateralCustomLockupPeriod) {
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
			switch (loan.collateralLockupPeriod) {
				case '1day':
					repaymentTimestamp += (60 * 60 * 24);
					break;
				case '1week':
					repaymentTimestamp += (60 * 60 * 24 * 7);
					break;
				case 'custom':
					if (loan.collateralCustomLockupPeriod) {
						repaymentTimestamp += (60 * 60 * 24 * loan.collateralCustomLockupPeriod);
					}
					break;
				default:
					break;
			}
			repaymentSchedules.push({timestamp: repaymentTimestamp, type: 'date'});
		}
		*/

		const repaymentScheduleItems: JSX.Element[] = [];
		let maxDisplay = 0;
		repaymentSchedules.forEach((paymentSchedule) => {
			if (maxDisplay < 5) {
				if (maxDisplay === 4 && repaymentSchedules.length > 5) {
					repaymentScheduleItems.push((
							<Schedule className="active" key={paymentSchedule.timestamp}>
								<ScheduleIconContainer>
										<ScheduleIcon src={futureIcon} />
								</ScheduleIconContainer>
								<Strikethrough />
								<ShowMore>+ {repaymentSchedules.length - maxDisplay} more</ShowMore>
							</Schedule>
						)
					);
				} else {
					repaymentScheduleItems.push((
							<Schedule className={(now > paymentSchedule.timestamp ? '' : 'active')} key={paymentSchedule.timestamp}>
								<ScheduleIconContainer>
										<ScheduleIcon src={now > paymentSchedule.timestamp ? pastIcon : futureIcon} />
								</ScheduleIconContainer>
								<Strikethrough />
								<PaymentDate>{paymentSchedule.type === 'date' ? formatDate(paymentSchedule.timestamp) : formatTime(paymentSchedule.timestamp)}</PaymentDate>
							</Schedule>
						)
					);
				}
			}
			maxDisplay++;
		});

		// TODO: need a way to figure out whether this debt order
		// is active or pending, i.e has start date?
		const active: boolean = false;
		return (
			<Wrapper>
				<ImageContainer>
					<Image />
				</ImageContainer>
				<DetailContainer>
					<Amount>{debtOrder.principalAmount.toNumber()} {debtOrder.principalTokenSymbol}</Amount>
					<Url href={`dharma.io/${debtOrder.debtorSignature.substring(0, 8)}`}>{`dharma.io/${debtOrder.debtorSignature.substring(0, 8)}`}</Url>
					{active ? <StatusActive>Active</StatusActive> : <StatusPending>Pending</StatusPending>}
					<Terms>Simple Interest (Installments)</Terms>
				</DetailContainer>
				<RepaymentScheduleContainer className={active ? 'active' : ''}>
					<Title>Repayment Schedule</Title>
					{repaymentScheduleItems}
				</RepaymentScheduleContainer>
			</Wrapper>
		);
	}
}

export { ActiveDebtOrder };
