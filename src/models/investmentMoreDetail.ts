import { InvestmentEntity } from './InvestmentEntity';
import { BigNumber } from 'bignumber.js';

export interface InvestmentMoreDetail extends InvestmentEntity {
	earnedAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;
}
