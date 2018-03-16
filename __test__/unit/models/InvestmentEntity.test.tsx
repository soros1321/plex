import * as React from 'react';
import { InvestmentEntity } from '../../../src/models/InvestmentEntity';
import { BigNumber } from 'bignumber.js';

describe('InvestmentEntity', () => {
	it('should have the correct properties', () => {
		const investmentEntity = new InvestmentEntity();
		const testInvestmentEntity = {
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
		};
		expect(investmentEntity).toEqual(testInvestmentEntity);
	});
});
