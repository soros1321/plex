import * as React from 'react';
import { InvestmentMoreDetail } from '../../../src/models/InvestmentMoreDetail';
import { BigNumber } from 'bignumber.js';

describe('InvestmentMoreDetail', () => {
	it('should have the correct properties', () => {
		const investmentMoreDetail = new InvestmentMoreDetail();
		const testInvestmentMoreDetail = {
			debtorSignature: '',
			debtor: '',
			creditorSignature: '',
			creditor: '',
			principalAmount: new BigNumber(0),
			principalToken: '',
			principalTokenSymbol: '',
			termsContract: '',
			termsContractParameters: '',
			description: '',
			issuanceHash: '',
			earnedAmount: new BigNumber(0),
			termLength: new BigNumber(0),
			interestRate: new BigNumber(0),
			amortizationUnit: '',
			status: ''
		};
		expect(investmentMoreDetail).toEqual(testInvestmentMoreDetail);
	});
});
