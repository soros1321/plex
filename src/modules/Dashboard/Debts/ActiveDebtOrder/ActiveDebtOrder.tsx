import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import {
	formatDate,
	formatTime,
	getIdenticonImgSrc,
	shortenString,
	amortizationUnitToFrequency,
	debtOrderFromJSON
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
	DetailLink,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent,
	MakeRepaymentButton,
	Schedule,
	ScheduleIconContainer,
	ScheduleIcon,
	Strikethrough,
	ShowMore,
	PaymentDate
} from './styledComponents';
import { Row, Col, Collapse } from 'reactstrap';
import Dharma from '@dharmaprotocol/dharma.js';

interface Props {
	dharma: Dharma;
	debtOrder: DebtOrderEntity;
}

interface State {
	collapse: boolean;
	repaymentSchedule: number[];
}

class ActiveDebtOrder extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapse: false,
			repaymentSchedule: []
		};
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.makeRepayment = this.makeRepayment.bind(this);
	}

	async componentDidMount() {
		if (this.props.dharma && this.props.debtOrder) {
			await this.getRepaymentSchedule(this.props.dharma, this.props.debtOrder);
		}
	}

	async componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.debtOrder) {
			await this.getRepaymentSchedule(nextProps.dharma, nextProps.debtOrder);
		}
	}

	async getRepaymentSchedule(dharma: Dharma, debtOrder: DebtOrderEntity) {
		try {
			if (debtOrder.status === 'active') {
				const debtRegistry = await dharma.servicing.getDebtRegistryEntry(debtOrder.issuanceHash);
				const repaymentSchedule = await dharma.adapters.simpleInterestLoan.getRepaymentSchedule(debtRegistry);
				this.setState({ repaymentSchedule });
			}
		} catch (e) {
			// console.log(e);
		}
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
		const { repaymentSchedule } = this.state;
		const debtOrderInfo = debtOrderFromJSON(debtOrder.json);

		const now = Math.round((new Date()).getTime() / 1000);
		const pastIcon = require('../../../../assets/img/ok_circle.png');
		const futureIcon = require('../../../../assets/img/circle_outline.png');

		const repaymentScheduleItems: JSX.Element[] = [];
		let maxDisplay = 0;
		repaymentSchedule.forEach((paymentSchedule) => {
			if (maxDisplay < 5) {
				if (maxDisplay === 4 && repaymentSchedule.length > 5) {
					repaymentScheduleItems.push((
							<Schedule className="active" key={paymentSchedule}>
								<ScheduleIconContainer>
									<ScheduleIcon src={futureIcon} />
								</ScheduleIconContainer>
								<Strikethrough />
								<ShowMore>+ {repaymentSchedule.length - maxDisplay} more</ShowMore>
							</Schedule>
						)
					);
				} else {
					repaymentScheduleItems.push((
							<Schedule className={(now > paymentSchedule ? '' : 'active')} key={paymentSchedule}>
								<ScheduleIconContainer>
									<ScheduleIcon src={now > paymentSchedule ? pastIcon : futureIcon} />
								</ScheduleIconContainer>
								<Strikethrough />
								<PaymentDate>{debtOrder.amortizationUnit !== 'hours' ? formatDate(paymentSchedule) : formatTime(paymentSchedule)}</PaymentDate>
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
								<Amount>{debtOrderInfo!.principalAmount!.toNumber()} {debtOrder.principalTokenSymbol}</Amount>
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
										{debtOrderInfo!.principalAmount!.toNumber() + ' ' + debtOrder.principalTokenSymbol}
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
