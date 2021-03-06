import { DebtOrderEntity } from "src/models";
import { actionsEnums } from "src/common/actionsEnums";

export const setFilledDebtOrders = (filledDebtOrders: DebtOrderEntity[]) => {
    return {
        type: actionsEnums.SET_FILLED_DEBT_ORDERS,
        payload: filledDebtOrders,
    };
};
