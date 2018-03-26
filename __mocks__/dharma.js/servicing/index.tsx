import { BigNumber } from 'bignumber.js';

export const mockGetValueRepaid = jest.fn(async (issuanceHash) => {
	switch (issuanceHash) {
		case 'active':
			return new BigNumber(1);
		case 'inactive':
			return new BigNumber(999999);
		default:
			return new Error('error');
	}
});
