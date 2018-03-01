import { actionsEnums } from '../common/actionsEnums';

class ErrorReducerState {
	errorMessage: string;

	constructor() {
		this.errorMessage = '';
	}
}

const handleSetGlobalError = (state: ErrorReducerState, action: any) => {
	return {
		...state,
		errorMessage: action.errorMessage
	};
};

export const errorReducer = (state: ErrorReducerState = new ErrorReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_GLOBAL_ERROR:
			return handleSetGlobalError(state, action);
		default:
			return state;
	}
};
