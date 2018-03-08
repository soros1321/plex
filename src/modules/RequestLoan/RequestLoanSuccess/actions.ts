import { actionsEnums } from '../../../common/actionsEnums';

export const getDebtOrder = (issuanceHash: string) => {
	return {
		type: actionsEnums.GET_DEBT_ORDER,
		payload: issuanceHash
	};
};
