import * as React from 'react';
import { InvestmentEntity } from '../../../src/models/InvestmentEntity';
import { BigNumber } from 'bignumber.js';

describe('InvestmentEntity', () => {
	it('should have the correct properties', () => {
		const investmentEntity = new InvestmentEntity();
		const testInvestmentEntity = {
			json: '',
			principalTokenSymbol: '',
			description: '',
			issuanceHash: '',
			earnedAmount: new BigNumber(0),
			termLength: new BigNumber(0),
			interestRate: new BigNumber(0),
			amortizationUnit: '',
			status: ''
		};
		expect(investmentEntity).toEqual(testInvestmentEntity);
	});
});
