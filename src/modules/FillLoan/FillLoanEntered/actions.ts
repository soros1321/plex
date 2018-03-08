import { actionsEnums } from '../../../common/actionsEnums';
import { InvestmentEntity } from '../../../models';

export const fillDebtOrder = (investment: InvestmentEntity) => {
	return {
		type: actionsEnums.FILL_DEBT_ORDER,
		payload: investment
	};
};
