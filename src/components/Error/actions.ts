import { actionsEnums } from '../../common/actionsEnums';

export const setError = (errorMessage: string) => {
	return {
		type: actionsEnums.SET_ERROR,
		errorMessage: errorMessage
	};
};
