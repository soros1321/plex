import * as React from 'react';
import { DebtOrderEntity, TokenEntity } from '../../../../models';
import { BigNumber } from 'bignumber.js';
import {
	Wrapper,
	HalfCol,
	Value,
	TokenWrapper,
	Label
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
	tokens: TokenEntity[];
}

interface State {
	tokenBalances: {
		[key: string]: {
			totalRequested: BigNumber;
			totalRepayed: BigNumber;
		}
	};
}

class DebtsMetrics extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			tokenBalances: {}
		};
	}

	componentDidMount() {
		this.initiateTokenBalance(this.props.tokens, this.props.debtOrders);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.tokens && nextProps.debtOrders) {
			this.initiateTokenBalance(nextProps.tokens, nextProps.debtOrders);
		}
	}

	initiateTokenBalance(tokens: TokenEntity[], debtOrders: DebtOrderEntity[]) {
		let tokenBalances: any = {};
		if (tokens && tokens.length) {
			for (let token of tokens) {
				tokenBalances[token.tokenSymbol] = {
					totalRequested: new BigNumber(0),
					totalRepayed: new BigNumber(0)
				};
			}
		}
		if (debtOrders && debtOrders.length) {
			for (let debtOrder of debtOrders) {
				if (tokenBalances[debtOrder.principalTokenSymbol]) {
					tokenBalances[debtOrder.principalTokenSymbol].totalRequested = tokenBalances[debtOrder.principalTokenSymbol].totalRequested.plus(debtOrder.principalAmount);
				}
			}
			this.setState({ tokenBalances });
		}
	}

	render() {
		const { tokenBalances } = this.state;
		let totalRequestedRows: JSX.Element[] = [];
		let totalRepayedRows: JSX.Element[] = [];
		for (let token in tokenBalances) {
			if (tokenBalances[token].totalRequested.gt(0) || tokenBalances[token].totalRepayed.gt(0)) {
				if (tokenBalances[token].totalRequested.gt(0)) {
					if (totalRequestedRows.length >= 4) {
						continue;
					}
					if (totalRequestedRows.length === 3) {
						totalRequestedRows.push(
							<TokenWrapper key={'more'}>AND MORE</TokenWrapper>
						);
					} else {
						totalRequestedRows.push(
							<TokenWrapper key={token}>{tokenBalances[token].totalRequested.toNumber() + ' ' + token}</TokenWrapper>
						);
					}
				}
				if (tokenBalances[token].totalRepayed.gt(0)) {
					if (totalRepayedRows.length >= 4) {
						continue;
					}
					if (totalRepayedRows.length === 3) {
						totalRepayedRows.push(
							<TokenWrapper key={'more'}>AND MORE</TokenWrapper>
						);
					} else {
						totalRepayedRows.push(
							<TokenWrapper key={token}>{tokenBalances[token].totalRepayed.toNumber() + ' ' + token}</TokenWrapper>
						);
					}
				}
			}
		}
		const defaultTotalRequested = <TokenWrapper>0 ETH</TokenWrapper>;
		const defaultTotalRepayed = <TokenWrapper>0 ETH</TokenWrapper>;
		return (
			<Wrapper>
				<HalfCol>
					<Value>
						{totalRequestedRows.length
							? totalRequestedRows
							: defaultTotalRequested
						}
					</Value>
					<Label>Total Requested</Label>
				</HalfCol>
				<HalfCol>
					<Value>
						{totalRepayedRows.length
							? totalRepayedRows
							: defaultTotalRepayed
						}
					</Value>
					<Label>Total Repayed</Label>
				</HalfCol>
			</Wrapper>
		);
	}
}

export { DebtsMetrics };
