import { actionsEnums } from '../common/actionsEnums';
import { DebtOrderEntity } from '../models';

class DebtOrderReducerState {
	debtOrders: DebtOrderEntity[];

	constructor() {
		this.debtOrders = [];
	}
}

const handleRequestDebtOrder = (state: DebtOrderReducerState, payload: DebtOrderEntity[]) => {
	return {
		...state,
		debtOrders: [
			...state.debtOrders,
			payload
		]
	};
};

export const debtOrderReducer = (state: DebtOrderReducerState = new DebtOrderReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.REQUEST_DEBT_ORDER:
			return handleRequestDebtOrder(state, action.payload);
		default:
			return state;
	}
};
