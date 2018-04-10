import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
import {
    formatDate,
    formatTime,
    getIdenticonImgSrc,
    shortenString,
    amortizationUnitToFrequency,
	debtOrderFromJSON
} from "../../../../utils";
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
    Strikethrough,
    ShowMore,
    PaymentDate,
	CancelButton
} from './styledComponents';
import { MakeRepaymentModal, ConfirmationModal, Bold } from '../../../../components';
import { ScheduleIcon } from '../../../../components/scheduleIcon/scheduleIcon';
import { Row, Col, Collapse } from 'reactstrap';
import { BigNumber } from 'bignumber.js';
import Dharma from '@dharmaprotocol/dharma.js';
import { TokenAmount } from "src/components";
import { web3Errors } from "src/common/web3Errors";

interface Props {
    debtOrder: DebtOrderEntity;
    dharma: Dharma;
	accounts: string[];
    handleSuccessfulRepayment: (
        agreementId: string,
        repaymentAmount: BigNumber,
        repaymentSymbol: string,
    ) => void;
    handleSetErrorToast: (errorMessage: string) => void;
    handleSetSuccessToast: (successMessage: string) => void;
	handleCancelDebtOrder: (issuanceHash: string) => void;
}

interface State {
    collapse: boolean;
    makeRepayment: boolean;
    awaitingRepaymentTx: boolean;
	awaitingCancelTx: boolean;
    missedPayments: object;
	confirmationModal: boolean;
}

class ActiveDebtOrder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            makeRepayment: false,
            awaitingRepaymentTx: false,
			awaitingCancelTx: false,
            missedPayments: {},
			confirmationModal: false
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleRepaymentModal = this.toggleRepaymentModal.bind(this);
        this.handleMakeRepaymentClick = this.handleMakeRepaymentClick.bind(this);
        this.handleRepaymentFormSubmission = this.handleRepaymentFormSubmission.bind(this);
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.handleCancelDebtOrderClick = this.handleCancelDebtOrderClick.bind(this);
		this.handleCancelDebtOrderSubmission = this.handleCancelDebtOrderSubmission.bind(this);
    }

    componentDidMount() {
        // Calculate which payments have been missed, so as to display that in the repayment schedule.
        this.calculatePaymentsMissed();
    }

    toggleDrawer() {
        this.setState({ collapse: !this.state.collapse });
    }

    toggleRepaymentModal() {
        this.setState({ makeRepayment: !this.state.makeRepayment });
    }

    handleMakeRepaymentClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        this.toggleRepaymentModal();
    }

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
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
				handleSetErrorToast
			} = this.props;

			handleSetErrorToast('');
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
			dharma.order.cancelOrderAsync(dharmaDebtOrder, {from: accounts[0]})
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
							`Debt agreement ${shortenString(debtOrder.issuanceHash)} is cancelled successfully`,
						);
					}
				}).catch(err => {
					if (err.message.includes('User denied transaction signature')) {
						this.props.handleSetErrorToast("Wallet has denied transaction.");
					} else {
						this.props.handleSetErrorToast(err.message);
					}
					this.confirmationModalToggle();
					this.setState({ awaitingCancelTx: false });
				});
		} catch (e) {
			this.confirmationModalToggle();
			this.props.handleSetErrorToast(e.message);
		}
	}

    async handleRepaymentFormSubmission(tokenAmount: BigNumber, tokenSymbol: string) {
		this.props.handleSetErrorToast('');
        const { dharma } = this.props;
		if (!dharma) {
			this.props.handleSetErrorToast(web3Errors.UNABLE_TO_FIND_CONTRACTS);
			return;
		}

        const tokenAddress = await dharma.contracts.getTokenAddressBySymbolAsync(tokenSymbol);

        this.setState({ awaitingRepaymentTx: true });

        dharma.servicing
            .makeRepayment(this.props.debtOrder.issuanceHash, tokenAmount, tokenAddress)
            .then((txHash) => {
                return dharma.blockchain.awaitTransactionMinedAsync(txHash, 1000, 60000);
            })
            .then((receipt) => {
                return dharma.blockchain.getErrorLogs(receipt.transactionHash);
            })
            .then((errors) => {
                this.setState({ makeRepayment: false, awaitingRepaymentTx: false });

                if (errors.length > 0) {
					if (this.props.debtOrder.principalTokenSymbol !== tokenSymbol) {
						this.props.handleSetErrorToast(`Repayments to debt agreement ${shortenString(this.props.debtOrder.issuanceHash)} must be made in ${this.props.debtOrder.principalTokenSymbol}`);
					} else {
						this.props.handleSetErrorToast(errors[0]);
					}
                } else {
                    this.props.handleSuccessfulRepayment(
                        this.props.debtOrder.issuanceHash,
                        tokenAmount,
                        tokenSymbol,
                    );
                    this.props.handleSetSuccessToast(
                        `Successfully made repayment of ${tokenAmount.div(10 ** 18).toString()} ${tokenSymbol}`,
                    );
                }
            }).catch(err => {
                if (err.message.includes('User denied transaction signature')) {
                    this.props.handleSetErrorToast("Wallet has denied transaction.");
                } else {
                    this.props.handleSetErrorToast(err.message);
                }

                this.setState({ makeRepayment: false, awaitingRepaymentTx: false });
            });
    }

    async calculatePaymentsMissed() {
        const { dharma } = this.props;
		if (!dharma) {
			return;
		}
        const { issuanceHash, repaidAmount, repaymentSchedule } = this.props.debtOrder;

        let missedPayments = {};
        let paymentDate;
        let expectedRepaidAmount;

        for (let i = 0; i < repaymentSchedule.length; i++) {
            paymentDate = repaymentSchedule[i];
            expectedRepaidAmount = await dharma.servicing.getExpectedValueRepaid(issuanceHash, paymentDate);
            missedPayments[paymentDate] = repaidAmount < expectedRepaidAmount;
        }

        this.setState({ missedPayments });
    }

    render() {
        const { debtOrder } = this.props;

        const repaymentSchedule = debtOrder.repaymentSchedule;
        if (!debtOrder) {
            return null;
        }
        const now = Math.round(new Date().getTime() / 1000);

        const repaymentScheduleItems: JSX.Element[] = [];
        let maxDisplay = 0;
        let selected = false;
        let selectedPaymentSchedule = 0;
        repaymentSchedule.forEach((paymentSchedule) => {
            if (maxDisplay < 5) {
                let repaymentState;

                if (now > paymentSchedule) {
                    if (this.state.missedPayments[paymentSchedule]) {
                        repaymentState = 'missed';
                    } else {
                        repaymentState = 'past';
                    }
                } else {
                    repaymentState = 'future';
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
                                {debtOrder.amortizationUnit !== "hours"
                                    ? formatDate(paymentSchedule)
                                    : formatTime(paymentSchedule)}
                            </PaymentDate>
                        </Schedule>,
                    );
                }
            }
            maxDisplay++;
        });

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
				Are you sure you want to cancel debt agreement <Bold>{shortenString(debtOrder.issuanceHash)}</Bold>
			</span>
		);
        return (
            <Wrapper onClick={this.toggleDrawer}>
                <Row>
                    <ImageContainer>
                        {identiconImgSrc && <IdenticonImage src={identiconImgSrc} />}
                    </ImageContainer>
                    <DetailContainer>
                        <Row>
                            <Col xs="12" md="6">
                                <Amount>
                                    <TokenAmount
                                        tokenAmount={debtOrder.principalAmount}
                                        tokenSymbol={debtOrder.principalTokenSymbol}
                                    />
                                </Amount>
                                <Url>{detailLink}</Url>
                            </Col>
                            <Col xs="12" md="6">
                                {debtOrder.status === "active" && (
                                    <MakeRepaymentButton onClick={this.handleMakeRepaymentClick}>
                                        Make Repayment
                                    </MakeRepaymentButton>
                                )}
                                {debtOrder.status === "pending" && (
									<CancelButton onClick={this.handleCancelDebtOrderClick}>
									   Cancel
									</CancelButton>
								)}
                            </Col>
                        </Row>
                        {debtOrder.status === "active" ? (
                            <StatusActive>Active</StatusActive>
                        ) : (
                            <StatusPending>Pending</StatusPending>
                        )}
                        <Terms>Simple Interest (Non-Collateralized)</Terms>
                    </DetailContainer>
                    <RepaymentScheduleContainer
                        className={debtOrder.status === "active" ? "active" : ""}
                    >
                        <Title>Repayment Schedule</Title>
                        {repaymentScheduleItems}
                    </RepaymentScheduleContainer>
                </Row>
                <Collapse isOpen={this.state.collapse}>
                    <Drawer>
                        <Row>
                            <Col xs="12" md="2">
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
                            <Col xs="12" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Repaid</InfoItemTitle>
                                    <InfoItemContent>
                                        <TokenAmount
                                            tokenAmount={debtOrder.repaidAmount}
                                            tokenSymbol={debtOrder.principalTokenSymbol}
                                        />
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="12" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Term Length</InfoItemTitle>
                                    <InfoItemContent>
                                        {debtOrder.termLength.toNumber() +
                                            " " +
                                            debtOrder.amortizationUnit}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="12" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Interest Rate</InfoItemTitle>
                                    <InfoItemContent>
                                        {debtOrder.interestRate.toNumber() + "%"}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="12" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Installment Frequency</InfoItemTitle>
                                    <InfoItemContent>
                                        {amortizationUnitToFrequency(debtOrder.amortizationUnit)}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="12" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Description</InfoItemTitle>
                                    <InfoItemContent>{debtOrder.description}</InfoItemContent>
                                </InfoItem>
                            </Col>
                        </Row>
                    </Drawer>
                </Collapse>
                <MakeRepaymentModal
                    modal={this.state.makeRepayment}
                    debtOrder={debtOrder}
                    title="Make Repayment"
                    closeButtonText="Nevermind"
                    submitButtonText={
                        this.state.awaitingRepaymentTx ? "Making Repayment..." : "Make Repayment"
                    }
                    awaitingTx={this.state.awaitingRepaymentTx}
                    onToggle={this.toggleRepaymentModal}
                    onSubmit={this.handleRepaymentFormSubmission}
                />
				<ConfirmationModal
					modal={this.state.confirmationModal}
					title="Please confirm"
					content={confirmationModalContent}
					onToggle={this.confirmationModalToggle}
					onSubmit={this.handleCancelDebtOrderSubmission}
					closeButtonText="No"
					submitButtonText={
						this.state.awaitingCancelTx ? "Canceling Order..." : "Yes"
					}
				/>
            </Wrapper>
        );
    }
}

export { ActiveDebtOrder };
