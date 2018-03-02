import { actionsEnums } from '../common/actionsEnums';

class ErrorReducerState {
	errorMessage: string;

	constructor() {
		this.errorMessage = '';
	}
}

const handleSetError = (state: ErrorReducerState, action: any) => {
	return {
		...state,
		errorMessage: action.errorMessage
	};
};

export const errorReducer = (state: ErrorReducerState = new ErrorReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_ERROR:
			return handleSetError(state, action);
		default:
			return state;
	}
};
