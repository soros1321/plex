import { actionsEnums } from "src/common/actionsEnums";

export const cancelDebtOrder = (issuanceHash: string) => {
    return {
        type: actionsEnums.CANCEL_DEBT_ORDER,
        payload: issuanceHash,
    };
};
