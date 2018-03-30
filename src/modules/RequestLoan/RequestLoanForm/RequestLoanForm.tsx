import * as React from "react";
import { PaperLayout } from "../../../layouts";
import { browserHistory } from "react-router";
import { schema, uiSchema } from "./schema";
import { Header, JSONSchemaForm, MainWrapper, Bold, ConfirmationModal } from "../../../components";
import { DebtOrderEntity } from "../../../models";
import * as Web3 from "web3";
import Dharma from "@dharmaprotocol/dharma.js";
import { BigNumber } from "bignumber.js";
import { encodeUrlParams, debtOrderFromJSON, normalizeDebtOrder, withCommas } from "../../../utils";
const BitlyClient = require("bitly");

interface Props {
    web3: Web3;
    accounts: string[];
    dharma: Dharma;
    handleRequestDebtOrder: (debtOrder: DebtOrderEntity) => void;
    handleSetError: (errorMessage: string) => void;
}

interface State {
    formData: any;
    principalAmount: number;
    principalTokenSymbol: string;
    interestRate: number;
    debtOrder: string;
    description: string;
    issuanceHash: string;
    confirmationModal: boolean;
    bitly: any;
}

class RequestLoanForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignDebtOrder = this.handleSignDebtOrder.bind(this);
        this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.state = {
            formData: {},
            principalAmount: 0,
            principalTokenSymbol: "",
            interestRate: 0,
            debtOrder: "",
            description: "",
            issuanceHash: "",
            confirmationModal: false,
            bitly: null
        };
    }

    componentDidMount() {
        const bitly = BitlyClient(process.env.REACT_APP_BITLY_ACCESS_TOKEN);
        this.setState({ bitly });
    }

    handleChange(formData: any) {
        this.setState({
            formData: formData
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
            const { dharma, accounts } = this.props;

            const simpleInterestLoan = {
                principalTokenSymbol,
                principalAmount: new BigNumber(principalAmount),
                interestRate: new BigNumber(interestRate),
                amortizationUnit,
                termLength: new BigNumber(termLength)
            };

            const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
            debtOrder.debtor = accounts[0];
            const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);

            this.setState({
                debtOrder: JSON.stringify(debtOrder),
                issuanceHash
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
            }

            const { description, principalTokenSymbol, issuanceHash, bitly } = this.state;
            const debtOrder = debtOrderFromJSON(this.state.debtOrder);

            // Sign as debtor
            const debtorSignature = await this.props.dharma.sign.asDebtor(debtOrder, true);
            debtOrder.debtorSignature = debtorSignature;

            this.setState({
                debtOrder: JSON.stringify(debtOrder),
                confirmationModal: false
            });

            let urlParams = normalizeDebtOrder(debtOrder);
            urlParams = Object.assign({ description, principalTokenSymbol }, urlParams);

            const result = await bitly.shorten(
                process.env.REACT_APP_NGROK_HOSTNAME + "/fill/loan?" + encodeUrlParams(urlParams)
            );
            let fillLoanShortUrl: string = "";
            if (result.status_code === 200) {
                fillLoanShortUrl = result.data.url;
            } else {
                this.props.handleSetError("Unable to shorten the url");
                return;
            }

            const generatedDebtOrder = await this.props.dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);
            const storeDebtOrder: DebtOrderEntity = {
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
                fillLoanShortUrl
            };
            this.props.handleRequestDebtOrder(storeDebtOrder);
            browserHistory.push(`/request/success/${storeDebtOrder.issuanceHash}`);
        } catch (e) {
            this.props.handleSetError(e.message);
            this.setState({
                confirmationModal: false
            });
            return;
        }
    }

    confirmationModalToggle() {
        this.setState({
            confirmationModal: !this.state.confirmationModal
        });
    }

    validateForm(formData: any, errors: any) {
        if (formData.terms.termLength % 1 !== 0) {
            errors.terms.termLength.addError("Term length can not have decimals.");
        }
        return errors;
    }

    render() {
        const confirmationModalContent = (
            <span>
                You are requesting a loan of{" "}
                <Bold>
                    {withCommas(this.state.principalAmount)} {this.state.principalTokenSymbol}
                </Bold>{" "}
                at a <Bold>{this.state.interestRate}%</Bold> interest rate per the terms in the contract on the previous
                page. Are you sure you want to do this?
            </span>
        );
        const descriptionContent = (
			<div>
				<p>
					With this form, you can generate an <b>Open Debt Order</b> &mdash; a commitment to borrowing at the terms that
					you specify below.
				</p>
				<p>
					Generating an <b>Open Debt Order</b> is <i>entirely</i> free, but you will be prompted to
					digitally sign your commitment.
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
                    />
                </MainWrapper>
                <ConfirmationModal
                    modal={this.state.confirmationModal}
                    title="Please confirm"
                    content={confirmationModalContent}
                    onToggle={this.confirmationModalToggle}
                    onSubmit={this.handleSignDebtOrder}
                    closeButtonText="&#8592; Modify Request"
                    submitButtonText="Complete Request"
                />
            </PaperLayout>
        );
    }
}

export { RequestLoanForm };
