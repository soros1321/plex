import { BigNumber } from 'bignumber.js';

export class InvestmentEntity {
	json: string;
	principalTokenSymbol: string;
	description: string;
	issuanceHash: string;
	earnedAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;

	public constructor () {
		this.json = '';
		this.principalTokenSymbol = '';
		this.description = '';
		this.issuanceHash = '';
		this.earnedAmount = new BigNumber(0);
		this.termLength = new BigNumber(0);
		this.interestRate = new BigNumber(0);
		this.amortizationUnit = '';
		this.status = '';
	}
}
