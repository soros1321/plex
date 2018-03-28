import { actionsEnums } from '../../../common/actionsEnums';

export const fillDebtOrder = (issuanceHash: string) => {
	return {
		type: actionsEnums.FILL_DEBT_ORDER,
		payload: issuanceHash
	};
};
