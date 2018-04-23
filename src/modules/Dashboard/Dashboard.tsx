import * as React from "react";
import * as Web3 from "web3";
import { DebtOrderEntity, InvestmentEntity } from "../../models";
import { Nav, NavLink, TabContent, TabPane } from "reactstrap";
import { DebtsContainer } from "./Debts/DebtsContainer";
import { InvestmentsContainer } from "./Investments/InvestmentsContainer";
import { Wrapper, StyledNavItem, TitleFirstWord, TitleRest } from "./styledComponents";
import Dharma from "@dharmaprotocol/dharma.js";
import { debtOrderFromJSON } from "../../utils";
const Web3Utils = require("../../utils/web3Utils");
import { BigNumber } from "bignumber.js";

interface Props {
    dharma: Dharma;
    accounts: string[];
    pendingDebtOrders: DebtOrderEntity[];
    investments: InvestmentEntity[];
    handleSetError: (errorMessage: string) => void;
    handleFillDebtOrder: (issuanceHash: string) => void;
    setInvestments: (investments: InvestmentEntity[]) => void;
    web3: Web3;
    filledDebtOrders: DebtOrderEntity[];
    handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) => void;
}

interface States {
    initiallyLoading: boolean;
    activeTab: string;
    currentTime?: number;
    investments: InvestmentEntity[];
}

class Dashboard extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: "1",
            initiallyLoading: true,
            investments: [],
        };
    }

    async componentDidMount() {
        if (this.props.dharma) {
            await this.getDebtsAsync(this.props.dharma);
            await this.getInvestmentsAsync(this.props.dharma);
            await this.getBlockchainTime();
            this.setState({ initiallyLoading: false });
        }
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.dharma !== prevProps.dharma) {
            await this.getDebtsAsync(this.props.dharma);
            await this.getInvestmentsAsync(this.props.dharma);
            await this.getBlockchainTime();
            this.setState({ initiallyLoading: false });
        }
    }

    async getBlockchainTime() {
        const web3Utils = new Web3Utils(this.props.web3);
        const currentTime = await web3Utils.getCurrentBlockTime();
        this.setState({ currentTime });
    }

    async getDebtsAsync(dharma: Dharma) {
        try {
            if (!dharma || !this.props.accounts || !this.props.accounts.length) {
                return;
            }
            const { accounts, pendingDebtOrders } = this.props;
            const issuanceHashes = await dharma.servicing.getDebtsAsync(accounts[0]);
            let filledDebtOrders: DebtOrderEntity[] = [];
            for (let issuanceHash of issuanceHashes) {
                const debtRegistryEntry = await dharma.servicing.getDebtRegistryEntry(issuanceHash);

                const termsContractType = await dharma.contracts.getTermsContractType(
                    debtRegistryEntry.termsContract,
                );
                const adapter = await dharma.adapters.getAdapterByTermsContractAddress(
                    debtRegistryEntry.termsContract,
                );
                // TODO: cast dharmaDebtOrder to termsContractType, set above
                const dharmaDebtOrder = (await adapter.fromDebtRegistryEntry(
                    debtRegistryEntry,
                )) as any;
                const repaymentSchedule = await adapter.getRepaymentSchedule(debtRegistryEntry);
                const repaidAmount = await dharma.servicing.getValueRepaid(issuanceHash);
                const totalExpectedRepayment = await dharma.servicing.getTotalExpectedRepayment(
                    issuanceHash,
                );
                const status = new BigNumber(repaidAmount).gte(
                    new BigNumber(totalExpectedRepayment),
                )
                    ? "inactive"
                    : "active";
                const debtOrder: DebtOrderEntity = {
                    debtor: accounts[0],
                    termsContract: debtRegistryEntry.termsContract,
                    termsContractParameters: debtRegistryEntry.termsContractParameters,
                    underwriter: debtRegistryEntry.underwriter,
                    underwriterRiskRating: debtRegistryEntry.underwriterRiskRating,
                    amortizationUnit: dharmaDebtOrder.amortizationUnit,
                    interestRate: dharmaDebtOrder.interestRate,
                    principalAmount: dharmaDebtOrder.principalAmount,
                    principalTokenSymbol: dharmaDebtOrder.principalTokenSymbol,
                    termLength: dharmaDebtOrder.termLength,
                    issuanceHash,
                    repaidAmount,
                    repaymentSchedule,
                    status,
                    creditor: debtRegistryEntry.beneficiary,
                };
                if (termsContractType === "CollateralizedSimpleInterestLoan") {
                    debtOrder.collateralAmount = dharmaDebtOrder.collateralAmount;
                    debtOrder.collateralized = true;
                    debtOrder.collateralReturnable = await dharma.adapters.collateralizedSimpleInterestLoan.canReturnCollateral(
                        issuanceHash,
                    );
                    debtOrder.collateralTokenSymbol = dharmaDebtOrder.collateralTokenSymbol;
                    debtOrder.gracePeriodInDays = dharmaDebtOrder.gracePeriodInDays;

                    if (debtOrder.collateralReturnable) {
                        debtOrder.status = "active";
                    }
                }

                filledDebtOrders.push(debtOrder);
            }

            this.props.handleSetFilledDebtOrders(filledDebtOrders);

            // Check whether any of the pending debt orders is filled
            // Then, we want to remove it from the list
            if (pendingDebtOrders) {
                for (let pendingDebtOrder of pendingDebtOrders) {
                    if (issuanceHashes.indexOf(pendingDebtOrder.issuanceHash) >= 0) {
                        this.props.handleFillDebtOrder(pendingDebtOrder.issuanceHash);
                    }
                }
            }
        } catch (e) {
            this.props.handleSetError(e.message);
        }
    }

    async getInvestmentsAsync(dharma: Dharma) {
        try {
            if (!dharma || !this.props.accounts || !this.props.accounts.length) {
                return;
            }
            const { accounts } = this.props;
            const issuanceHashes = await dharma.servicing.getInvestmentsAsync(accounts[0]);
            let investments: InvestmentEntity[] = [];
            for (let issuanceHash of issuanceHashes) {
                const debtRegistryEntry = await dharma.servicing.getDebtRegistryEntry(issuanceHash);

                const termsContractType = await dharma.contracts.getTermsContractType(
                    debtRegistryEntry.termsContract,
                );
                const adapter = await dharma.adapters.getAdapterByTermsContractAddress(
                    debtRegistryEntry.termsContract,
                );
                // TODO: cast dharmaDebtOrder to termsContractType, set above
                const dharmaDebtOrder = (await adapter.fromDebtRegistryEntry(
                    debtRegistryEntry,
                )) as any;
                const repaymentSchedule = await adapter.getRepaymentSchedule(debtRegistryEntry);
                const earnedAmount = await dharma.servicing.getValueRepaid(issuanceHash);
                const totalExpectedEarning = await dharma.servicing.getTotalExpectedRepayment(
                    issuanceHash,
                );
                const status = new BigNumber(earnedAmount).gte(new BigNumber(totalExpectedEarning))
                    ? "inactive"
                    : "active";
                const investment: InvestmentEntity = {
                    creditor: debtRegistryEntry.beneficiary,
                    termsContract: debtRegistryEntry.termsContract,
                    termsContractParameters: debtRegistryEntry.termsContractParameters,
                    underwriter: debtRegistryEntry.underwriter,
                    underwriterRiskRating: debtRegistryEntry.underwriterRiskRating,
                    amortizationUnit: dharmaDebtOrder.amortizationUnit,
                    interestRate: dharmaDebtOrder.interestRate,
                    principalAmount: dharmaDebtOrder.principalAmount,
                    principalTokenSymbol: dharmaDebtOrder.principalTokenSymbol,
                    termLength: dharmaDebtOrder.termLength,
                    issuanceHash,
                    earnedAmount,
                    repaymentSchedule,
                    status,
                };
                if (termsContractType === "CollateralizedSimpleInterestLoan") {
                    investment.collateralAmount = dharmaDebtOrder.collateralAmount;
                    investment.collateralized = true;
                    investment.collateralTokenSymbol = dharmaDebtOrder.collateralTokenSymbol;
                    investment.gracePeriodInDays = dharmaDebtOrder.gracePeriodInDays;

                    const collateralizedAdapter = await dharma.adapters
                        .collateralizedSimpleInterestLoan;
                    const collateralSeizable = await collateralizedAdapter.canSeizeCollateral(
                        issuanceHash,
                    );

                    investment.collateralSeizable = collateralSeizable;
                }

                investments.push(investment);
            }
            this.props.setInvestments(investments);
        } catch (e) {
            // this.props.handleSetError('Unable to get investments info');
            this.props.handleSetError(e.message);
        }
    }

    toggle(tab: string) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const { pendingDebtOrders, filledDebtOrders } = this.props;
        if (!pendingDebtOrders || !filledDebtOrders) {
            return null;
        }

        const debtOrders = pendingDebtOrders.concat(filledDebtOrders);
        for (const index of Object.keys(debtOrders)) {
            debtOrders[index] = debtOrderFromJSON(JSON.stringify(debtOrders[index]));
        }

        const { activeTab, initiallyLoading, currentTime } = this.state;
        const investments = this.props.investments;

        const tabs = [
            {
                id: "1",
                titleFirstWord: "Your ",
                titleRest: "Debts (" + debtOrders.length + ")",
                content: (
                    <DebtsContainer
                        currentTime={currentTime}
                        dharma={this.props.dharma}
                        debtOrders={debtOrders}
                        initializing={initiallyLoading}
                    />
                ),
            },
            {
                id: "2",
                titleFirstWord: "Your ",
                titleRest: "Investments (" + investments.length + ")",
                content: (
                    <InvestmentsContainer
                        currentTime={currentTime}
                        investments={investments}
                        initializing={initiallyLoading}
                    />
                ),
            },
        ];
        const tabNavs = tabs.map((tab) => (
            <StyledNavItem key={tab.id}>
                <NavLink
                    className={activeTab === tab.id ? "active" : ""}
                    onClick={() => {
                        this.toggle(tab.id);
                    }}
                >
                    <TitleFirstWord>{tab.titleFirstWord}</TitleFirstWord>
                    <TitleRest>{tab.titleRest}</TitleRest>
                </NavLink>
            </StyledNavItem>
        ));
        const tabContents = tabs.map((tab) => (
            <TabPane tabId={tab.id} key={tab.id}>
                {tab.content}
            </TabPane>
        ));

        return (
            <Wrapper>
                <Nav tabs={true}>{tabNavs}</Nav>
                <TabContent activeTab={activeTab}>{tabContents}</TabContent>
            </Wrapper>
        );
    }
}

export { Dashboard };
