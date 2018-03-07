import { DebtOrderEntity } from './debtOrderEntity';
import { BigNumber } from 'bignumber.js';

export interface DebtOrderMoreDetail extends DebtOrderEntity {
	repaidAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;
}
