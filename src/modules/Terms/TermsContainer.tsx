import { connect } from "react-redux";
import { Terms } from "./Terms";
import { agreeToTerms } from "../Welcome/actions";

const mapStateToProps = (state: any) => {
    return {
        agreeToTerms: state.plexReducer.agreeToTerms,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleAgreeToTerms: (agree: boolean) => dispatch(agreeToTerms(agree)),
    };
};

export const TermsContainer = connect(mapStateToProps, mapDispatchToProps)(Terms);
