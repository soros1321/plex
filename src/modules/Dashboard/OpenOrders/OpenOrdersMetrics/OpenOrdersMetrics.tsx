import * as React from "react";
import { TokenEntity, DebtOrderEntity } from "src/models";
import { BigNumber } from "bignumber.js";
import { Wrapper, Value, TokenWrapper, Label } from "./styledComponents";
import { TokenAmount } from "src/components";

interface Props {
    debtOrders: DebtOrderEntity[];
    tokens: TokenEntity[];
}

class OpenOrdersMetrics extends React.Component<Props, {}> {
    render() {
        const { tokens, debtOrders } = this.props;
        if (!tokens || !debtOrders) {
            return null;
        }
        let tokenBalances: any = {};
        for (let token of tokens) {
            tokenBalances[token.tokenSymbol] = {
                totalRequested: new BigNumber(0),
            };
        }
        for (let debtOrder of debtOrders) {
            if (tokenBalances[debtOrder.principalTokenSymbol]) {
                tokenBalances[debtOrder.principalTokenSymbol].totalRequested = tokenBalances[
                    debtOrder.principalTokenSymbol
                ].totalRequested.plus(debtOrder.principalAmount);
            }
        }

        let totalRequestedRows: JSX.Element[] = [];
        for (let token in tokenBalances) {
            if (tokenBalances[token].totalRequested.gt(0) && totalRequestedRows.length < 4) {
                if (totalRequestedRows.length === 3) {
                    totalRequestedRows.push(<TokenWrapper key={"more"}>AND MORE</TokenWrapper>);
                } else {
                    totalRequestedRows.push(
                        <TokenWrapper key={token}>
                            <TokenAmount
                                tokenAmount={tokenBalances[token].totalRequested}
                                tokenSymbol={token}
                            />
                        </TokenWrapper>,
                    );
                }
            }
        }
        const defaultTotal = <TokenWrapper>0 ETH</TokenWrapper>;
        return (
            <Wrapper>
                <Value>{totalRequestedRows.length ? totalRequestedRows : defaultTotal}</Value>
                <Label>Total Requested</Label>
            </Wrapper>
        );
    }
}

export { OpenOrdersMetrics };
