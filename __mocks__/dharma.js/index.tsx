import mockTokenRegistry from './contracts/tokenRegistry';
import {
  mockGetProxyAllowanceAsync,
  mockSetProxyAllowanceAsync,
  mockSetUnlimitedProxyAllowanceAsync
} from './token';
import { mockFromDebtOrder } from './adapters/simpleInterestLoan';
import { mockGetValueRepaid } from './servicing';

const contracts = {
  loadTokenRegistry: mockTokenRegistry
};

const token = {
  getProxyAllowanceAsync: mockGetProxyAllowanceAsync,
  setProxyAllowanceAsync: mockSetProxyAllowanceAsync,
  setUnlimitedProxyAllowanceAsync: mockSetUnlimitedProxyAllowanceAsync
};

const adapters = {
	simpleInterestLoan: {
		fromDebtOrder: mockFromDebtOrder
	}
};

const servicing = {
	getValueRepaid: mockGetValueRepaid
};

const mockDharma = jest.fn().mockImplementation(() => {
  return {
    contracts,
    token,
		adapters,
		servicing
  };
});

export default mockDharma;
