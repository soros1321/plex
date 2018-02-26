import { BigNumber } from 'bignumber.js';

export class DebtOrderEntity {
	debtorSignature: string;
	debtor: string | undefined;
	principalAmount: BigNumber;
	principalToken: string;
	principalTokenSymbol: string;
	interestRate: BigNumber;
	amortizationUnit: string;
	termLength: BigNumber;
	termsContract: string | undefined;
	termsContractParameters: string | undefined;
	description: string | undefined;

	public constructor () {
		this.debtorSignature = '';
		this.debtor = '';
		this.principalAmount = new BigNumber(0);
		this.principalToken = '';
		this.principalTokenSymbol = '';
		this.interestRate = new BigNumber(0);
		this.amortizationUnit = '';
		this.termLength = new BigNumber(0);
		this.termsContract = '';
		this.termsContractParameters = '';
		this.description = '';
	}
}
