import { BigNumber } from 'bignumber.js';

export class DebtOrderEntity {
	json: string;
	principalTokenSymbol: string;
	description: string;
	issuanceHash: string;
	fillLoanShortUrl: string;
	repaidAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;

	public constructor () {
		this.json = '';
		this.principalTokenSymbol = '';
		this.description = '';
		this.issuanceHash = '';
		this.fillLoanShortUrl = '';
		this.repaidAmount = new BigNumber(0);
		this.termLength = new BigNumber(0);
		this.interestRate = new BigNumber(0);
		this.amortizationUnit = '';
		this.status = '';
	}
}
