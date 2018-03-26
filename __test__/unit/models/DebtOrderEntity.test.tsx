import * as React from 'react';
import { DebtOrderEntity } from '../../../src/models/DebtOrderEntity';
import { BigNumber } from 'bignumber.js';

describe('DebtOrderEntity', () => {
	it('should have the correct properties', () => {
		const debtOrderEntity = new DebtOrderEntity();
		const testDebtOrderEntity = {
			json: '',
			principalTokenSymbol: '',
			description: '',
			issuanceHash: '',
			fillLoanShortUrl: '',
			repaidAmount: new BigNumber(0),
			termLength: new BigNumber(0),
			interestRate: new BigNumber(0),
			amortizationUnit: '',
			status: ''
		};
		expect(debtOrderEntity).toEqual(testDebtOrderEntity);
	});
});
