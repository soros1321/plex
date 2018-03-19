import { mockGetAccounts } from './eth';

const eth = {
  getAccounts: mockGetAccounts
};

const mockFromWei = jest.fn((value, to) => {
	return value;
});

const mockWeb3 = jest.fn().mockImplementation(() => {
  return {
    eth,
		fromWei: mockFromWei
  };
});

export default mockWeb3;
