import { actionsEnums } from '../../../common/actionsEnums';

export const getDebtOrder = (termsContract: string) => {
	return {
		type: actionsEnums.GET_DEBT_ORDER,
		payload: termsContract
	};
};
