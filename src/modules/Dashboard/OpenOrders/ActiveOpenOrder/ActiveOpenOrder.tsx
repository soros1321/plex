import * as React from "react";
import { DebtOrderEntity } from "src/models";
import {
    getIdenticonImgSrc,
    shortenString,
    amortizationUnitToFrequency,
    debtOrderFromJSON,
} from "src/utils";
import {
    Wrapper,
    ImageContainer,
    IdenticonImage,
    DetailContainer,
    Amount,
    Url,
    StatusPending,
    Terms,
    DetailLink,
    Drawer,
    InfoItem,
    InfoItemTitle,
    InfoItemContent,
    PendingActionContainer,
    CancelButton,
    ShareButton,
} from "./styledComponents";
import { ConfirmationModal, Bold } from "src/components";
import { Row, Col, Collapse } from "reactstrap";
import Dharma from "@dharmaprotocol/dharma.js";
import { TokenAmount } from "src/components";
import { web3Errors } from "src/common/web3Errors";

interface Props {
    debtOrder: DebtOrderEntity;
    dharma: Dharma;
    accounts: string[];
    handleSetErrorToast: (errorMessage: string) => void;
    handleSetSuccessToast: (successMessage: string) => void;
    handleCancelDebtOrder: (issuanceHash: string) => void;
}

interface State {
    collapse: boolean;
    awaitingCancelTx: boolean;
    confirmationModal: boolean;
}

class ActiveOpenOrder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            awaitingCancelTx: false,
            confirmationModal: false,
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
        this.handleCancelDebtOrderClick = this.handleCancelDebtOrderClick.bind(this);
        this.handleCancelDebtOrderSubmission = this.handleCancelDebtOrderSubmission.bind(this);
    }

    toggleDrawer() {
        this.setState({ collapse: !this.state.collapse });
    }

    confirmationModalToggle() {
        this.setState({
            confirmationModal: !this.state.confirmationModal,
        });
    }

    handleCancelDebtOrderClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        this.confirmationModalToggle();
    }

    async handleCancelDebtOrderSubmission() {
        try {
            const {
                dharma,
                debtOrder,
                accounts,
                handleCancelDebtOrder,
                handleSetSuccessToast,
                handleSetErrorToast,
            } = this.props;

            handleSetErrorToast("");
            if (!dharma) {
                handleSetErrorToast(web3Errors.UNABLE_TO_FIND_CONTRACTS);
                return;
            } else if (!accounts.length) {
                handleSetErrorToast(web3Errors.UNABLE_TO_FIND_ACCOUNTS);
                return;
            } else if (!debtOrder.json) {
                handleSetErrorToast("Unable to get debt order info");
                return;
            }

            const dharmaDebtOrder = debtOrderFromJSON(debtOrder.json);
            if (dharmaDebtOrder.debtor !== accounts[0]) {
                this.confirmationModalToggle();
                handleSetErrorToast(
                    "Debt order can only be cancelled by the specified order's debtor",
                );
            } else {
                dharma.order
                    .cancelOrderAsync(dharmaDebtOrder, { from: accounts[0] })
                    .then((txHash) => {
                        this.setState({ awaitingCancelTx: true });
                        return dharma.blockchain.awaitTransactionMinedAsync(txHash, 1000, 60000);
                    })
                    .then((receipt) => {
                        return dharma.blockchain.getErrorLogs(receipt.transactionHash);
                    })
                    .then(async (errors) => {
                        this.setState({ awaitingCancelTx: false });
                        this.confirmationModalToggle();

                        if (errors.length > 0) {
                            handleSetErrorToast(errors[0]);
                        } else {
                            handleCancelDebtOrder(debtOrder.issuanceHash);

                            handleSetSuccessToast(
                                `Debt agreement ${shortenString(
                                    debtOrder.issuanceHash,
                                )} is cancelled successfully`,
                            );
                        }
                    })
                    .catch((err) => {
                        if (err.message.includes("User denied transaction signature")) {
                            handleSetErrorToast("Wallet has denied transaction.");
                        } else {
                            handleSetErrorToast(err.message);
                        }
                        this.confirmationModalToggle();
                        this.setState({ awaitingCancelTx: false });
                    });
            }
        } catch (e) {
            this.confirmationModalToggle();
            this.props.handleSetErrorToast(e.message);
        }
    }

    render() {
        const { debtOrder } = this.props;
        if (!debtOrder) {
            return null;
        }

        const identiconImgSrc = getIdenticonImgSrc(debtOrder.issuanceHash, 60, 0.1);
        const detailLink =
            debtOrder.status === "pending" ? (
                <DetailLink to={`/request/success/${debtOrder.issuanceHash}`}>
                    {shortenString(debtOrder.issuanceHash)}
                </DetailLink>
            ) : (
                shortenString(debtOrder.issuanceHash)
            );

        const confirmationModalContent = (
            <span>
                Are you sure you want to cancel debt agreement{" "}
                <Bold>{shortenString(debtOrder.issuanceHash)}</Bold>
            </span>
        );
        let terms = "Simple Interest (Non-Collateralized)";
        let collateral = null;
        let gracePeriod = null;

        if (debtOrder.collateralized) {
            terms = "Simple Interest (Collateralized)";
            collateral = (
                <Col xs="4" sm="4" md="4" lg="2">
                    <InfoItem>
                        <InfoItemTitle>Collateral</InfoItemTitle>
                        <InfoItemContent>
                            {debtOrder.collateralAmount + " " + debtOrder.collateralTokenSymbol}
                        </InfoItemContent>
                    </InfoItem>
                </Col>
            );
            gracePeriod = (
                <Col xs="8" sm="8" md="8" lg="2">
                    <InfoItem>
                        <InfoItemTitle>Grace period</InfoItemTitle>
                        <InfoItemContent>{debtOrder.gracePeriodInDays + " days"}</InfoItemContent>
                    </InfoItem>
                </Col>
            );
        }

        return (
            <Wrapper onClick={this.toggleDrawer}>
                <Row>
                    <ImageContainer>
                        {identiconImgSrc && <IdenticonImage src={identiconImgSrc} />}
                    </ImageContainer>
                    <DetailContainer>
                        <Amount>
                            <TokenAmount
                                tokenAmount={debtOrder.principalAmount}
                                tokenSymbol={debtOrder.principalTokenSymbol}
                            />
                        </Amount>
                        <Url>{detailLink}</Url>
                        <StatusPending>Pending</StatusPending>
                        <Terms>{terms}</Terms>
                    </DetailContainer>
                    <PendingActionContainer>
                        <CancelButton onClick={this.handleCancelDebtOrderClick}>
                            Cancel
                        </CancelButton>
                        <ShareButton to={`/request/success/${debtOrder.issuanceHash}`}>
                            Share
                        </ShareButton>
                    </PendingActionContainer>
                </Row>
                <Collapse isOpen={this.state.collapse}>
                    <Drawer>
                        <Row>
                            <Col xs="4" sm="4" md="4" lg="2">
                                <InfoItem>
                                    <InfoItemTitle>Requested</InfoItemTitle>
                                    <InfoItemContent>
                                        <TokenAmount
                                            tokenAmount={debtOrder.principalAmount}
                                            tokenSymbol={debtOrder.principalTokenSymbol}
                                        />
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="4" sm="4" md="4" lg="2">
                                <InfoItem>
                                    <InfoItemTitle>Term Length</InfoItemTitle>
                                    <InfoItemContent>
                                        {debtOrder.termLength.toNumber() +
                                            " " +
                                            debtOrder.amortizationUnit}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="4" sm="4" md="4" lg="2">
                                <InfoItem>
                                    <InfoItemTitle>Interest Rate</InfoItemTitle>
                                    <InfoItemContent>
                                        {debtOrder.interestRate.toNumber() + "%"}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="8" sm="8" md="8" lg="2">
                                <InfoItem>
                                    <InfoItemTitle>Installment Frequency</InfoItemTitle>
                                    <InfoItemContent>
                                        {amortizationUnitToFrequency(debtOrder.amortizationUnit)}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            {collateral}
                            {gracePeriod}
                            <Col xs="12" sm="12" md="12" lg="2">
                                <InfoItem>
                                    <InfoItemTitle>Description</InfoItemTitle>
                                    <InfoItemContent>
                                        {debtOrder.description ? debtOrder.description : "-"}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                        </Row>
                    </Drawer>
                </Collapse>
                <ConfirmationModal
                    modal={this.state.confirmationModal}
                    title="Please confirm"
                    content={confirmationModalContent}
                    onToggle={this.confirmationModalToggle}
                    onSubmit={this.handleCancelDebtOrderSubmission}
                    closeButtonText="No"
                    awaitingTx={this.state.awaitingCancelTx}
                    submitButtonText={this.state.awaitingCancelTx ? "Canceling Order..." : "Yes"}
                />
            </Wrapper>
        );
    }
}

export { ActiveOpenOrder };
