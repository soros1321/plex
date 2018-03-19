import mockTokenRegistry from './contracts/tokenRegistry';
import {
  mockGetProxyAllowanceAsync,
  mockSetProxyAllowanceAsync,
  mockSetUnlimitedProxyAllowanceAsync,
	mockGetBalanceAsync
} from './token';
import { mockFromDebtOrder } from './adapters/simpleInterestLoan';
import { mockGetValueRepaid } from './servicing';
import { mockAwaitTransactionMinedAsync } from './blockchain';

const contracts = {
  loadTokenRegistry: mockTokenRegistry
};

const token = {
  getProxyAllowanceAsync: mockGetProxyAllowanceAsync,
  setProxyAllowanceAsync: mockSetProxyAllowanceAsync,
  setUnlimitedProxyAllowanceAsync: mockSetUnlimitedProxyAllowanceAsync
	getBalanceAsync: mockGetBalanceAsync
};

const adapters = {
	simpleInterestLoan: {
		fromDebtOrder: mockFromDebtOrder
	}
};

const servicing = {
	getValueRepaid: mockGetValueRepaid
};

const blockchain = {
	awaitTransactionMinedAsync: mockAwaitTransactionMinedAsync
};

const mockDharma = jest.fn().mockImplementation(() => {
  return {
    contracts,
    token,
		adapters,
		servicing,
		blockchain
  };
});

export default mockDharma;
