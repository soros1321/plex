import { actionsEnums } from '../common/actionsEnums';

export const web3Connected = (web3: any) => {
	return {
		type: actionsEnums.WEB3_CONNECTED,
		web3: web3
	};
};
