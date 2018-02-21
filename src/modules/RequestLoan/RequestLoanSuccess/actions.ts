import { actionsEnums } from '../../../common/actionsEnums';

export const getDebtOrder = (debtorSignature: string) => {
	return {
		type: actionsEnums.GET_DEBT_ORDER,
		payload: debtorSignature
	};
};
