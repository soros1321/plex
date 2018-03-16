import * as React from 'react';
import { DebtOrderEntity } from '../../../src/models/DebtOrderEntity';
import { BigNumber } from 'bignumber.js';

describe('DebtOrderEntity', () => {
	it('should have the correct properties', () => {
		const debtOrderEntity = new DebtOrderEntity();
		const testDebtOrderEntity = {
			debtorSignature: '',
			debtor: '',
			principalAmount: new BigNumber(0),
			principalToken: '',
			principalTokenSymbol: '',
			termsContract: '',
			termsContractParameters: '',
			description: '',
			issuanceHash: '',
			fillLoanShortUrl: ''
		};
		expect(debtOrderEntity).toEqual(testDebtOrderEntity);
	});
});
