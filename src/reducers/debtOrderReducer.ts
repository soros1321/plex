import { actionsEnums } from '../common/actionsEnums';
import { DebtOrderEntity } from '../models';

class DebtOrderReducerState {
	debtOrders: DebtOrderEntity[];
	singleDebtOrder: DebtOrderEntity;

	constructor() {
		this.debtOrders = [];
		this.singleDebtOrder = new DebtOrderEntity();
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

const handleGetDebtOrder = (state: DebtOrderReducerState, payload: string) => {
	const debtOrder = state.debtOrders.find(_debtOrder => _debtOrder.debtorSignature === payload);
	return {
		...state,
		singleDebtOrder: debtOrder
	};
};

export const debtOrderReducer = (state: DebtOrderReducerState = new DebtOrderReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.REQUEST_DEBT_ORDER:
			return handleRequestDebtOrder(state, action.payload);
		case actionsEnums.GET_DEBT_ORDER:
			return handleGetDebtOrder(state, action.payload);
		default:
			return state;
	}
};
