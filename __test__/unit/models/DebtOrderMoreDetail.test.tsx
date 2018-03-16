import * as React from 'react';
import { DebtOrderMoreDetail } from '../../../src/models/DebtOrderMoreDetail';
import { BigNumber } from 'bignumber.js';

describe('DebtOrderMoreDetail', () => {
	it('should have the correct properties', () => {
		const debtOrderMoreDetail = new DebtOrderMoreDetail();
		const testDebtOrderMoreDetail = {
			debtorSignature: '',
			debtor: '',
			principalAmount: new BigNumber(0),
			principalToken: '',
			principalTokenSymbol: '',
			termsContract: '',
			termsContractParameters: '',
			description: '',
			issuanceHash: '',
			fillLoanShortUrl: '',
			repaidAmount: new BigNumber(0),
			termLength: new BigNumber(0),
			interestRate: new BigNumber(0),
			amortizationUnit: '',
			status: ''
		};
		expect(debtOrderMoreDetail).toEqual(testDebtOrderMoreDetail);
	});
});
