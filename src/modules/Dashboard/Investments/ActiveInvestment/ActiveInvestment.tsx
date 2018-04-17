import * as React from "react";
import Dharma from "@dharmaprotocol/dharma.js";
import { InvestmentEntity } from "../../../../models";
import {
    formatDate,
    formatTime,
    getIdenticonImgSrc,
    shortenString,
    amortizationUnitToFrequency,
} from "../../../../utils";
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
    Schedule,
    ScheduleIconContainer,
    Strikethrough,
    PaymentDate,
    ShowMore,
    Title,
    DetailLink,
    Drawer,
    InfoItem,
    InfoItemTitle,
    InfoItemContent,
    // TransferButton
} from "./styledComponents";
import { ScheduleIcon } from "../../../../components/scheduleIcon/scheduleIcon";
import { Row, Col, Collapse } from "reactstrap";
import { TokenAmount } from "src/components";

interface Props {
    currentTime?: number;
    dharma: Dharma;
    investment: InvestmentEntity;
}

interface State {
    collapse: boolean;
    missedPayments: object;
    repaymentSchedule: number[];
}

class ActiveInvestment extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            missedPayments: {},
            repaymentSchedule: [],
        };
        this.handleTransfer = this.handleTransfer.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    componentDidMount() {
        this.calculatePaymentsMissed();
    }

    handleTransfer(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        const { investment } = this.props;
        console.log("Transfer: ", investment.issuanceHash);
    }

    toggleDrawer() {
        this.setState({ collapse: !this.state.collapse });
    }

    async calculatePaymentsMissed() {
        const { dharma } = this.props;
        if (!dharma) {
            return;
        }
        const { issuanceHash, earnedAmount, repaymentSchedule } = this.props.investment;

        let missedPayments = {};
        let paymentDate;
        let expectedRepaidAmount;

        for (let i = 0; i < repaymentSchedule.length; i++) {
            paymentDate = repaymentSchedule[i];
            expectedRepaidAmount = await dharma.servicing.getExpectedValueRepaid(
                issuanceHash,
                paymentDate,
            );
            missedPayments[paymentDate] = earnedAmount < expectedRepaidAmount;
        }

        this.setState({ missedPayments });
    }

    render() {
        const { currentTime, investment } = this.props;
        if (!investment || currentTime === undefined) {
            return null;
        }
        const repaymentSchedule = investment.repaymentSchedule;
        const now = currentTime;
        const repaymentScheduleItems: JSX.Element[] = [];
        let maxDisplay = 0;
        let selected = false;
        let selectedPaymentSchedule = 0;
        repaymentSchedule.forEach((paymentSchedule) => {
            if (maxDisplay < 5) {
                let repaymentState;

                if (now > paymentSchedule) {
                    if (this.state.missedPayments[paymentSchedule]) {
                        repaymentState = "missed";
                    } else {
                        repaymentState = "past";
                    }
                } else {
                    repaymentState = "future";
                }

                if (maxDisplay === 4 && repaymentSchedule.length > 5) {
                    repaymentScheduleItems.push(
                        <Schedule key={paymentSchedule}>
                            <ScheduleIconContainer>
                                <ScheduleIcon state={repaymentState} />
                            </ScheduleIconContainer>
                            <Strikethrough />
                            <ShowMore>+ {repaymentSchedule.length - maxDisplay} more</ShowMore>
                        </Schedule>,
                    );
                } else {
                    if (now <= paymentSchedule && !selected) {
                        selectedPaymentSchedule = paymentSchedule;
                        selected = true;
                    }
                    repaymentScheduleItems.push(
                        <Schedule
                            className={selectedPaymentSchedule === paymentSchedule ? "active" : ""}
                            key={paymentSchedule}
                        >
                            <ScheduleIconContainer>
                                <ScheduleIcon state={repaymentState} />
                            </ScheduleIconContainer>
                            <Strikethrough />
                            <PaymentDate>
                                {investment.amortizationUnit !== "hours"
                                    ? formatDate(paymentSchedule)
                                    : formatTime(paymentSchedule)}
                            </PaymentDate>
                        </Schedule>,
                    );
                }
            }
            maxDisplay++;
        });
        let terms = "Simple Interest (Non-Collateralized)";
        let collateral = null;
        let gracePeriod = null;

        if (investment.collateralized) {
            terms = "Simple Interest (Collateralized)";
            collateral = (
                <Col xs="4" md="2">
                    <InfoItem>
                        <InfoItemTitle>Collateral</InfoItemTitle>
                        <InfoItemContent>
                            {investment.collateralAmount + " " + investment.collateralTokenSymbol}
                        </InfoItemContent>
                    </InfoItem>
                </Col>
            );
            gracePeriod = (
                <Col xs="8" md="4">
                    <InfoItem>
                        <InfoItemTitle>Grace period</InfoItemTitle>
                        <InfoItemContent>{investment.gracePeriodInDays + " days"}</InfoItemContent>
                    </InfoItem>
                </Col>
            );
        }

        const identiconImgSrc = getIdenticonImgSrc(investment.issuanceHash, 60, 0.1);
        return (
            <Wrapper onClick={this.toggleDrawer}>
                <Row>
                    <ImageContainer>
                        {identiconImgSrc && <IdenticonImage src={identiconImgSrc} />}
                    </ImageContainer>
                    <DetailContainer>
                        <Row>
                            <Col xs="6" md="6">
                                <Amount>
                                    <TokenAmount
                                        tokenAmount={investment.principalAmount}
                                        tokenSymbol={investment.principalTokenSymbol}
                                    />
                                </Amount>
                                <Url>
                                    <DetailLink to={`/request/success/${investment.issuanceHash}`}>
                                        {shortenString(investment.issuanceHash)}
                                    </DetailLink>
                                </Url>
                            </Col>
                            {/*<Col xs="12" md="6">*/}
                            {/*{investment.status === 'active' && (*/}
                            {/*<TransferButton onClick={this.handleTransfer}>Transfer</TransferButton>*/}
                            {/*)}*/}
                            {/*</Col>*/}
                        </Row>
                        {investment.status === "active" ? (
                            <StatusActive>Active</StatusActive>
                        ) : (
                            <StatusDefaulted>Defaulted</StatusDefaulted>
                        )}
                        <Terms>{terms}</Terms>
                    </DetailContainer>
                    <RepaymentScheduleContainer>
                        <Title>Repayment Schedule</Title>
                        {repaymentScheduleItems}
                    </RepaymentScheduleContainer>
                </Row>
                <Collapse isOpen={this.state.collapse}>
                    <Drawer>
                        <Row>
                            <Col xs="4" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Lent</InfoItemTitle>
                                    <InfoItemContent>
                                        <TokenAmount
                                            tokenAmount={investment.principalAmount}
                                            tokenSymbol={investment.principalTokenSymbol}
                                        />
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="4" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Earned</InfoItemTitle>
                                    <InfoItemContent>
                                        <TokenAmount
                                            tokenAmount={investment.earnedAmount}
                                            tokenSymbol={investment.principalTokenSymbol}
                                        />
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="4" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Term Length</InfoItemTitle>
                                    <InfoItemContent>
                                        {investment.termLength.toNumber() +
                                            " " +
                                            investment.amortizationUnit}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="4" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Interest Rate</InfoItemTitle>
                                    <InfoItemContent>
                                        {investment.interestRate.toNumber() + "%"}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="8" md="4">
                                <InfoItem>
                                    <InfoItemTitle>Installment Frequency</InfoItemTitle>
                                    <InfoItemContent>
                                        {amortizationUnitToFrequency(investment.amortizationUnit)}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            {collateral}
                            {gracePeriod}
                        </Row>
                    </Drawer>
                </Collapse>
            </Wrapper>
        );
    }
}

export { ActiveInvestment };
