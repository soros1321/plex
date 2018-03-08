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

export const investmentReducer = (state: InvestmentReducerState = new InvestmentReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_INVESTMENTS:
			return handleSetInvestments(state, action);
		default:
			return state;
	}
};
