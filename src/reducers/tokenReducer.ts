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

const handleFaucetTokenRequest = (state: TokenReducerState, action: any) => {
	const { tokenSymbol, userAddress } = action;
	const balance = Math.pow(10, 18);

	const faucetUrl = `https://faucet.dharma.io/dummy-tokens/${tokenSymbol}/balance/${userAddress}`;
	const postData = {
        method: 'post',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ balance: balance })
    };

	fetch(
		faucetUrl,
		postData
	);

	return {
		...state,
	};
};

export const tokenReducer = (state: TokenReducerState = new TokenReducerState(), action: any) => {
	switch (action.type) {
		case actionsEnums.SET_ALL_TOKENS_TRADING_PERMISSION:
			return handleSetAllTokensTradingPermission(state, action);
		case actionsEnums.TOGGLE_TOKEN_TRADING_PERMISSION:
			return handleToggleTokenTradingPermission(state, action);
		case actionsEnums.FAUCET_TOKEN_REQUEST:
			return handleFaucetTokenRequest(state, action);
		default:
			return state;
	}
};
