import { connect } from "react-redux";
import { Dashboard } from "./Dashboard";
import { setError } from "../../components/Toast/actions";
import { setInvestments } from "../../actions/investmentActions";
import { DebtOrderEntity, InvestmentEntity } from "../../models";
import { fillDebtOrder } from "../FillLoan/FillLoanEntered/actions";
import { setFilledDebtOrders } from "./actions";

const mapStateToProps = (state: any) => {
    const {
        debtOrders,
        filledDebtOrderIssuanceHashes,
        pendingDebtOrderIssuanceHashes,
    } = state.debtOrderReducer;

    const filledDebtOrders = filledDebtOrderIssuanceHashes.map((issuanceHash: string) =>
        debtOrders.get(issuanceHash),
    );
    const pendingDebtOrders = pendingDebtOrderIssuanceHashes.map((issuanceHash: string) =>
        debtOrders.get(issuanceHash),
    );

    return {
        accounts: state.web3Reducer.accounts,
        dharma: state.dharmaReducer.dharma,
        filledDebtOrders: filledDebtOrders,
        investments: Array.from(state.investmentReducer.investments.values()),
        pendingDebtOrders: pendingDebtOrders,
        web3: state.web3Reducer.web3,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        handleSetError: (errorMessage: string) => dispatch(setError(errorMessage)),
        handleFillDebtOrder: (issuanceHash: string) => dispatch(fillDebtOrder(issuanceHash)),
        handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) =>
            dispatch(setFilledDebtOrders(filledDebtOrders)),
        setInvestments: (investments: InvestmentEntity[]) => dispatch(setInvestments(investments)),
    };
};

export const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
