import { DebtOrderEntity, InvestmentEntity } from "src/models";
import { actionsEnums } from "src/common/actionsEnums";

export const setFilledDebtOrders = (filledDebtOrders: DebtOrderEntity[]) => {
    return {
        type: actionsEnums.SET_FILLED_DEBT_ORDERS,
        payload: filledDebtOrders,
    };
};

export const setInvestments = (investments: InvestmentEntity[]) => {
    return {
        type: actionsEnums.SET_INVESTMENTS,
        payload: investments,
    };
};
