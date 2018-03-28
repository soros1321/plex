import * as React from 'react';
import { DebtOrderEntity } from '../../../src/models/DebtOrderEntity';
import { BigNumber } from 'bignumber.js';

describe('DebtOrderEntity', () => {
	it('should have the correct properties', () => {
		const debtOrderEntity = new DebtOrderEntity();
		const testDebtOrderEntity = {
			debtor: '',
			termsContract: '',
			termsContractParameters: '',
			underwriter: '',
			underwriterRiskRating: new BigNumber(0),
			amortizationUnit: '',
			interestRate: new BigNumber(0),
			principalAmount: new BigNumber(0),
			principalTokenSymbol: '',
			termLength: new BigNumber(0),
			issuanceHash: '',
			repaidAmount: new BigNumber(0),
			repaymentSchedule: [],
			status: '',
			json: '',
			creditor: '',
			description: '',
			fillLoanShortUrl: ''
		};
		expect(debtOrderEntity).toEqual(testDebtOrderEntity);
	});
});
