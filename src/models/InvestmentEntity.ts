import { BigNumber } from 'bignumber.js';

export class InvestmentEntity {
	creditor: string;										// Or `beneficiary` from `debtRegistry`
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
	earnedAmount: BigNumber;
	repaymentSchedule: number[];
	status: string;

	public constructor () {
		this.creditor = '';
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
		this.earnedAmount = new BigNumber(0);
		this.repaymentSchedule = [];
		this.status = '';
	}
}
