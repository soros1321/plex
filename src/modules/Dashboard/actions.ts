import { DebtOrderEntity } from "../../models";
import { actionsEnums } from '../../common/actionsEnums';

export const setFilledDebtOrders = (filledDebtOrders: DebtOrderEntity[]) => {
    return {
        type: actionsEnums.SET_FILLED_DEBT_ORDERS,
        filledDebtOrders
    };
};
