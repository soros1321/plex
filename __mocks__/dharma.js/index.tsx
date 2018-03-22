import mockTokenRegistry from './contracts/tokenRegistry';
import {
  mockGetProxyAllowanceAsync,
  mockSetProxyAllowanceAsync,
  mockSetUnlimitedProxyAllowanceAsync,
	mockGetBalanceAsync
} from './token';
import { mockFromDebtOrder } from './adapters/simpleInterestLoan';
import { mockGetValueRepaid } from './servicing';
import {
	mockAwaitTransactionMinedAsync,
	mockGetErrorLogs
} from './blockchain';
import {
	mockGetIssuanceHash,
	mockFillAsync
} from './order';

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
	awaitTransactionMinedAsync: mockAwaitTransactionMinedAsync,
	getErrorLogs: mockGetErrorLogs
};

const order = {
	getIssuanceHash: mockGetIssuanceHash,
	fillAsync: mockFillAsync
};

const mockDharma = jest.fn().mockImplementation(() => {
  return {
    contracts,
    token,
		adapters,
		servicing,
		blockchain,
		order
  };
});

export default mockDharma;
