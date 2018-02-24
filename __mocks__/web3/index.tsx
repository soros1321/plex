import { mockGetAccounts } from './eth';

const eth = {
  getAccounts: mockGetAccounts
};

const mockWeb3 = jest.fn().mockImplementation(() => {
  return {
    eth
  };
});

export default mockWeb3;
