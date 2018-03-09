import * as React from 'react';
import { DebtOrderMoreDetail } from '../../../../models';
import {
	formatDate,
	formatTime,
	getIdenticonImgSrc,
	shortenString,
	amortizationUnitToFrequency
} from '../../../../utils';
import {
	Wrapper,
	ImageContainer,
	IdenticonImage,
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
	ShowMore,
	DetailLink,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent,
	MakeRepaymentButton
} from './styledComponents';
import { Row, Col, Collapse } from 'reactstrap';

interface Props {
	debtOrder: DebtOrderMoreDetail;
}

interface RepaymentSchedule {
	timestamp: number;
	type: string;
}

interface State {
	collapse: boolean;
}

class ActiveDebtOrder extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapse: false
		};
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.makeRepayment = this.makeRepayment.bind(this);
	}

	toggleDrawer() {
		this.setState({ collapse: !this.state.collapse });
	}

	makeRepayment(event: React.MouseEvent<HTMLElement>) {
		event.stopPropagation();
		const { debtOrder } = this.props;
		console.log('Make repayment: ' + debtOrder.issuanceHash);
	}

	render() {
		const { debtOrder } = this.props;
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

		const identiconImgSrc = getIdenticonImgSrc(debtOrder.issuanceHash, 60, 0.1);

		return (
			<Wrapper onClick={this.toggleDrawer}>
				<Row>
					<ImageContainer>
						{identiconImgSrc && (
							<IdenticonImage src={identiconImgSrc} />
						)}
					</ImageContainer>
					<DetailContainer>
						<Row>
							<Col xs="12" md="6">
								<Amount>{debtOrder.principalAmount.toNumber()} {debtOrder.principalTokenSymbol}</Amount>
								<Url>
									<DetailLink to={`/request/success/${debtOrder.issuanceHash}`}>
										{shortenString(debtOrder.issuanceHash)}
									</DetailLink>
								</Url>
							</Col>
							<Col xs="12" md="6">
								{debtOrder.status === 'active' && (
									<MakeRepaymentButton onClick={this.makeRepayment}>Make Repayment</MakeRepaymentButton>
								)}
							</Col>
						</Row>
						{debtOrder.status === 'active' ? <StatusActive>Active</StatusActive> : <StatusPending>Pending</StatusPending>}
						<Terms>Simple Interest (Non-Collateralized)</Terms>
					</DetailContainer>
					<RepaymentScheduleContainer className={debtOrder.status === 'active' ? 'active' : ''}>
						<Title>Repayment Schedule</Title>
						{repaymentScheduleItems}
					</RepaymentScheduleContainer>
				</Row>
				<Collapse isOpen={this.state.collapse}>
					<Drawer>
						<Row>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Requested
									</InfoItemTitle>
									<InfoItemContent>
										{debtOrder.principalAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Repaid
									</InfoItemTitle>
									<InfoItemContent>
										{debtOrder.repaidAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Term Length
									</InfoItemTitle>
									<InfoItemContent>
										{debtOrder.termLength.toNumber() + ' ' + debtOrder.amortizationUnit}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Interest Rate
									</InfoItemTitle>
									<InfoItemContent>
										{debtOrder.interestRate.toNumber() + '%'}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Installment Frequency
									</InfoItemTitle>
									<InfoItemContent>
										{amortizationUnitToFrequency(debtOrder.amortizationUnit)}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Description
									</InfoItemTitle>
									<InfoItemContent>
										{debtOrder.description}
									</InfoItemContent>
								</InfoItem>
							</Col>
						</Row>
					</Drawer>
				</Collapse>
			</Wrapper>
		);
	}
}

export { ActiveDebtOrder };
