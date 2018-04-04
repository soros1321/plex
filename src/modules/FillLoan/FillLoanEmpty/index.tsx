import * as React from "react";
import { Header, MainWrapper, JSONSchemaForm } from "../../../components";
import { schema, uiSchema } from "./schema";
import { PaperLayout } from "../../../layouts";
import { Instructions, Title, StyledLink } from "./styledComponents";
import { encodeUrlParams, debtOrderFromJSON } from "../../../utils";
import { browserHistory } from "react-router";

interface State {
    formData: any;
}

class FillLoanEmpty extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            formData: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		this.validateForm = this.validateForm.bind(this);
    }

    handleChange(formData: any) {
        this.setState({ formData });
    }

    handleSubmit() {
        let loanRequest = this.state.formData.loan.loanRequest;
        if (!loanRequest) {
            return;
        }
        loanRequest = JSON.parse(loanRequest);
        browserHistory.push(`/fill/loan?${encodeUrlParams(loanRequest)}`);
    }

	validateForm(formData: any, errors: any) {
		try {
			const loanRequest = debtOrderFromJSON(formData.loan.loanRequest);
			if (!loanRequest.hasOwnProperty("kernelVersion")) {
				errors.loan.loanRequest.addError("JSON string is missing kernelVersion key.");
			}
			if (!loanRequest.hasOwnProperty("issuanceVersion")) {
				errors.loan.loanRequest.addError("JSON string is missing issuanceVersion key.");
			}
			if (!loanRequest.hasOwnProperty("principalAmount")) {
				errors.loan.loanRequest.addError("JSON string is missing principalAmount key.");
			}
			if (!loanRequest.hasOwnProperty("principalToken")) {
				errors.loan.loanRequest.addError("JSON string is missing principalToken key.");
			}
			if (!loanRequest.hasOwnProperty("debtor")) {
				errors.loan.loanRequest.addError("JSON string is missing debtor key.");
			}
			if (!loanRequest.hasOwnProperty("debtorFee")) {
				errors.loan.loanRequest.addError("JSON string is missing debtorFee key.");
			}
			if (!loanRequest.hasOwnProperty("creditor")) {
				errors.loan.loanRequest.addError("JSON string is missing creditor key.");
			}
			if (!loanRequest.hasOwnProperty("creditorFee")) {
				errors.loan.loanRequest.addError("JSON string is missing creditorFee key.");
			}
			if (!loanRequest.hasOwnProperty("relayer")) {
				errors.loan.loanRequest.addError("JSON string is missing relayer key.");
			}
			if (!loanRequest.hasOwnProperty("relayerFee")) {
				errors.loan.loanRequest.addError("JSON string is missing relayerFee key.");
			}
			if (!loanRequest.hasOwnProperty("underwriter")) {
				errors.loan.loanRequest.addError("JSON string is missing underwriter key.");
			}
			if (!loanRequest.hasOwnProperty("underwriterFee")) {
				errors.loan.loanRequest.addError("JSON string is missing underwriterFee key.");
			}
			if (!loanRequest.hasOwnProperty("underwriterRiskRating")) {
				errors.loan.loanRequest.addError("JSON string is missing underwriterRiskRating key.");
			}
			if (!loanRequest.hasOwnProperty("termsContract")) {
				errors.loan.loanRequest.addError("JSON string is missing termsContract key.");
			}
			if (!loanRequest.hasOwnProperty("termsContractParameters")) {
				errors.loan.loanRequest.addError("JSON string is missing termsContractParameters key.");
			}
			if (!loanRequest.hasOwnProperty("expirationTimestampInSec")) {
				errors.loan.loanRequest.addError("JSON string is missing expirationTimestampInSec key.");
			}
			if (!loanRequest.hasOwnProperty("salt")) {
				errors.loan.loanRequest.addError("JSON string is missing salt key.");
			}
			if (!loanRequest.hasOwnProperty("debtorSignature")) {
				errors.loan.loanRequest.addError("JSON string is missing debtorSignature key.");
			}
			if (!loanRequest.hasOwnProperty("creditorSignature")) {
				errors.loan.loanRequest.addError("JSON string is missing creditorSignature key.");
			}
			if (!loanRequest.hasOwnProperty("underwriterSignature")) {
				errors.loan.loanRequest.addError("JSON string is missing underwriterSignature key.");
			}
			if (!loanRequest.hasOwnProperty("description")) {
				errors.loan.loanRequest.addError("JSON string is missing description key.");
			}
			if (!loanRequest.hasOwnProperty("principalTokenSymbol")) {
				errors.loan.loanRequest.addError("JSON string is missing principalTokenSymbol key.");
			}
		} catch (e) {
			errors.loan.loanRequest.addError("Invalid JSON string.");
		}
		return errors;
	}

    render() {
        const descriptionContent = (
            <span>
                Input a loan's JSON string to review the borrower's proposed terms and decide whether or not you'd like
                to fill this <b>Open Debt Order</b>
            </span>
        );

        return (
            <PaperLayout>
                <MainWrapper>
                    <Header title={"Fill a loan"} description={descriptionContent} />
					<JSONSchemaForm
						schema={schema}
						uiSchema={uiSchema}
						formData={this.state.formData}
						buttonText="Next &#8594;"
						onHandleChange={this.handleChange}
						onHandleSubmit={this.handleSubmit}
						validate={this.validateForm}
					/>
                    <Instructions>
                        <Title>Just getting started?</Title>
                        {/*<StyledLink to="#" >FILLING DEBT ORDERS (VIDEO)</StyledLink>*/}
                        <StyledLink to="https://t.me/dharmalabs">JOIN THE DHARMA CHAT</StyledLink>
                    </Instructions>
                </MainWrapper>
            </PaperLayout>
        );
    }
}

export { FillLoanEmpty };
