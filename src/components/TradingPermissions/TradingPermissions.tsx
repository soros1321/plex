import * as React from 'react';
import { Toggle } from '../Toggle';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';
import {
	TradingPermissionsContainer,
	TradingPermissionsTitle,
	TokenSymbol,
	TokenBalance
} from './styledComponents';
import { TokenEntity } from '../../models';
const promisify = require('tiny-promisify');

interface Props {
	web3: Web3;
	dharma: Dharma;
	tokens: TokenEntity[];
	handleSetAllTokensTradingPermission: (tokens: TokenEntity[]) => void;
	handleToggleTokenTradingPermission: (tokenSymbol: string, permission: boolean) => void;
	className?: string;
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

	async getTokenBalance(tokenAddress: string) {
		const accounts = await promisify(this.props.web3.eth.getAccounts)();
		// TODO: handle account retrieval error more robustly
		if (!accounts || !accounts[0]) {
			return new BigNumber(-1);
		}

		const ownerAddress = accounts[0];
		const tokenBalance = await this.props.dharma.token.getBalanceAsync(tokenAddress, ownerAddress);
		return new BigNumber(tokenBalance);
	}

	async getTokenData(dharma: Dharma) {
		if (!dharma) {
			return;
		}

		const tokenRegistry = await dharma.contracts.loadTokenRegistry();
		// TODO: get token tickers from dharma.js
		const tokenSymbols = ['REP', 'MKR', 'ZRX'];

		let allTokens: TokenEntity[] = [];

		for (let tokenSymbol of tokenSymbols) {
			const address = await tokenRegistry.getTokenAddress.callAsync(tokenSymbol);
			const tradingPermitted = this.isAllowanceUnlimited(await this.getTokenAllowance(address));
			const balance = await this.getTokenBalance(address);
			allTokens.push({
				address,
				tokenSymbol: tokenSymbol,
				tradingPermitted,
				balance
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
		const { web3, tokens } = this.props;
		let tokenItems: JSX.Element[] = [];

		for (let token of tokens) {
			const tokenLabel = (
				<div>
					<TokenSymbol>{token.tokenSymbol}</TokenSymbol>
					<TokenBalance>({web3.fromWei(token.balance.toString(), 'ether')})</TokenBalance>
				</div>
			);
			tokenItems.push(
				<Toggle
					name={token.tokenSymbol}
					label={tokenLabel}
					checked={token.tradingPermitted}
					onChange={() => this.updateProxyAllowanceAsync(token.tradingPermitted, token.tokenSymbol)}
					key={token.tokenSymbol}
				/>
			);
		}

		return (
			<TradingPermissionsContainer className={this.props.className}>
				<TradingPermissionsTitle>{'Trading Permissions'}</TradingPermissionsTitle>
				{tokenItems}
			</TradingPermissionsContainer>
		);
	}
}

export { TradingPermissions };
