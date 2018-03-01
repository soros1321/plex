import { actionsEnums } from '../common/actionsEnums';
import { TokenEntity } from '../models';

class TokenReducerState {
	tokens: TokenEntity[];

	constructor() {
		this.tokens = [];
	}
}

const handleSetAllTokensTradingPermission = (state: TokenReducerState, action: any) => {
	return {
		...state,
		tokens: action.tokens
	};
};

const handleToggleTokenTradingPermission = (state: TokenReducerState, action: any) => {
	return {
		...state,
		tokens: state.tokens.map(token => {
			if (token.tokenSymbol === action.tokenSymbol) {
				return {
					...token,
					tradingPermitted: action.permission
				};
			}
			return token;
		})
	};
};

export const tokenReducer = (state: TokenReducerState = new TokenReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_ALL_TOKENS_TRADING_PERMISSION:
			return handleSetAllTokensTradingPermission(state, action);
		case actionsEnums.TOGGLE_TOKEN_TRADING_PERMISSION:
			return handleToggleTokenTradingPermission(state, action);
		default:
			return state;
	}
};
