import { actionsEnums } from "../../../common/actionsEnums";
import { DebtOrderEntity } from "../../../models";

export const userRequestDebtOrder = (debtOrder: DebtOrderEntity) => {
    return {
        type: actionsEnums.REQUEST_DEBT_ORDER,
        payload: debtOrder,
    };
};
