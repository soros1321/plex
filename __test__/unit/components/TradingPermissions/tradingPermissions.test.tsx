import * as React from 'react';
import { shallow } from 'enzyme';
import { TradingPermissions } from '../../../../src/components/TradingPermissions/TradingPermissions';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import MockWeb3 from '../../../../__mocks__/web3';
import MockDharma from '../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
const promisify = require('tiny-promisify');
import {
	TradingPermissionsContainer,
	TradingPermissionsTitle,
	TokenSymbol,
	TokenBalance,
	FaucetButton,
	ShowMoreButton,
	Arrow
} from '../../../../src/components/TradingPermissions/styledComponents';
import { Collapse } from 'reactstrap';
import { Toggle } from '../../../../src/components/Toggle';

describe('TradingPermissions (Unit)', () => {
  let provider;
  let web3;
  let dharma;
  let props;

  beforeEach(() => {
    provider = new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = new MockWeb3();
    dharma = new MockDharma();
    props = {
			web3,
			dharma,
			tokens: [],
			handleSetAllTokensTradingPermission: jest.fn(),
			handleToggleTokenTradingPermission: jest.fn(),
			handleSetError: jest.fn()
		};
  });

	describe('#render', () => {
		it('should render', () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
			expect(tradingPermissions.length).toEqual(1);
		});

		it('should not render <TradingPermissionsContainer /> if there is no tokens', () => {
			props.tokens = null;
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
			expect(tradingPermissions.find(TradingPermissionsContainer).length).toEqual(0);
			tradingPermissions.setProps({ tokens: [] });
			expect(tradingPermissions.find(TradingPermissionsContainer).length).toEqual(0);
		});

		describe('#only 1 token', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address1',
						tokenSymbol: 'REP',
						tradingPermitted: true,
						balance: new BigNumber(0)
					}
				];
			});

			it('should render <TradingPermissionContainer />', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).length).toEqual(1);
			});

			it('should render a <Toggle />', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).find(Toggle).length).toEqual(1);
			});

			it('should render a <ShowMoreButton />', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).find(ShowMoreButton).length).toEqual(1);
			});

			it('should setState when <ShowMoreButton /> is clicked', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				const spy = jest.spyOn(tradingPermissions.instance(), 'setState');
				const collapse = tradingPermissions.state('collapse');
				tradingPermissions.find(TradingPermissionsContainer).find(ShowMoreButton).simulate('click');
				expect(spy).toHaveBeenCalledWith({ collapse: !collapse });
			});

			it('should render a <FaucetButton />', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).find(Toggle).at(0).dive().find(FaucetButton).length).toEqual(1);
			});

			it('should call handleFaucet when <FaucetButton /> is clicked', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				const spy = jest.spyOn(tradingPermissions.instance(), 'handleFaucet');
				tradingPermissions.find(TradingPermissionsContainer).find(Toggle).at(0).dive().find(FaucetButton).at(0).simulate('click');
				expect(spy).toHaveBeenCalled();
			});
		});

		describe('#more than 3 tokens', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address1',
						tokenSymbol: 'REP',
						tradingPermitted: true,
						balance: new BigNumber(10)
					},
					{
						address: 'address2',
						tokenSymbol: 'MKR',
						tradingPermitted: true,
						balance: new BigNumber(0)
					},
					{
						address: 'address3',
						tokenSymbol: 'ZRX',
						tradingPermitted: true,
						balance: new BigNumber(0)
					},
					{
						address: 'address4',
						tokenSymbol: 'SNT',
						tradingPermitted: true,
						balance: new BigNumber(10)
					}
				];
			});

			it('should render 2 <Toggle /> inside <Collapse /> when there is 4 tokens', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).find(Collapse).find(Toggle).length).toEqual(2);
			});

			it('should render <Toggle /> with disabled = true', () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				expect(tradingPermissions.find(TradingPermissionsContainer).find(Toggle).at(1).prop('disabled')).toEqual(true);
			});
		});

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

      await expect(receivedTokenAllowance).toEqual(new BigNumber(await props.dharma.token.getProxyAllowanceAsync(tokenAddress, ownerAddress)));
    });

    it('returns -1 when there is no account', async () => {
			props.web3.eth.getAccounts = jest.fn((callback) => { callback(null, []) });
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const tokenAddress = '0x000000000';
      const ownerAddress = (await promisify(props.web3.eth.getAccounts)())[0];
      const receivedTokenAllowance = await tradingPermissions.instance().getTokenAllowance(tokenAddress);
      await expect(receivedTokenAllowance).toEqual(new BigNumber(-1));
			props.web3.eth.getAccounts = jest.fn((callback) => { callback(null, ['account0']) });
    });
  });

  describe('#getTokenBalance', () => {
		it('calls dharma#getBalanceAsync', async () => {
			const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const ownerAddress = (await promisify(props.web3.eth.getAccounts)())[0];
      const tokenAddress = '0x000000000';
			await tradingPermissions.instance().getTokenBalance(tokenAddress);
			await expect(dharma.token.getBalanceAsync).toHaveBeenCalledWith(tokenAddress, ownerAddress);
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

    test('returns without setting state if handleSetAllTokensTradingPermission is not defined', async () => {
			props.handleSetAllTokensTradingPermission = null;
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      const spy = jest.spyOn(tradingPermissions.instance(), 'setState');

      tradingPermissions.instance().getTokenData(null);

      await expect(spy).not.toHaveBeenCalled();

      spy.mockReset();
      spy.mockRestore();
    });

    // TODO: replace hard-coded token names
    test('retrieves token addresses and trading permissions for each token type, then call props.handleSetAllTokensTradingPermission', async () => {
      const tradingPermissions = shallow(<TradingPermissions {...props} />);
      tradingPermissions.instance().getTokenAllowance = jest.fn((tokenAllowance => new BigNumber(0)));
      tradingPermissions.instance().getTokenBalance = jest.fn((() => new BigNumber(0)));

      await tradingPermissions.instance().getTokenData(props.dharma);

      const tokenNames = ['REP', 'MKR', 'ZRX'];
      const tokens = [];

      for (let tokenName of tokenNames) {
        const address = props.dharma.contracts.loadTokenRegistry().getTokenAddressBySymbol.callAsync(tokenName);
        const tradingPermitted = false;

				tokens.push({
					address,
					tokenSymbol: tokenName,
					tradingPermitted,
					balance: new BigNumber(0)
				});
      }

			await expect(props.handleSetAllTokensTradingPermission).toHaveBeenCalledWith(tokens);
    });

		it('calls props.handleSetError when there is an error', async() => {
			const tradingPermissions = shallow(<TradingPermissions {...props} />);
			dharma.contracts.loadTokenRegistry = jest.fn(async () => throw new Error());
      await tradingPermissions.instance().getTokenData(props.dharma);
			await expect(props.handleSetError).toHaveBeenCalledWith('Unable to get token data');
		});
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

  describe('#updateProxyAllowance', () => {
		describe('trading is permitted', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address1',
						tokenSymbol: 'REP',
						tradingPermitted: true,
						balance: new BigNumber(0)
					}
				];
				dharma.token.setProxyAllowanceAsync.mockReset();
			});

			it('calls Dharma#setProxyAllowanceAsync', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].address);
				await expect(dharma.token.setProxyAllowanceAsync).toHaveBeenCalledWith(props.tokens[0].address, new BigNumber(0));
			});

			it('calls Dharma#awaitTransactionMinedAsync', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].address);
				await expect(dharma.blockchain.awaitTransactionMinedAsync).toHaveBeenCalled();
			});

			it('calls getTokenAllowance', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				const spy = jest.spyOn(tradingPermissions.instance(), 'getTokenAllowance');
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].address);
				await expect(spy).toHaveBeenCalledWith(props.tokens[0].address);
			});

			it('calls isAllowanceUnlimited', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				tradingPermissions.instance().getTokenAllowance = jest.fn((tokenAllowance => new BigNumber(0)));
				const spy = jest.spyOn(tradingPermissions.instance(), 'isAllowanceUnlimited');
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].address);
				await expect(spy).toHaveBeenCalledWith(new BigNumber(0));
			});

			it('calls props.handleToggleTokenTradingPermission', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].tokenSymbol);
				await expect(props.handleToggleTokenTradingPermission).toHaveBeenCalledWith(props.tokens[0].address, false);
			});

			it('calls props.handleSetError when there is an error', async() => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				dharma.token.setProxyAllowanceAsync = jest.fn(async (tokenAddress, value) => throw new Error());
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, props.tokens[0].tokenSymbol);
				await expect(props.handleSetError).toHaveBeenCalledWith('Unable to update token trading permission');
			});
		});

		describe('trading is not permitted', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address1',
						tokenSymbol: 'REP',
						tradingPermitted: false,
						balance: new BigNumber(0)
					}
				];
				dharma.token.setProxyAllowanceAsync.mockReset();
			});

			it('calls Dharma#setUnlimitedProxyAllowanceAsync', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(false, props.tokens[0].tokenSymbol);
				await expect(dharma.token.setUnlimitedProxyAllowanceAsync).toHaveBeenCalledWith(props.tokens[0].address);
			});

			it('calls Dharma#awaitTransactionMinedAsync', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(false, props.tokens[0].tokenSymbol);
				await expect(dharma.blockchain.awaitTransactionMinedAsync).toHaveBeenCalled();
			});

			it('calls getTokenAllowance', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				const spy = jest.spyOn(tradingPermissions.instance(), 'getTokenAllowance');
				await tradingPermissions.instance().updateProxyAllowanceAsync(false, props.tokens[0].tokenSymbol);
				await expect(spy).toHaveBeenCalledWith(props.tokens[0].address);
			});

			it('calls isAllowanceUnlimited', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				tradingPermissions.instance().getTokenAllowance = jest.fn((tokenAllowance => new BigNumber(0)));
				const spy = jest.spyOn(tradingPermissions.instance(), 'isAllowanceUnlimited');
				await tradingPermissions.instance().updateProxyAllowanceAsync(false, props.tokens[0].tokenSymbol);
				await expect(spy).toHaveBeenCalledWith(new BigNumber(0));
			});

			it('calls props.handleToggleTokenTradingPermission', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(false, props.tokens[0].tokenSymbol);
				await expect(props.handleToggleTokenTradingPermission).toHaveBeenCalledWith(props.tokens[0].address, true);
			});
		});

		describe('there is no matching token', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address3',
						tokenSymbol: 'MKR',
						tradingPermitted: true,
						balance: new BigNumber(0)
					}
				];
				dharma.token.setProxyAllowanceAsync.mockReset();
				dharma.token.setUnlimitedProxyAllowanceAsync.mockReset();
				dharma.blockchain.awaitTransactionMinedAsync.mockReset()
			});

			it('should not call dharma functions', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, 'BLAH');
				await expect(dharma.token.setProxyAllowanceAsync).not.toHaveBeenCalled();
				await expect(dharma.token.setUnlimitedProxyAllowanceAsync).not.toHaveBeenCalled();
				await expect(dharma.blockchain.awaitTransactionMinedAsync).not.toHaveBeenCalled();
			});
		});

		describe('there is no matching token', () => {
			beforeEach(() => {
				props.tokens = [
					{
						address: 'address3',
						tokenSymbol: 'MKR',
						tradingPermitted: true,
						balance: new BigNumber(0)
					}
				];
				dharma.token.setProxyAllowanceAsync.mockReset();
				dharma.token.setUnlimitedProxyAllowanceAsync.mockReset();
				dharma.blockchain.awaitTransactionMinedAsync.mockReset()
			});

			it('should not call dharma functions', async () => {
				const tradingPermissions = shallow(<TradingPermissions {...props} />);
				await tradingPermissions.instance().updateProxyAllowanceAsync(true, 'BLAH');
				await expect(dharma.token.setProxyAllowanceAsync).not.toHaveBeenCalled();
				await expect(dharma.token.setUnlimitedProxyAllowanceAsync).not.toHaveBeenCalled();
				await expect(dharma.blockchain.awaitTransactionMinedAsync).not.toHaveBeenCalled();
			});
		});
  });
});
