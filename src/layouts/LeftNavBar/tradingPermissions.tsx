import * as React from 'react';
import {
  Row,
  Col,
  NavItem
} from 'reactstrap';
import { Toggle } from '../../components/Toggle';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';
import { TradingPermissionsContainer, TradingPermissionsTitle } from './styledComponents';
const promisify = require('tiny-promisify');

interface Props {
  web3: Web3;
  dharma: Dharma;
}

interface State {
  tokens: {
    [key: string]: Token,
  };
}

interface Token {
  address: string;
  tradingPermitted: boolean;
}

class TradingPermissions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.getTokenAllowance = this.getTokenAllowance.bind(this);
    this.updateProxyAllowanceAsync = this.updateProxyAllowanceAsync.bind(this);
    this.state = {
      tokens: {}
    };
    this.getTokenData(this.props.dharma);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.dharma && nextProps.dharma) {
      this.getTokenData(nextProps.dharma);
    }
  }

  async getTokenAllowance(tokenRegistry: any, tokenAddress: string) {
    const accounts = await promisify(this.props.web3.eth.getAccounts)();
    // TODO: handle account retrieval error more robustly
    if (!accounts || !accounts[0]) {
      return new BigNumber(-1);
    }

    const ownerAddress = accounts[0];
    const tokenAllowance = await this.props.dharma.token.getProxyAllowanceAsync(tokenAddress, ownerAddress);
    return new BigNumber(tokenAllowance);
  }

  async getTokenData(dharma: Dharma) {
    if (!dharma) {
      return;
    }

    const tokenRegistry = await dharma.contracts.loadTokenRegistry();
    // TODO: get token tickers from dharma.js
    const tokenNames = ['ZRX', 'REP'];
    var tokens = {};

    for (let tokenName of tokenNames) {
      const address = await tokenRegistry.getTokenAddress.callAsync(tokenName);
      const tradingPermitted = this.isAllowanceUnlimited(await this.getTokenAllowance(tokenRegistry, address));
      tokens[tokenName] = { address, tradingPermitted };
    }

    this.setState({ tokens });
  }

  async updateProxyAllowanceAsync(tradingPermitted: boolean, tokenName: string) {
    const tokens = { ...this.state.tokens };
    let selectedToken = tokens[tokenName];

    if (selectedToken) {
      if (tradingPermitted) {
        await this.props.dharma.token.setProxyAllowanceAsync(selectedToken.address, new BigNumber(0));
      } else {
        await this.props.dharma.token.setUnlimitedProxyAllowanceAsync(selectedToken.address);
      }

      // TODO: remove the sleep hack
      // await this.props.dharma.blockchain.awaitTransactionMinedAsync(transactionHash);
      await new Promise(resolve => setTimeout(resolve, 5000));

      const tokenRegistry = await this.props.dharma.contracts.loadTokenRegistry();
      selectedToken.tradingPermitted = this.isAllowanceUnlimited(
        await this.getTokenAllowance(tokenRegistry, selectedToken.address));

      this.setState({ tokens });
    }
  }

  isAllowanceUnlimited(tokenAllowance: BigNumber) {
    return tokenAllowance.equals((new BigNumber(2)).pow(256).minus(new BigNumber(1)));
  }

  render() {
    const tokens = this.state.tokens;
    const tokenItems = [];

    for (let tokenName in tokens) {
      if (tokens.hasOwnProperty(tokenName)) {
        const token = tokens[tokenName];

        tokenItems.push(
          <Col xs="4" md="12" key={tokenName}>
            <NavItem>
              <Toggle
                name={tokenName}
                label={tokenName}
                checked={token.tradingPermitted}
                onChange={() => this.updateProxyAllowanceAsync(token.tradingPermitted, tokenName)}
              />
            </NavItem>
          </Col>
        );
      }
    }

    return (
      <Row>
        <TradingPermissionsContainer>
          <TradingPermissionsTitle>{'Trading Permissions'}</TradingPermissionsTitle>
          {tokenItems}
        </TradingPermissionsContainer>
      </Row>
    );
  }
}

export { TradingPermissions };
