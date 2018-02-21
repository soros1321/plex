export class DebtOrderEntity {
	debtorSignature: string;
	debtor: string;
	principalAmount: number;
	principalTokenSymbol: string;
	interestRate: number;
	amortizationUnit: string;
	termLength: number;

	public constructor () {
		this.debtorSignature = '';
		this.debtor = '';
		this.principalAmount = 0;
		this.principalTokenSymbol = '';
		this.interestRate = 0;
		this.amortizationUnit = '';
		this.termLength = 0;
	}
}
