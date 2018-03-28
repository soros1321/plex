import { BigNumber } from 'bignumber.js';

export class TokenEntity {
	address: string;
	tokenSymbol: string;
	tradingPermitted: boolean;
	awaitingTransaction: boolean;
	balance: BigNumber;

	public constructor () {
		this.address = '';
		this.tokenSymbol = '';
		this.tradingPermitted = false;
		this.balance = new BigNumber(0);
	}
}
