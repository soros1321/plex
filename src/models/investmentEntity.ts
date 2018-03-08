import { BigNumber } from 'bignumber.js';

export class InvestmentEntity {
	debtorSignature: string;
	debtor: string | undefined;
	creditorSignature?: string;
	creditor: string;
	principalAmount: BigNumber | undefined;
	principalToken: string | undefined;
	principalTokenSymbol: string;
	termsContract: string | undefined;
	termsContractParameters: string | undefined;
	description: string | undefined;
	issuanceHash: string;

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
	}
}
