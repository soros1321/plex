import * as React from "react";
import { Link, browserHistory } from "react-router";
import { ClipLoader } from "react-spinners";

import { amortizationUnitToFrequency, shortenString, debtOrderFromJSON } from "../../../utils";
import { PaperLayout } from "../../../layouts";
import { Header, ConfirmationModal, MainWrapper, Bold } from "../../../components";
import { SuccessModal } from "./SuccessModal";
import { Col } from "reactstrap";
import {
    LoanInfoContainer,
    HalfCol,
    InfoItem,
    Title,
    Content,
    ButtonContainer,
    DeclineButton,
    FillLoanButton,
    LoaderContainer,
} from "./styledComponents";
import * as Web3 from "web3";
import Dharma from "@dharmaprotocol/dharma.js";
import { DebtOrder } from "@dharmaprotocol/dharma.js/dist/types/src/types";
import { BigNumber } from "bignumber.js";
import { TokenEntity } from "../../../models";

interface Props {
    location?: any;
    web3: Web3;
    accounts: string[];
    dharma: Dharma;
    tokens: TokenEntity[];
    handleSetError: (errorMessage: string) => void;
    handleFillDebtOrder: (issuanceHash: string) => void;
}

interface States {
    confirmationModal: boolean;
    successModal: boolean;
    // True if the user has confirmed the order, but the block has not been mined.
    awaitingTransaction: boolean;
    debtOrder: DebtOrder.Instance;
    description: string;
    principalTokenSymbol: string;
    interestRate: BigNumber;
    termLength: BigNumber;
    amortizationUnit: string;
    issuanceHash: string;
}

class FillLoanEntered extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            confirmationModal: false,
            successModal: false,
            awaitingTransaction: false,
            debtOrder: {},
            description: "",
            principalTokenSymbol: "",
            interestRate: new BigNumber(0),
            termLength: new BigNumber(0),
            amortizationUnit: "",
            issuanceHash: "",
        };
        this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
        this.successModalToggle = this.successModalToggle.bind(this);
        this.handleFillOrder = this.handleFillOrder.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    async componentDidMount() {
        if (this.props.dharma && this.props.location.query) {
            this.getDebtOrderDetail(this.props.dharma, this.props.location.query);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.dharma && nextProps.location.query) {
            this.getDebtOrderDetail(nextProps.dharma, nextProps.location.query);
        }
    }

    async getDebtOrderDetail(dharma: Dharma, urlParams: any) {
        try {
            const debtOrder = debtOrderFromJSON(JSON.stringify(urlParams));
            const description = debtOrder.description;
            const principalTokenSymbol = debtOrder.principalTokenSymbol;
            delete debtOrder.description;
            delete debtOrder.principalTokenSymbol;
            this.setState({ debtOrder, description, principalTokenSymbol });
            if (debtOrder.termsContract && debtOrder.termsContractParameters) {
                const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(
                    debtOrder,
                );
                const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);
                this.setState({
                    interestRate: fromDebtOrder.interestRate,
                    termLength: fromDebtOrder.termLength,
                    amortizationUnit: fromDebtOrder.amortizationUnit,
                    issuanceHash: issuanceHash,
                });
            }
        } catch (e) {
            // console.log(e);
        }
    }

    confirmationModalToggle() {
        this.setState({
            confirmationModal: !this.state.confirmationModal,
        });
    }

    async handleFillOrder() {
        try {
            this.props.handleSetError("");
            const { dharma, accounts } = this.props;
            const { debtOrder, issuanceHash } = this.state;

            debtOrder.creditor = accounts[0];
            const txHash = await dharma.order.fillAsync(debtOrder, { from: accounts[0] });

            this.setState({ awaitingTransaction: true });

            await dharma.blockchain.awaitTransactionMinedAsync(txHash, 1000, 60000);

            this.setState({ awaitingTransaction: false });

            const errorLogs = await dharma.blockchain.getErrorLogs(txHash);

            if (errorLogs.length) {
                this.props.handleSetError(errorLogs[0]);
                this.setState({
                    confirmationModal: false,
                });
            } else {
                this.props.handleFillDebtOrder(issuanceHash);
                this.successModalToggle();
            }
        } catch (e) {
            this.props.handleSetError(e.message);
            this.setState({
                confirmationModal: false,
            });
        }
    }

    successModalToggle() {
        this.setState({
            confirmationModal: false,
            successModal: !this.state.successModal,
        });
    }

    handleRedirect() {
        browserHistory.push("/dashboard");
    }

    render() {
        const {
            debtOrder,
            description,
            interestRate,
            termLength,
            amortizationUnit,
            principalTokenSymbol,
            issuanceHash,
        } = this.state;

        const leftInfoItems = [
            {
                title: "Principal",
                content: debtOrder.principalAmount
                    ? debtOrder.principalAmount.toNumber() + " " + principalTokenSymbol
                    : "",
            },
            {
                title: "Term Length",
                content:
                    termLength && amortizationUnit
                        ? termLength.toNumber() + " " + amortizationUnit
                        : "-",
            },
        ];
        const rightInfoItems = [
            { title: "Interest Rate", content: interestRate.toNumber() + "%" },
            {
                title: "Installment Frequency",
                content: amortizationUnit ? amortizationUnitToFrequency(amortizationUnit) : "-",
            },
        ];
        const leftInfoItemRows = leftInfoItems.map((item) => (
            <InfoItem key={item.title}>
                <Title>{item.title}</Title>
                <Content>{item.content}</Content>
            </InfoItem>
        ));
        const rightInfoItemRows = rightInfoItems.map((item) => (
            <InfoItem key={item.title}>
                <Title>{item.title}</Title>
                <Content>{item.content}</Content>
            </InfoItem>
        ));

        const confirmationModalContent = (
            <span>
                You will fill this debt order <Bold>{shortenString(issuanceHash)}</Bold>. This
                operation will debit{" "}
                <Bold>
                    {debtOrder.principalAmount && debtOrder.principalAmount.toNumber()}{" "}
                    {principalTokenSymbol}
                </Bold>{" "}
                from your account.
            </span>
        );
        const descriptionContent = (
            <span>
                Here are the details of loan request <Bold>{issuanceHash}</Bold>. If the terms look
                fair to you, fill the loan and your transaction will be completed.
            </span>
        );
        return (
            <PaperLayout>
                <MainWrapper>
                    <Header title={"Fill a loan"} description={descriptionContent} />
                    <LoanInfoContainer>
                        <HalfCol>{leftInfoItemRows}</HalfCol>
                        <HalfCol>{rightInfoItemRows}</HalfCol>
                        <Col xs="12">
                            <InfoItem>
                                <Title>Description</Title>
                                <Content>{description}</Content>
                            </InfoItem>
                        </Col>
                    </LoanInfoContainer>
                    <ButtonContainer>
                        <Link to="/fill">
                            <DeclineButton>Decline</DeclineButton>
                        </Link>
                        <FillLoanButton
                            onClick={this.confirmationModalToggle}
                            disabled={this.state.awaitingTransaction}
                        >
                            Fill Loan
                        </FillLoanButton>
                    </ButtonContainer>

                    {this.state.awaitingTransaction && (
                        <Content style={{ textAlign: "center" }}>
                            <LoaderContainer>
                                <ClipLoader size={18} color={"#1cc1cc"} loading={true} />
                            </LoaderContainer>
                        </Content>
                    )}

                    <ConfirmationModal
                        disabled={this.state.awaitingTransaction}
                        modal={this.state.confirmationModal}
                        title="Please confirm"
                        content={confirmationModalContent}
                        onToggle={this.confirmationModalToggle}
                        onSubmit={this.handleFillOrder}
                        closeButtonText="Cancel"
                        submitButtonText={
                            this.state.awaitingTransaction ? "Filling order..." : "Fill Order"
                        }
                    />
                    <SuccessModal
                        modal={this.state.successModal}
                        onToggle={this.successModalToggle}
                        issuanceHash={issuanceHash}
                        onRedirect={this.handleRedirect}
                    />
                </MainWrapper>
            </PaperLayout>
        );
    }
}

export { FillLoanEntered };
