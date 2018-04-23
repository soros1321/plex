import { actionsEnums } from "../common/actionsEnums";
import { DebtOrderEntity } from "../models";

export const updateDebtOrder = (debtOrder: DebtOrderEntity) => {
    return {
        debtOrder,
        type: actionsEnums.UPDATE_DEBT_ORDER,
    };
};
