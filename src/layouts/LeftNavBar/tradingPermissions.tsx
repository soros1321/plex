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
import { TokenEntity } from '../../models';
const promisify = require('tiny-promisify');

interface Props {
	web3: Web3;
	dharma: Dharma;
	tokens: TokenEntity[];
	handleSetAllTokensTradingPermission: (tokens: TokenEntity[]) => void;
	handleToggleTokenTradingPermission: (tokenSymbol: string, permission: boolean) => void;
}

class TradingPermissions extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.getTokenAllowance = this.getTokenAllowance.bind(this);
		this.updateProxyAllowanceAsync = this.updateProxyAllowanceAsync.bind(this);
		this.getTokenData(this.props.dharma);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (!this.props.dharma && nextProps.dharma) {
			this.getTokenData(nextProps.dharma);
		}
	}

	async getTokenAllowance(tokenAddress: string) {
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
		const tokenNames = ['REP', 'MKR', 'ZRX'];
		var tokens = {};

		let allTokens: TokenEntity[] = [];

		for (let tokenName of tokenNames) {
			const address = await tokenRegistry.getTokenAddress.callAsync(tokenName);
			const tradingPermitted = this.isAllowanceUnlimited(await this.getTokenAllowance(address));
			tokens[tokenName] = { address, tradingPermitted };
			allTokens.push({
				address,
				tokenSymbol: tokenName,
				tradingPermitted
			});
		}

		this.props.handleSetAllTokensTradingPermission(allTokens);
	}

	async updateProxyAllowanceAsync(tradingPermitted: boolean, tokenSymbol: string) {
		const { tokens, dharma } = this.props;
		let selectedToken: TokenEntity | undefined = undefined;
		for (let token of tokens) {
			if (token.tokenSymbol === tokenSymbol) {
				selectedToken = token;
				break;
			}
		}
		if (selectedToken) {
			if (tradingPermitted) {
				await dharma.token.setProxyAllowanceAsync(selectedToken.address, new BigNumber(0));
			} else {
				await dharma.token.setUnlimitedProxyAllowanceAsync(selectedToken.address);
			}

			// TODO: remove the sleep hack
			// await this.props.dharma.blockchain.awaitTransactionMinedAsync(transactionHash);
			await new Promise(resolve => setTimeout(resolve, 5000));

			selectedToken.tradingPermitted = this.isAllowanceUnlimited(
				await this.getTokenAllowance(selectedToken.address));

			this.props.handleToggleTokenTradingPermission(tokenSymbol, !tradingPermitted);
		}
	}

	isAllowanceUnlimited(tokenAllowance: BigNumber) {
		return tokenAllowance.equals((new BigNumber(2)).pow(256).minus(new BigNumber(1)));
	}

	render() {
		if (!this.props.tokens || !this.props.tokens.length) {
			return null;
		}
		const { tokens } = this.props;
		let tokenItems: JSX.Element[] = [];

		for (let token of tokens) {
			tokenItems.push(
				<Col xs="4" md="12" key={token.tokenSymbol}>
					<NavItem>
						<Toggle
							name={token.tokenSymbol}
							label={token.tokenSymbol}
							checked={token.tradingPermitted}
							onChange={() => this.updateProxyAllowanceAsync(token.tradingPermitted, token.tokenSymbol)}
						/>
					</NavItem>
				</Col>
			);
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
