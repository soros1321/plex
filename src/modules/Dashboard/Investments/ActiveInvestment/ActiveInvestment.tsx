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
    Amount,
    DetailContainer,
    DetailLink,
    Drawer,
    IdenticonImage,
    ImageContainer,
    InfoItem,
    InfoItemContent,
    InfoItemTitle,
    PaymentDate,
    RepaymentScheduleContainer,
    Schedule,
    ScheduleIconContainer,
    SeizeCollateralButton,
    ShowMore,
    StatusActive,
    StatusDefaulted,
    Strikethrough,
    Terms,
    Title,
    // TransferButton,
    Url,
    Wrapper,
} from "./styledComponents";
import { Bold, ConfirmationModal } from "../../../../components";
import { ScheduleIcon } from "../../../../components/scheduleIcon/scheduleIcon";
import { Row, Col, Collapse } from "reactstrap";
import { TokenAmount } from "src/components";
import { BLOCKCHAIN_API } from "../../../../common/constants";

interface Props {
    currentTime?: number;
    dharma: Dharma;
    investment: InvestmentEntity;
    setError: (errorMessage: string) => void;
    updateInvestment: (investment: InvestmentEntity) => void;
}

interface State {
    collapse: boolean;
    missedPayments: object;
    repaymentSchedule: number[];
    seizingCollateral: boolean;
    showSeizeCollateralModal: boolean;
}

class ActiveInvestment extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            missedPayments: {},
            repaymentSchedule: [],
            seizingCollateral: false,
            showSeizeCollateralModal: false,
        };
        this.handleSeizeCollateral = this.handleSeizeCollateral.bind(this);
        this.handleSeizeCollateralButtonClicked = this.handleSeizeCollateralButtonClicked.bind(
            this,
        );
        this.handleTransfer = this.handleTransfer.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleShowSeizeCollateralModal = this.toggleShowSeizeCollateralModal.bind(this);
    }

    componentDidMount() {
        this.calculatePaymentsMissed();
    }

    handleTransfer(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        const { investment } = this.props;
        console.log("Transfer: ", investment.issuanceHash);
    }

    async handleSeizeCollateral() {
        this.setState({ seizingCollateral: true });

        // We assume that the investment is collateralized
        const investment = this.props.investment;

        try {
            const transactionHash = await this.props.dharma.adapters.collateralizedSimpleInterestLoan.seizeCollateral(
                investment.issuanceHash,
            );

            const transactionReceipt = await this.props.dharma.blockchain.awaitTransactionMinedAsync(
                transactionHash,
                BLOCKCHAIN_API.POLLING_INTERVAL,
                BLOCKCHAIN_API.TIMEOUT,
            );

            if (!transactionReceipt || !transactionReceipt.status) {
                throw new Error("Unable to seize borrower's collateral.");
            }

            investment.collateralSeizable = false;
            this.props.updateInvestment(investment);
        } catch (e) {
            this.props.setError(e.message);
        }

        this.setState({
            seizingCollateral: false,
            showSeizeCollateralModal: false,
        });
    }

    handleSeizeCollateralButtonClicked(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        this.toggleShowSeizeCollateralModal();
    }

    toggleDrawer() {
        this.setState({ collapse: !this.state.collapse });
    }

    toggleShowSeizeCollateralModal() {
        this.setState({ showSeizeCollateralModal: !this.state.showSeizeCollateralModal });
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

        let seizeCollateralModalContent = <div />;
        if (
            investment.collateralSeizable &&
            investment.collateralAmount &&
            investment.collateralTokenSymbol
        ) {
            seizeCollateralModalContent = (
                <span>
                    Debt agreement <Bold>{shortenString(investment.issuanceHash)}</Bold> has
                    defaulted and its collateral is seizable. Would you like to seize the borrower's
                    collateral of{" "}
                    <TokenAmount
                        tokenAmount={investment.collateralAmount}
                        tokenSymbol={investment.collateralTokenSymbol}
                    />
                </span>
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
                            <Col xs="6" md="6">
                                {investment.collateralSeizable && (
                                    <SeizeCollateralButton
                                        onClick={this.handleSeizeCollateralButtonClicked}
                                    >
                                        Seize Collateral
                                    </SeizeCollateralButton>
                                )}
                            </Col>
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
                <ConfirmationModal
                    awaitingTx={this.state.seizingCollateral}
                    closeButtonText="No"
                    content={seizeCollateralModalContent}
                    modal={this.state.showSeizeCollateralModal}
                    onSubmit={this.handleSeizeCollateral}
                    onToggle={this.toggleShowSeizeCollateralModal}
                    submitButtonText={
                        this.state.seizingCollateral ? "Seizing Collateral..." : "Yes"
                    }
                    title={"Seize Collateral"}
                />
            </Wrapper>
        );
    }
}

export { ActiveInvestment };
