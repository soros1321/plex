import mockTokenRegistry from './contracts/tokenRegistry';
import {
  mockGetProxyAllowanceAsync,
  mockSetProxyAllowanceAsync,
  mockSetUnlimitedProxyAllowanceAsync,
	mockGetBalanceAsync
} from './token';
import {
	mockFromDebtOrder,
	mockGetRepaymentSchedule,
	mockToDebtOrder
} from './adapters/simpleInterestLoan';
import {
	mockGetValueRepaid,
	mockGetDebtRegistryEntry,
	mockGetExpectedValueRepaid
} from './servicing';
import {
	mockAwaitTransactionMinedAsync,
	mockGetErrorLogs
} from './blockchain';
import {
	mockGetIssuanceHash,
	mockFillAsync
} from './order';
import {
	mockAsDebtor
} from './sign';

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
		fromDebtOrder: mockFromDebtOrder,
		getRepaymentSchedule: mockGetRepaymentSchedule,
		toDebtOrder: mockToDebtOrder
	}
};

const servicing = {
	getValueRepaid: mockGetValueRepaid,
	getDebtRegistryEntry: mockGetDebtRegistryEntry,
	getExpectedValueRepaid: mockGetExpectedValueRepaid
};

const blockchain = {
	awaitTransactionMinedAsync: mockAwaitTransactionMinedAsync,
	getErrorLogs: mockGetErrorLogs
};

const order = {
	getIssuanceHash: mockGetIssuanceHash,
	fillAsync: mockFillAsync
};

const sign = {
	asDebtor: mockAsDebtor
};

const mockDharma = jest.fn().mockImplementation(() => {
  return {
    contracts,
    token,
		adapters,
		servicing,
		blockchain,
		order,
		sign
  };
});

export default mockDharma;
