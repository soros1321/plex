import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
/*
import {
	formatDate,
	formatTime,
	getIdenticonImgSrc,
	shortenString
} from '../../../../utils';
import { Row } from 'reactstrap';
import {
	Wrapper,
	ImageContainer,
	IdenticonImage,
	DetailContainer,
	HalfCol,
	Amount,
	Url,
	CollectButton,
	StatusActive,
	StatusDefaulted,
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
*/

interface Props {
	investment: InvestmentEntity;
}

/*
interface RepaymentSchedule {
	timestamp: number;
	type: string;
}
*/

class ActiveInvestment extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.handleCollectInvestment = this.handleCollectInvestment.bind(this);
	}

	handleCollectInvestment(investmentId: string) {
		console.log('collect investment', investmentId);
	}

	render() {
		return null;
		/*
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
							<Schedule key={paymentSchedule.timestamp}>
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
							<Schedule key={paymentSchedule.timestamp}>
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

		const identiconImgSrc = getIdenticonImgSrc(investment.id, 60, 0.1);
		return (
			<Wrapper>
				<ImageContainer>
					{identiconImgSrc && (
						<IdenticonImage src={identiconImgSrc} />
					)}
				</ImageContainer>
				<DetailContainer>
					<Row>
						<HalfCol>
							<Amount>{investment.amountLended} {investment.currency}</Amount>
							<Url href="#">{shortenString(investment.id)}</Url>
						</HalfCol>
						<HalfCol>
							{(investment.defaulted && !investment.collected) && (
								<CollectButton className="button" onClick={() => this.handleCollectInvestment(investment.id)}>Collect Now</CollectButton>
							)}
						</HalfCol>
					</Row>
					{investment.defaulted ? <StatusDefaulted>Defaulted</StatusDefaulted> : <StatusActive>Active</StatusActive>}
					<Terms>{investment.terms} Interest{investment.installments ? ' (Installments)' : ''}</Terms>
				</DetailContainer>
				<RepaymentScheduleContainer>
					<Title>Repayment Schedule</Title>
					{repaymentScheduleItems}
				</RepaymentScheduleContainer>
			</Wrapper>
		);
		*/
	}
}

export { ActiveInvestment };
