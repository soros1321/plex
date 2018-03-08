import { actionsEnums } from '../common/actionsEnums';
import { InvestmentEntity } from '../models';

class InvestmentReducerState {
	investments: InvestmentEntity[];

	constructor() {
		this.investments = [];
	}
}

const handleSetInvestments = (state: InvestmentReducerState, payload: any) => {
	return {
		...state,
		investments: payload.investments
	};
};

const handleAddInvestment = (state: InvestmentReducerState, payload: InvestmentEntity[]) => {
	return {
		...state,
		investments: [
			...state.investments,
			payload
		]
	};
};

export const investmentReducer = (state: InvestmentReducerState = new InvestmentReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_INVESTMENTS:
			return handleSetInvestments(state, action);
		case actionsEnums.FILL_DEBT_ORDER:
			return handleAddInvestment(state, action.payload);
		default:
			return state;
	}
};
