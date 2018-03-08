import { BigNumber } from 'bignumber.js';

export class InvestmentEntity {
	debtorSignature: string;
	debtor: string;
	creditorSignature: string | undefined;
	creditor: string;
	principalAmount: BigNumber;
	principalToken: string;
	principalTokenSymbol: string;
	termsContract: string;
	termsContractParameters: string;
	description: string;
	issuanceHash: string;
	fillLoanShortUrl: string;

	public constructor () {
		this.debtorSignature = '';
		this.debtor = '';
		this.creditorSignature = '';
		this.creditor = '';
		this.principalAmount = new BigNumber(0);
		this.principalToken = '';
		this.principalTokenSymbol = '';
		this.termsContract = '';
		this.termsContractParameters = '';
		this.description = '';
		this.issuanceHash = '';
		this.fillLoanShortUrl = '';
	}
}
