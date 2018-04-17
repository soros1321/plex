import { connect } from "react-redux";
import { Welcome } from "./Welcome";
import { setError } from "../../components/Toast/actions";
import { agreeToTerms } from "./actions";

const mapStateToProps = (state: any) => {
    return {
        agreeToTerms: state.plexReducer.agreeToTerms,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetError: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleAgreeToTerms: (agree: boolean) => dispatch(agreeToTerms(agree)),
    };
};

export const WelcomeContainer = connect(mapStateToProps, mapDispatchToProps)(Welcome);
