import { BigNumber } from 'bignumber.js';

export class DebtOrderEntity {
	debtor: string;
	termsContract: string;
	termsContractParameters: string;
	underwriter: string;
	underwriterRiskRating: BigNumber;
	amortizationUnit: string;
	interestRate: BigNumber;
	principalAmount: BigNumber;
	principalTokenSymbol: string;
	termLength: BigNumber;
	issuanceHash: string;
	repaidAmount: BigNumber;
	repaymentSchedule: number[];
	status: string;
	json?: string;												// The JSON stringify of debtOrder object return from `fromDebtOrder`
	creditor?: string;										// Or `beneficiary` from `debtRegistry`
	description?: string;
	fillLoanShortUrl?: string;

	public constructor () {
		this.debtor = '';
		this.termsContract = '';
		this.termsContractParameters = '';
		this.underwriter = '';
		this.underwriterRiskRating = new BigNumber(0);
		this.amortizationUnit = '';
		this.interestRate = new BigNumber(0);
		this.principalAmount = new BigNumber(0);
		this.principalTokenSymbol = '';
		this.termLength = new BigNumber(0);
		this.issuanceHash = '';
		this.repaidAmount = new BigNumber(0);
		this.repaymentSchedule = [];
		this.status = '';
		this.json = '';
		this.creditor = '';
		this.description = '';
		this.fillLoanShortUrl = '';
	}
}
