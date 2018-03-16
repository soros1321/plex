import { DebtOrderEntity } from './DebtOrderEntity';
import { BigNumber } from 'bignumber.js';

export class DebtOrderMoreDetail extends DebtOrderEntity {
	repaidAmount: BigNumber;
	termLength: BigNumber;
	interestRate: BigNumber;
	amortizationUnit: string;
	status: string;

	public constructor () {
		super();
		this.repaidAmount = new BigNumber(0);
		this.termLength = new BigNumber(0);
		this.interestRate = new BigNumber(0);
		this.amortizationUnit = '';
		this.status = '';
	}
}
