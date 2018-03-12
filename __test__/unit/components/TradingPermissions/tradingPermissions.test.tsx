import * as React from 'react';
import { shallow } from 'enzyme';
import { TradingPermissions } from '../../../../src/components/TradingPermissions/TradingPermissions';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import MockWeb3 from '../../../../__mocks__/web3';
import MockDharma from '../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
const promisify = require('tiny-promisify');

describe('TradingPermissions (Unit)', () => {
  let provider;
  let web3;
  let dharma;
  let props;

  beforeEach(() => {
    provider = new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = new MockWeb3();
    dharma = new MockDharma();
    props = { web3, dharma };
  });

  describe('#componentWillReceiveProps', async () => {
    test('should call #getTokenData if dharma was previously null and is currently present', async () => {
      props.dharma = null;
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const spy = jest.spyOn(tradingPermissions.instance(), 'getTokenData');

      const newDharma = new MockDharma();
      tradingPermissions.setProps({ dharma: newDharma });
      await expect(spy).toHaveBeenCalledWith(newDharma);
    });

    test('should not call #getTokenData if dharma was previously present', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const spy = jest.spyOn(tradingPermissions.instance(), 'getTokenData');

      const newDharma = new MockDharma();
      tradingPermissions.setProps({ dharma: newDharma });
      await expect(spy).not.toHaveBeenCalledWith(newDharma);
    });

    test('should not call #getTokenData if dharma is not currently present', async () => {
      props.dharma = null;
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const spy = jest.spyOn(tradingPermissions.instance(), 'getTokenData');

      const newDharma = new MockDharma();
      tradingPermissions.setProps({ dharma: null });
      await expect(spy).not.toHaveBeenCalledWith(newDharma);
    });
  });

  describe('#getTokenAllowance', () => {
    test('returns token allowance with appropriate parameters', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const tokenAddress = '0x000000000';
      const ownerAddress = (await promisify(props.web3.eth.getAccounts)())[0];
      const receivedTokenAllowance = await tradingPermissions.instance().getTokenAllowance(tokenAddress);

      await expect(receivedTokenAllowance)
        .toEqual(new BigNumber(await props.dharma.token.getProxyAllowanceAsync(tokenAddress, ownerAddress)));
    });
  });

  describe('#getTokenData', () => {
    test('returns without setting state if dharma is not defined', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const spy = jest.spyOn(tradingPermissions.instance(), 'setState');

      tradingPermissions.instance().getTokenData(null);

      await expect(spy).not.toHaveBeenCalled();

      spy.mockReset();
      spy.mockRestore();
    });

		/*
    // TODO: replace hard-coded token names
    test('retrieves token addresses and trading permissions for each token type', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      tradingPermissions.instance().getTokenAllowance = jest.fn((tokenAllowance => new BigNumber(0)));

      await tradingPermissions.instance().getTokenData(props.dharma);

      const tokenNames = ['ZRX', 'REP'];
      const tokens = {}

      for (let tokenName of tokenNames) {
        const address = props.dharma.contracts.loadTokenRegistry().getTokenAddress.callAsync(tokenName);
        const tradingPermitted = false;

        tokens[tokenName] = { address, tradingPermitted };
      }

      const expectedState = { tokens }

      await expect(tradingPermissions.state()).toEqual(expectedState);
    });
		*/
  });

  describe('#isAllowanceUnlimited', () => {
    test('returns false if allowance is limited', () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const allowance = new BigNumber(2);

      expect(tradingPermissions.instance().isAllowanceUnlimited(allowance)).toBeFalsy();
    });

    test('returns true if allowance is unlimited', () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const allowance = (new BigNumber(2)).pow(256).minus(new BigNumber(1))

      expect(tradingPermissions.instance().isAllowanceUnlimited(allowance)).toBeTruthy();
    });
  });

	/*
  describe('#updateProxyAlowance', () => {
    const state = {
      tokens: {
        'ZRX': {
          address: '0x00000000000',
          tradingPermitted: true,
        }
      }
    };

    test('calls Dharma#setProxyAllowanceAsync when trading is currently permitted', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      tradingPermissions.setState(state);

      tradingPermissions.instance().updateProxyAllowanceAsync(true, 'ZRX');

      await expect(dharma.token.setProxyAllowanceAsync)
        .toHaveBeenCalledWith(state.tokens.ZRX.address, new BigNumber(0));
    });

    test('calls Dharma#setUnlimitedProxyAllowanceAsync when trading is currently not permitted', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      tradingPermissions.setState(state);

      tradingPermissions.instance().updateProxyAllowanceAsync(false, 'ZRX');

      await expect(dharma.token.setUnlimitedProxyAllowanceAsync).toHaveBeenCalledWith(state.tokens.ZRX.address);
    });

    test('updates state to reflect new trading allowance of given token', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      tradingPermissions.setState(state);

      tradingPermissions.instance().updateProxyAllowanceAsync(true, 'ZRX');

      state.tokens.ZRX.tradingPermitted = false;
      await expect(tradingPermissions.instance().state).toEqual(state);
    });
  });
	*/
});
