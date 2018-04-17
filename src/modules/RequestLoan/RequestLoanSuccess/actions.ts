import { actionsEnums } from "../../../common/actionsEnums";

export const getPendingDebtOrder = (issuanceHash: string) => {
    return {
        type: actionsEnums.GET_PENDING_DEBT_ORDER,
        payload: issuanceHash,
    };
};
