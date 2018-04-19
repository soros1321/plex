import { connect } from "react-redux";
import { ActiveOpenOrder } from "./ActiveOpenOrder";
import { cancelDebtOrder } from "./actions";
import { setError, setSuccess } from "src/components/Toast/actions";

const mapStateToProps = (state: any) => {
    return {
        dharma: state.dharmaReducer.dharma,
        accounts: state.web3Reducer.accounts,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetErrorToast: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleSetSuccessToast: (successMessage: string) => dispatch(setSuccess(successMessage)),
        handleCancelDebtOrder: (issuanceHash: string) => dispatch(cancelDebtOrder(issuanceHash)),
    };
};

export const ActiveOpenOrderContainer = connect(mapStateToProps, mapDispatchToProps)(
    ActiveOpenOrder,
);
