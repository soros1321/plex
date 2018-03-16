import { InvestmentEntity } from './InvestmentEntity';
import { BigNumber } from 'bignumber.js';

export class InvestmentMoreDetail extends InvestmentEntity {
	earnedAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;

	public constructor () {
		super();
		this.earnedAmount = new BigNumber(0);
		this.termLength = new BigNumber(0);
		this.interestRate = new BigNumber(0);
		this.amortizationUnit = '';
		this.status = '';
	}
}
