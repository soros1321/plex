import { BigNumber } from 'bignumber.js';

export const mockFromDebtOrder = jest.fn(async (debtOrder) => {
	return {
		termLength: new BigNumber(10),
		amortizationUnit: 'days',
		interestRate: new BigNumber(3)
	};
});
