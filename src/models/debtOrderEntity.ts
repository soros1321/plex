import { BigNumber } from 'bignumber.js';

export class DebtOrderEntity {
	identifier: string;
	debtorSignature: string;
	debtor: string | undefined;
	principalAmount: BigNumber;
	principalToken: string;
	principalTokenSymbol: string;
	termsContract: string | undefined;
	termsContractParameters: string | undefined;
	description: string | undefined;
	issuanceHash: string | undefined;
	fillLoanShortUrl: string;

	public constructor () {
		this.identifier = '';
		this.debtorSignature = '';
		this.debtor = '';
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
