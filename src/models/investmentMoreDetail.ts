import { InvestmentEntity } from './investmentEntity';
import { BigNumber } from 'bignumber.js';

export interface InvestmentMoreDetail extends InvestmentEntity {
	repaidAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;
}
