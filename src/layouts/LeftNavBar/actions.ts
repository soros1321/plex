import { actionsEnums } from '../../common/actionsEnums';
import { TokenEntity } from '../../models';

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
