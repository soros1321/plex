import { BigNumber } from "bignumber.js";
import { actionsEnums } from "../../../../common/actionsEnums";

export const successfulRepayment = (
    agreementId: string,
    repaymentAmount: BigNumber,
    repaymentTokenSymbol: string,
) => {
    return {
        type: actionsEnums.SUCCESSFUL_REPAYMENT,
        agreementId,
        repaymentAmount,
        repaymentTokenSymbol,
    };
};

export const cancelDebtOrder = (issuanceHash: string) => {
    return {
        type: actionsEnums.CANCEL_DEBT_ORDER,
        payload: issuanceHash,
    };
};
