export class DebtOrderEntity {
	termsContract: string;
	debtor: string;
	principalAmount: number;
	principalTokenSymbol: string;
	interestRate: number;
	amortizationUnit: string;
	termLength: number;

	public constructor () {
		this.termsContract = '';
		this.debtor = '';
		this.principalAmount = 0;
		this.principalTokenSymbol = '';
		this.interestRate = 0;
		this.amortizationUnit = '';
		this.termLength = 0;
	}
}
