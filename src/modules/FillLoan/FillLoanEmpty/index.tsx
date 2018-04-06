import * as React from "react";
import { Header, MainWrapper, JSONSchemaForm } from "../../../components";
import { schema, uiSchema, validDebtOrderSchema } from "./schema";
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
			for (let field of validDebtOrderSchema.required) {
				if (!loanRequest.hasOwnProperty(field)) {
					errors.loan.loanRequest.addError(`JSON string is missing ${field} key.`);
				}
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
                    <Header title={"Fill a Loan"} description={descriptionContent} />
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
