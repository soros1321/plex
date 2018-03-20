import * as React from 'react';
import { InvestmentMoreDetail } from '../../../../models';
import {
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
	StatusDefaulted,
	Terms,
	RepaymentScheduleContainer,
	Title,
	DetailLink,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent,
	TransferButton
} from './styledComponents';
import { Row, Col, Collapse } from 'reactstrap';

interface Props {
	investment: InvestmentMoreDetail;
}

/*
interface RepaymentSchedule {
	timestamp: number;
	type: string;
}
*/

interface State {
	collapse: boolean;
}

class ActiveInvestment extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapse: false
		};
		this.handleTransfer = this.handleTransfer.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
	}

	handleTransfer(event: React.MouseEvent<HTMLElement>) {
		event.stopPropagation();
		const { investment } = this.props;
		console.log('Transfer: ', investment.issuanceHash);
	}

	toggleDrawer() {
		this.setState({ collapse: !this.state.collapse });
	}

	render() {
		const { investment } = this.props;
		/*
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
		*/

		const repaymentScheduleItems: JSX.Element[] = [];
		/*
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
		*/

		const identiconImgSrc = getIdenticonImgSrc(investment.issuanceHash, 60, 0.1);
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
								<Amount>{investment!.principalAmount!.toNumber() + ' ' + investment.principalTokenSymbol}</Amount>
								<Url>
									<DetailLink to={`/request/success/${investment.issuanceHash}`}>
										{shortenString(investment.issuanceHash)}
									</DetailLink>
								</Url>
							</Col>
							<Col xs="12" md="6">
								{investment.status === 'active' && (
									<TransferButton onClick={this.handleTransfer}>Transfer</TransferButton>
								)}
							</Col>
						</Row>
						{investment.status === 'active' ? <StatusActive>Active</StatusActive> : <StatusDefaulted>Defaulted</StatusDefaulted>}
						<Terms>Simple Interest (Non-Collateralized)</Terms>
					</DetailContainer>
					<RepaymentScheduleContainer>
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
										Lended
									</InfoItemTitle>
									<InfoItemContent>
										{investment!.principalAmount!.toNumber() + ' ' + investment.principalTokenSymbol}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Earned
									</InfoItemTitle>
									<InfoItemContent>
										{investment.earnedAmount.toNumber() + ' ' + investment.principalTokenSymbol}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Term Length
									</InfoItemTitle>
									<InfoItemContent>
										{investment.termLength.toNumber() + ' ' + investment.amortizationUnit}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Interest Rate
									</InfoItemTitle>
									<InfoItemContent>
										{investment.interestRate.toNumber() + '%'}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Installment Frequency
									</InfoItemTitle>
									<InfoItemContent>
										{amortizationUnitToFrequency(investment.amortizationUnit)}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Description
									</InfoItemTitle>
									<InfoItemContent>
										{investment.description}
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

export { ActiveInvestment };
