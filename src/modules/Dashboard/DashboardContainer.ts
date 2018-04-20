import { connect } from "react-redux";
import { Dashboard } from "./Dashboard";
import { setError } from "../../components/Toast/actions";
import { fillDebtOrder } from "../FillLoan/FillLoanEntered/actions";
import { DebtOrderEntity } from "src/models";
import { setFilledDebtOrders } from "./actions";

const mapStateToProps = (state: any) => {
    return {
        dharma: state.dharmaReducer.dharma,
        accounts: state.web3Reducer.accounts,
        pendingDebtOrders: state.debtOrderReducer.pendingDebtOrders,
        web3: state.web3Reducer.web3,
        filledDebtOrders: state.debtOrderReducer.filledDebtOrders,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetError: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleFillDebtOrder: (issuanceHash: string) => dispatch(fillDebtOrder(issuanceHash)),
        handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) =>
            dispatch(setFilledDebtOrders(filledDebtOrders)),
    };
};

export const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
