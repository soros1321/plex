import * as React from "react";
import { PaperLayout } from "../../layouts";
import { MainWrapper, Checkbox } from "../../components";
import {
    BannerContainer,
    Header,
    Description,
    ButtonContainer,
    NextButton,
    StyledLink,
} from "./styledComponents";
import { browserHistory } from "react-router";

interface Props {
    agreeToTerms: boolean;
    handleSetError: (errorMessage: string) => void;
    handleAgreeToTerms: (agree: boolean) => void;
}

interface State {
    agreeToTermsOfUse: boolean;
}

class Welcome extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleAgreeChange = this.handleAgreeChange.bind(this);
        this.checkAgree = this.checkAgree.bind(this);
        this.state = {
            agreeToTermsOfUse: false,
        };
    }

    componentDidMount() {
        if (this.props.agreeToTerms) {
            browserHistory.push("/request");
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.agreeToTerms !== prevProps.agreeToTerms && this.props.agreeToTerms) {
            browserHistory.push("/request");
        }
    }

    handleAgreeChange(checked: boolean) {
        this.setState({
            agreeToTermsOfUse: checked,
        });
    }

    checkAgree() {
        this.props.handleSetError("");
        if (!this.state.agreeToTermsOfUse) {
            this.props.handleSetError("You have to agree to the terms of use to continue");
            return;
        }
        this.props.handleAgreeToTerms(true);
        browserHistory.push("/request");
    }

    render() {
        const checkboxLabel = (
            <span>
                I have read and agree to the <StyledLink to="/terms">Terms of Use</StyledLink>.
            </span>
        );
        return (
            <PaperLayout>
                <BannerContainer />
                <MainWrapper>
                    <Header>Welcome to Dharma Plex</Header>
                    <Description>
                        The Dharma Protocol enables users to interact on the Ethereum blockchain
                        using tokenized debt agreements. However, Dharma Labs Inc. is not a party to
                        any contract entered into between users of the Dharma Protocol, does not act
                        as a lender or give loans using the Dharma Protocol, and does not otherwise
                        enter into any agreements with or commit to any obligations to any user of
                        the Dharma Protocol. Further, you acknowledge that the Dharma Protocol is in
                        beta form, may have limited functionality, and may contain errors.
                    </Description>
                    <Checkbox
                        name="agree"
                        label={checkboxLabel}
                        onChange={this.handleAgreeChange}
                        checked={this.state.agreeToTermsOfUse}
                    />
                    <ButtonContainer>
                        <NextButton onClick={this.checkAgree}>Next &rarr;</NextButton>
                    </ButtonContainer>
                </MainWrapper>
            </PaperLayout>
        );
    }
}

export { Welcome };
