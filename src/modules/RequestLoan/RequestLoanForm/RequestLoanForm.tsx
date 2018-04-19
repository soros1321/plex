import * as React from "react";
import { PaperLayout } from "../../../layouts";
import { browserHistory } from "react-router";
import { schema, uiSchema } from "./schema";
import { Header, JSONSchemaForm, MainWrapper, Bold, ConfirmationModal } from "../../../components";
import { DebtOrderEntity, TokenEntity } from "../../../models";
import * as Web3 from "web3";
import Dharma from "@dharmaprotocol/dharma.js";
import { BigNumber } from "bignumber.js";
import { encodeUrlParams, debtOrderFromJSON, normalizeDebtOrder, withCommas } from "../../../utils";
import { validateTermLength, validateInterestRate, validateCollateral } from "./validator";
const BitlyClient = require("bitly");
import { web3Errors } from "../../../common/web3Errors";

interface Props {
    web3: Web3;
    accounts: string[];
    dharma: Dharma;
    tokens: TokenEntity[];
    handleRequestDebtOrder: (debtOrder: DebtOrderEntity) => void;
    handleSetError: (errorMessage: string) => void;
}

interface State {
    awaitingSignTx: boolean;
    bitly: any;
    collateralized: boolean;
    confirmationModal: boolean;
    debtOrder: string;
    description: string;
    formData: any;
    interestRate: number;
    issuanceHash: string;
    principalAmount: number;
    principalTokenSymbol: string;
}

class RequestLoanForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignDebtOrder = this.handleSignDebtOrder.bind(this);
        this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.transformErrors = this.transformErrors.bind(this);

        this.state = {
            collateralized: false,
            formData: {},
            principalAmount: 0,
            principalTokenSymbol: "",
            interestRate: 0,
            debtOrder: "",
            description: "",
            issuanceHash: "",
            confirmationModal: false,
            bitly: null,
            awaitingSignTx: false,
        };
    }

    componentDidMount() {
        const bitly = BitlyClient(process.env.REACT_APP_BITLY_ACCESS_TOKEN);
        this.setState({ bitly });
    }

    handleChange(formData: any) {
        this.setState({
            formData: formData,
        });
        if (formData.loan) {
            if (formData.loan.principalAmount) {
                this.setState({ principalAmount: formData.loan.principalAmount });
            }
            if (formData.loan.principalTokenSymbol) {
                this.setState({ principalTokenSymbol: formData.loan.principalTokenSymbol });
            }
            if (formData.loan.description) {
                this.setState({ description: formData.loan.description });
            }
        }
        if (formData.terms && formData.terms.interestRate) {
            this.setState({ interestRate: formData.terms.interestRate });
        }
    }

    async handleSubmit() {
        try {
            this.props.handleSetError("");
            const { principalAmount, principalTokenSymbol } = this.state.formData.loan;
            const { interestRate, amortizationUnit, termLength } = this.state.formData.terms;
            const {
                collateralized,
                collateralAmount,
                collateralTokenSymbol,
                gracePeriodInDays,
            } = this.state.formData.collateral;
            const { dharma, accounts } = this.props;

            if (!this.props.dharma) {
                this.props.handleSetError(web3Errors.UNABLE_TO_FIND_CONTRACTS);
                return;
            } else if (!this.props.accounts.length) {
                this.props.handleSetError(web3Errors.UNABLE_TO_FIND_ACCOUNTS);
                return;
            }

            let loanOrder = {
                principalTokenSymbol,
                principalAmount: new BigNumber(principalAmount * 10 ** 18),
                interestRate: new BigNumber(interestRate),
                amortizationUnit,
                termLength: new BigNumber(termLength),
            };

            let debtOrder;
            if (!collateralized) {
                debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(loanOrder);
            } else {
                const collateralData = {
                    collateralAmount: new BigNumber(collateralAmount),
                    collateralTokenSymbol,
                    gracePeriodInDays: new BigNumber(gracePeriodInDays),
                };
                const collateralizedLoanOrder = Object.assign(loanOrder, collateralData);

                debtOrder = await dharma.adapters.collateralizedSimpleInterestLoan.toDebtOrder(
                    collateralizedLoanOrder,
                );
            }
            debtOrder.debtor = accounts[0];
            const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);

            this.setState({
                collateralized,
                debtOrder: JSON.stringify(debtOrder),
                issuanceHash,
            });
            this.confirmationModalToggle();
        } catch (e) {
            this.props.handleSetError(e.message);
            return;
        }
    }

    async handleSignDebtOrder() {
        try {
            this.props.handleSetError("");
            if (!this.state.debtOrder) {
                this.props.handleSetError("No Debt Order has been generated yet");
                return;
            } else if (!this.props.dharma) {
                this.props.handleSetError(web3Errors.UNABLE_TO_FIND_CONTRACTS);
                return;
            } else if (!this.props.accounts.length) {
                this.props.handleSetError(web3Errors.UNABLE_TO_FIND_ACCOUNTS);
                return;
            }
            this.setState({ awaitingSignTx: true });

            const {
                bitly,
                collateralized,
                description,
                issuanceHash,
                principalTokenSymbol,
            } = this.state;

            const debtOrder = debtOrderFromJSON(this.state.debtOrder);

            // Sign as debtor
            const debtorSignature = await this.props.dharma.sign.asDebtor(debtOrder, true);
            debtOrder.debtorSignature = debtorSignature;

            this.setState({
                debtOrder: JSON.stringify(debtOrder),
                awaitingSignTx: false,
                confirmationModal: false,
            });

            let urlParams = normalizeDebtOrder(debtOrder);
            urlParams = Object.assign({ description, principalTokenSymbol }, urlParams);

            const result = await bitly.shorten(
                process.env.REACT_APP_NGROK_HOSTNAME + "/fill/loan?" + encodeUrlParams(urlParams),
            );
            let fillLoanShortUrl: string = "";
            if (result.status_code === 200) {
                fillLoanShortUrl = result.data.url;
            } else {
                this.props.handleSetError("Unable to shorten the url");
                return;
            }

            // TODO: figure out how to type generatedDebtOrder
            let generatedDebtOrder: any;
            if (!collateralized) {
                generatedDebtOrder = await this.props.dharma.adapters.simpleInterestLoan.fromDebtOrder(
                    debtOrder,
                );
            } else {
                generatedDebtOrder = await this.props.dharma.adapters.collateralizedSimpleInterestLoan.fromDebtOrder(
                    debtOrder,
                );
            }
            let storeDebtOrder: DebtOrderEntity = {
                debtor: debtOrder.debtor,
                termsContract: debtOrder.termsContract,
                termsContractParameters: debtOrder.termsContractParameters,
                underwriter: debtOrder.underwriter,
                underwriterRiskRating: debtOrder.underwriteRiskRating,
                amortizationUnit: generatedDebtOrder.amortizationUnit,
                interestRate: generatedDebtOrder.interestRate,
                principalAmount: debtOrder.principalAmount,
                principalTokenSymbol,
                termLength: generatedDebtOrder.termLength,
                issuanceHash,
                repaidAmount: new BigNumber(0),
                repaymentSchedule: [],
                status: "pending",
                json: JSON.stringify(debtOrder),
                creditor: "",
                description,
                fillLoanShortUrl,
            };
            if (collateralized) {
                storeDebtOrder.collateralized = collateralized;
                storeDebtOrder.collateralAmount = generatedDebtOrder.collateralAmount;
                storeDebtOrder.collateralTokenSymbol = generatedDebtOrder.collateralTokenSymbol;
                storeDebtOrder.gracePeriodInDays = generatedDebtOrder.gracePeriodInDays;
            }

            this.props.handleRequestDebtOrder(storeDebtOrder);
            browserHistory.push(`/request/success/${storeDebtOrder.issuanceHash}`);
        } catch (e) {
            if (e.message.includes("User denied message signature")) {
                this.props.handleSetError("Wallet has denied message signature.");
            } else {
                this.props.handleSetError(e.message);
            }

            this.setState({
                awaitingSignTx: false,
                confirmationModal: false,
            });
            return;
        }
    }

    confirmationModalToggle() {
        this.setState({
            confirmationModal: !this.state.confirmationModal,
        });
    }

    validateForm(formData: any, errors: any) {
        if (formData.terms.termLength) {
            const error = validateTermLength(formData.terms.termLength);
            if (error) {
                errors.terms.termLength.addError(error);
            }
        }
        if (formData.terms.interestRate) {
            const error = validateInterestRate(formData.terms.interestRate);
            if (error) {
                errors.terms.interestRate.addError(error);
            }
        }
        if (formData.collateral.collateralized) {
            const response = validateCollateral(this.props.tokens, formData.collateral);
            if (response.error) {
                errors.collateral[response.fieldName].addError(response.error);
            }
        }
        return errors;
    }

    transformErrors(errors: any[]) {
        return errors.map((error) => {
            if (error.name === "oneOf") {
                error.message = "Please fix the errors above";
            }
            return error;
        });
    }

    render() {
        const confirmationModalContent = (
            <span>
                You are requesting a loan of{" "}
                <Bold>
                    {withCommas(this.state.principalAmount)} {this.state.principalTokenSymbol}
                </Bold>{" "}
                at a <Bold>{this.state.interestRate}%</Bold> interest rate per the terms in the
                contract on the previous page. Are you sure you want to do this?
            </span>
        );
        const descriptionContent = (
            <div>
                <p>
                    With this form, you can generate an <b>Open Debt Order</b> &mdash; a commitment
                    to borrowing at the terms that you specify below.
                </p>
                <p>
                    Generating an <b>Open Debt Order</b> is <i>entirely</i> free, but you will be
                    prompted to digitally sign your commitment.
                </p>
            </div>
        );
        return (
            <PaperLayout>
                <MainWrapper>
                    <Header title={"Request a Loan"} description={descriptionContent} />
                    <JSONSchemaForm
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={this.state.formData}
                        buttonText="Generate Debt Order"
                        onHandleChange={this.handleChange}
                        onHandleSubmit={this.handleSubmit}
                        validate={this.validateForm}
                        transformErrors={this.transformErrors}
                    />
                </MainWrapper>
                <ConfirmationModal
                    modal={this.state.confirmationModal}
                    title="Please confirm"
                    content={confirmationModalContent}
                    onToggle={this.confirmationModalToggle}
                    onSubmit={this.handleSignDebtOrder}
                    closeButtonText="&#8592; Modify Request"
                    submitButtonText={
                        this.state.awaitingSignTx ? "Completing Request..." : "Complete Request"
                    }
                    awaitingTx={this.state.awaitingSignTx}
                />
            </PaperLayout>
        );
    }
}

export { RequestLoanForm };
