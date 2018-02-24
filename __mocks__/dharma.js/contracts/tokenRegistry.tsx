const mockGetTokenAddressCallAsync = jest.fn((tokenName) => `${tokenName}-address`);

const mockGetTokenAddress = {
  callAsync: mockGetTokenAddressCallAsync
};

const mockTokenRegistry = jest.fn().mockImplementation(() => {
  return {
    getTokenAddress: mockGetTokenAddress
  };
});

export default mockTokenRegistry;
