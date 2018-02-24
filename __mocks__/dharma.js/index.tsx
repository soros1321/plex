import mockTokenRegistry from './contracts/tokenRegistry';
import {
  mockGetProxyAllowanceAsync,
  mockSetProxyAllowanceAsync,
  mockSetUnlimitedProxyAllowanceAsync
} from './token';

const contracts = {
  loadTokenRegistry: mockTokenRegistry
};

const token = {
  getProxyAllowanceAsync: mockGetProxyAllowanceAsync,
  setProxyAllowanceAsync: mockSetProxyAllowanceAsync,
  setUnlimitedProxyAllowanceAsync: mockSetUnlimitedProxyAllowanceAsync
}

const mockDharma = jest.fn().mockImplementation(() => {
  return {
    contracts,
    token
  };
});

export default mockDharma;
