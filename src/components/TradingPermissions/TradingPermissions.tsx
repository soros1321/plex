import * as React from 'react';
import { Toggle } from '../Toggle';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { BigNumber } from 'bignumber.js';
import {
	TradingPermissionsContainer,
	TradingPermissionsTitle,
	TokenSymbol,
	TokenBalance,
	FaucetButton,
	ShowMoreButton,
	Arrow
} from './styledComponents';
import { TokenEntity } from '../../models';
const promisify = require('tiny-promisify');
import { Collapse } from 'reactstrap';
const arrowDown = require('../../assets/img/arrow_down_white.png');
const arrowUp = require('../../assets/img/arrow_up_white.png');

interface Props {
	web3: Web3;
	dharma: Dharma;
	tokens: TokenEntity[];
	handleSetAllTokensTradingPermission: (tokens: TokenEntity[]) => void;
	handleToggleTokenTradingPermission: (tokenSymbol: string, permission: boolean) => void;
	className?: string;
}

interface State {
	collapse: boolean;
}

class TradingPermissions extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapse: false
		};
		this.getTokenAllowance = this.getTokenAllowance.bind(this);
		this.updateProxyAllowanceAsync = this.updateProxyAllowanceAsync.bind(this);
		this.handleFaucet = this.handleFaucet.bind(this);
		this.showMore = this.showMore.bind(this);
	}

	async componentDidMount() {
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
			let balance = await this.getTokenBalance(address);
			// balance = tokenSymbol !== 'REP' ? new BigNumber(0) : balance;
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

	handleFaucet(tokenAddress: string) {
		console.log(tokenAddress);
	}

	showMore() {
		this.setState({ collapse: !this.state.collapse });
	}

	render() {
		if (!this.props.tokens || !this.props.tokens.length) {
			return null;
		}
		const { web3, tokens } = this.props;
		let tokenItems: JSX.Element[] = [];
		let tokenItemsMore: JSX.Element[] = [];

		let count: number = 0;
		for (let token of tokens) {
			const tokenLabel = (
				<div>
					<TokenSymbol>{token.tokenSymbol}</TokenSymbol>
					{token.balance.gt(0)
						? <TokenBalance>({web3.fromWei(token.balance.toString(), 'ether')})</TokenBalance>
						: <FaucetButton onClick={(e) => this.handleFaucet(token.address)}>Faucet</FaucetButton>
					}
				</div>
			);
			if (count < 2) {
				tokenItems.push(
					<Toggle
						name={token.tokenSymbol}
						label={tokenLabel}
						checked={token.tradingPermitted}
						disabled={token.balance.gt(0) ? false : true}
						onChange={() => this.updateProxyAllowanceAsync(token.tradingPermitted, token.tokenSymbol)}
						key={token.tokenSymbol}
					/>
				);
			} else {
				tokenItemsMore.push(
					<Toggle
						name={token.tokenSymbol}
						label={tokenLabel}
						checked={token.tradingPermitted}
						disabled={token.balance.gt(0) ? false : true}
						onChange={() => this.updateProxyAllowanceAsync(token.tradingPermitted, token.tokenSymbol)}
						key={token.tokenSymbol}
					/>
				);
			}
			count++;
		}

		return (
			<TradingPermissionsContainer className={this.props.className}>
				<TradingPermissionsTitle>{'Trading Permissions'}</TradingPermissionsTitle>
				{tokenItems}
				<Collapse isOpen={this.state.collapse}>
					{tokenItemsMore}
				</Collapse>
				<ShowMoreButton onClick={this.showMore}>
					More <Arrow src={this.state.collapse ? arrowUp : arrowDown} />
				</ShowMoreButton>
			</TradingPermissionsContainer>
		);
	}
}

export { TradingPermissions };
