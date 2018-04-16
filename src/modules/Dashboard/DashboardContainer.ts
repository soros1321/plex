import { connect } from "react-redux";
import { Dashboard } from "./Dashboard";
import { setError } from "../../components/Toast/actions";
import { setFilledDebtOrders } from "./actions";
import { DebtOrderEntity } from "../../models";
import { fillDebtOrder } from "../FillLoan/FillLoanEntered/actions";

const mapStateToProps = (state: any) => {
    return {
        dharma: state.dharmaReducer.dharma,
        accounts: state.web3Reducer.accounts,
        pendingDebtOrders: state.debtOrderReducer.pendingDebtOrders,
        filledDebtOrders: state.debtOrderReducer.filledDebtOrders,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetError: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) =>
            dispatch(setFilledDebtOrders(filledDebtOrders)),
        handleFillDebtOrder: (issuanceHash: string) => dispatch(fillDebtOrder(issuanceHash)),
    };
};

export const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
