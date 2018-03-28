import { actionsEnums } from '../../common/actionsEnums';
import { TokenEntity } from '../../models';

import { BigNumber } from 'bignumber.js';

export const setAllTokensTradingPermission = (tokens: TokenEntity[]) => {
	return {
		type: actionsEnums.SET_ALL_TOKENS_TRADING_PERMISSION,
		tokens: tokens
	};
};

export const toggleTokenTradingPermission = (tokenSymbol: string, permission: boolean) => {
	return {
		type: actionsEnums.TOGGLE_TOKEN_TRADING_PERMISSION,
		tokenSymbol: tokenSymbol,
		permission: permission
	};
};

export const toggleTokenLoadingSpinner = (tokenSymbol: string, loading: boolean) => {
	return {
		type: actionsEnums.TOGGLE_TOKEN_LOADING_SPINNER,
		tokenSymbol,
		loading
	};
};

export const setTokenBalance = (tokenSymbol: string, balance: BigNumber) => {
	return {
		type: actionsEnums.SET_TOKEN_BALANCE,
		tokenSymbol,
		balance
	};
};
