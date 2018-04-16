import * as React from "react";
import { DebtOrderEntity } from "../../../models";
import { Header, MainWrapper } from "../../../components";
import { DebtsMetricsContainer } from "./DebtsMetrics/DebtsMetricsContainer";
import { ActiveDebtOrderContainer } from "./ActiveDebtOrder/ActiveDebtOrderContainer";
import { DebtOrderHistory } from "./DebtOrderHistory";
import Dharma from "@dharmaprotocol/dharma.js";
import { BarLoader } from "react-spinners";

interface Props {
    debtOrders: DebtOrderEntity[];
    dharma: Dharma;
    initializing: boolean;
}

interface State {
    allDebtOrders: DebtOrderEntity[];
    activeDebtOrders: DebtOrderEntity[];
    inactiveDebtOrders: DebtOrderEntity[];
}

class Debts extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            allDebtOrders: [],
            activeDebtOrders: [],
            inactiveDebtOrders: [],
        };
    }

    componentDidMount() {
        this.getDebtOrdersDetails(this.props.debtOrders);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.debtOrders !== prevProps.debtOrders) {
            this.getDebtOrdersDetails(this.props.debtOrders);
        }
    }

    getDebtOrdersDetails(debtOrders: DebtOrderEntity[]) {
        if (!debtOrders) {
            return;
        }
        const allDebtOrders: DebtOrderEntity[] = [];
        const activeDebtOrders: DebtOrderEntity[] = [];
        const inactiveDebtOrders: DebtOrderEntity[] = [];
        for (let debtOrder of debtOrders) {
            if (debtOrder.status === "inactive") {
                inactiveDebtOrders.push(debtOrder);
            } else {
                activeDebtOrders.push(debtOrder);
            }
            allDebtOrders.push(debtOrder);
        }
        this.setState({
            allDebtOrders,
            activeDebtOrders,
            inactiveDebtOrders,
        });
    }

    render() {
        const { allDebtOrders, activeDebtOrders, inactiveDebtOrders } = this.state;

        if (this.props.initializing) {
            return (
                <MainWrapper>
                    <Header title="Your Debts" />
                    <BarLoader width={200} height={10} color={"#1cc1cc"} loading={true} />
                </MainWrapper>
            );
        } else {
            return (
                <MainWrapper>
                    <Header title="Your Debts" />
                    <DebtsMetricsContainer debtOrders={allDebtOrders} />
                    {activeDebtOrders.map((debtOrder) => (
                        <ActiveDebtOrderContainer
                            dharma={this.props.dharma}
                            debtOrder={debtOrder}
                            key={debtOrder.issuanceHash}
                        />
                    ))}
                    <DebtOrderHistory debtOrders={inactiveDebtOrders} />
                </MainWrapper>
            );
        }
    }
}

export { Debts };
