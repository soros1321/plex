export class TokenEntity {
	address: string;
	tokenSymbol: string;
	tradingPermitted: boolean;

	public constructor () {
		this.address = '';
		this.tokenSymbol = '';
		this.tradingPermitted = false;
	}
}
