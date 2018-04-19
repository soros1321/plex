import * as React from "react";
import { DebtOrderEntity } from "src/models";
import { Header, MainWrapper } from "src/components";
import { BarLoader } from "react-spinners";
import { OpenOrdersMetricsContainer } from "./OpenOrdersMetrics/OpenOrdersMetricsContainer";
import { ActiveOpenOrderContainer } from "./ActiveOpenOrder/ActiveOpenOrderContainer";

interface Props {
    debtOrders: DebtOrderEntity[];
    initializing: boolean;
}

class OpenOrders extends React.Component<Props, {}> {
    render() {
        const { debtOrders } = this.props;
        if (this.props.initializing) {
            return (
                <MainWrapper>
                    <Header title="Your Open Orders" />
                    <BarLoader width={200} height={10} color={"#1cc1cc"} loading={true} />
                </MainWrapper>
            );
        } else {
            return (
                <MainWrapper>
                    <Header title="Your Open Orders" />
                    <OpenOrdersMetricsContainer debtOrders={debtOrders} />
                    {debtOrders.map((debtOrder) => (
                        <ActiveOpenOrderContainer
                            key={debtOrder.issuanceHash}
                            debtOrder={debtOrder}
                        />
                    ))}
                </MainWrapper>
            );
        }
    }
}

export { OpenOrders };
