import * as React from "react";
import { shallow, mount } from "enzyme";
import { Debts } from "src/modules/Dashboard/Debts/Debts";
import { Header, MainWrapper } from "src/components";
import { DebtsMetricsContainer } from "src/modules/Dashboard/Debts/DebtsMetrics/DebtsMetricsContainer";
import { ActiveDebtOrderContainer } from "src/modules/Dashboard/Debts/ActiveDebtOrder/ActiveDebtOrderContainer";
import { DebtOrderHistory } from "src/modules/Dashboard/Debts/DebtOrderHistory";
import { BigNumber } from "bignumber.js";
import { debtOrderFromJSON } from "src/utils";
import { BarLoader } from "react-spinners";

describe("<Debts />", () => {
    describe("#render", () => {
        describe("#initializing true", () => {
            let wrapper;
            let props;

            beforeEach(() => {
                props = {
                    debtOrders: [],
                    initializing: true,
                };
                wrapper = shallow(<Debts {...props} />);
            });

            it("should render successfully", () => {
                expect(wrapper.length).toEqual(1);
            });

            it("should render a <Header />", () => {
                expect(wrapper.find(MainWrapper).find(Header).length).toEqual(1);
            });

            it("should render a <BarLoader />", () => {
                expect(wrapper.find(MainWrapper).find(BarLoader).length).toEqual(1);
            });

            it("should not render <DebtsMetricsContainer />, <ActiveDebtOrderContainer />, and <DebtOrderHistory />", () => {
                expect(wrapper.find(MainWrapper).find(DebtsMetricsContainer).length).toEqual(0);
                expect(wrapper.find(MainWrapper).find(ActiveDebtOrderContainer).length).toEqual(0);
                expect(wrapper.find(MainWrapper).find(DebtOrderHistory).length).toEqual(0);
            });
        });

        describe("#initializing false", () => {
            let wrapper;
            let props;

            beforeEach(() => {
                props = {
                    debtOrders: [],
                    initializing: false,
                    currentTime: 12345,
                };
                wrapper = shallow(<Debts {...props} />);
            });

            it("should render successfully", () => {
                expect(wrapper.length).toEqual(1);
            });

            it("should render a <Header />", () => {
                expect(wrapper.find(MainWrapper).find(Header).length).toEqual(1);
            });

            it("should render a <DebtsMetricsContainer />", () => {
                expect(wrapper.find(MainWrapper).find(DebtsMetricsContainer).length).toEqual(1);
            });

            it("should render 0 <ActiveDebtOrderContainer />", () => {
                expect(wrapper.find(MainWrapper).find(ActiveDebtOrderContainer).length).toEqual(0);
            });

            it("should render a <DebtOrderHistory />", () => {
                expect(wrapper.find(MainWrapper).find(DebtOrderHistory).length).toEqual(1);
            });

            it("should not render <BarLoader />", () => {
                expect(wrapper.find(MainWrapper).find(BarLoader).length).toEqual(0);
            });
        });
    });

    describe("#componentDidMount", () => {
        it("should call getDebtOrdersDetails", () => {
            const spy = jest.spyOn(Debts.prototype, "getDebtOrdersDetails");
            const props = {
                debtOrders: [],
            };
            const wrapper = shallow(<Debts {...props} />);
            expect(spy.mock.calls.length).toEqual(1);
        });
    });

    describe("#componentDidUpdate", () => {
        it("should not call getDebtOrderDetails when debtOrders is null", () => {
            const props = {
                debtOrders: [],
            };
            const wrapper = shallow(<Debts {...props} />);
            const spy = jest.spyOn(wrapper.instance(), "getDebtOrdersDetails");
            wrapper.setProps({ debtOrders: null });
            expect(spy).toHaveBeenCalledWith(null);
        });

        it("should call getDebtOrderDetails when debtOrders is avail", () => {
            const props = {
                debtOrders: null,
            };
            const wrapper = shallow(<Debts {...props} />);
            const spy = jest.spyOn(wrapper.instance(), "getDebtOrdersDetails");
            const debtOrders = [
                {
                    debtor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                    termsContract: "0x1c907384489d939400fa5c6571d8aad778213d74",
                    termsContractParameters:
                        "0x0000000000000000000000000000008500000000000000000000000000000064",
                    underwriter: "0x0000000000000000000000000000000000000000",
                    underwriterRiskRating: new BigNumber(0),
                    amortizationUnit: "hours",
                    interestRate: new BigNumber(3.12),
                    principalAmount: new BigNumber(100),
                    principalTokenSymbol: "REP",
                    termLength: new BigNumber(6),
                    issuanceHash:
                        "0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf",
                    repaidAmount: new BigNumber(4),
                    repaymentSchedule: [1553557371],
                    status: "active",
                    json:
                        '{"principalToken":"0x9b62bd396837417ce319e2e5c8845a5a960010ea","principalAmount":"10","termsContract":"0x1c907384489d939400fa5c6571d8aad778213d74","termsContractParameters":"0x0000000000000000000000000000008500000000000000000000000000000064","kernelVersion":"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f","issuanceVersion":"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de","debtor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","debtorFee":"0","creditor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","creditorFee":"0","relayer":"0x0000000000000000000000000000000000000000","relayerFee":"0","underwriter":"0x0000000000000000000000000000000000000000","underwriterFee":"0","underwriterRiskRating":"0","expirationTimestampInSec":"1524613355","salt":"0","debtorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"creditorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"underwriterSignature":{"r":"","s":"","v":0}}',
                    creditor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                    description: "Hello, Can I borrow some REP please?",
                    fillLoanShortUrl: "http://bit.ly/2I4bahM",
                },
            ];
            wrapper.setProps({ debtOrders });
            expect(spy).toHaveBeenCalledWith(debtOrders);
        });
    });

    describe("#getDebtOrdersDetails", () => {
        let determineExpectedState = (debtOrders) => {
            const allDebtOrders = [];
            const activeDebtOrders = [];
            const inactiveDebtOrders = [];
            for (let debtOrder of debtOrders) {
                if (debtOrder.status === "inactive") {
                    inactiveDebtOrders.push(debtOrder);
                } else {
                    activeDebtOrders.push(debtOrder);
                }
                allDebtOrders.push(debtOrder);
            }
            const expectedState = {
                allDebtOrders,
                activeDebtOrders,
                inactiveDebtOrders,
            };
            return expectedState;
        };
        it("returns without setting state if debtOrders is null", () => {
            const props = {
                debtOrders: [],
            };
            const wrapper = shallow(<Debts {...props} />);
            const spy = jest.spyOn(wrapper.instance(), "setState");

            wrapper.instance().getDebtOrdersDetails(null);
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });

        it("add debtOrder to activeDebtOrders when status is active", () => {
            const props = {
                debtOrders: [
                    {
                        debtor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        termsContract: "0x1c907384489d939400fa5c6571d8aad778213d74",
                        termsContractParameters:
                            "0x0000000000000000000000000000008500000000000000000000000000000064",
                        underwriter: "0x0000000000000000000000000000000000000000",
                        underwriterRiskRating: new BigNumber(0),
                        amortizationUnit: "hours",
                        interestRate: new BigNumber(3.12),
                        principalAmount: new BigNumber(100),
                        principalTokenSymbol: "REP",
                        termLength: new BigNumber(6),
                        issuanceHash:
                            "0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf",
                        repaidAmount: new BigNumber(4),
                        repaymentSchedule: [1553557371],
                        status: "active",
                        json:
                            '{"principalToken":"0x9b62bd396837417ce319e2e5c8845a5a960010ea","principalAmount":"10","termsContract":"0x1c907384489d939400fa5c6571d8aad778213d74","termsContractParameters":"0x0000000000000000000000000000008500000000000000000000000000000064","kernelVersion":"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f","issuanceVersion":"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de","debtor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","debtorFee":"0","creditor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","creditorFee":"0","relayer":"0x0000000000000000000000000000000000000000","relayerFee":"0","underwriter":"0x0000000000000000000000000000000000000000","underwriterFee":"0","underwriterRiskRating":"0","expirationTimestampInSec":"1524613355","salt":"0","debtorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"creditorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"underwriterSignature":{"r":"","s":"","v":0}}',
                        creditor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        description: "Hello, Can I borrow some REP please?",
                        fillLoanShortUrl: "http://bit.ly/2I4bahM",
                    },
                ],
            };
            const wrapper = shallow(<Debts {...props} />);
            const expectedState = determineExpectedState(props.debtOrders);
            expect(wrapper.state()).toEqual(expectedState);
        });

        it("add debtOrder to inactiveDebtOrders when status is inactive", () => {
            const props = {
                debtOrders: [
                    {
                        debtor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        termsContract: "0x1c907384489d939400fa5c6571d8aad778213d74",
                        termsContractParameters:
                            "0x0000000000000000000000000000008500000000000000000000000000000064",
                        underwriter: "0x0000000000000000000000000000000000000000",
                        underwriterRiskRating: new BigNumber(0),
                        amortizationUnit: "hours",
                        interestRate: new BigNumber(3.12),
                        principalAmount: new BigNumber(100),
                        principalTokenSymbol: "REP",
                        termLength: new BigNumber(6),
                        issuanceHash:
                            "0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf",
                        repaidAmount: new BigNumber(4),
                        repaymentSchedule: [1553557371],
                        status: "inactive",
                        json:
                            '{"principalToken":"0x9b62bd396837417ce319e2e5c8845a5a960010ea","principalAmount":"10","termsContract":"0x1c907384489d939400fa5c6571d8aad778213d74","termsContractParameters":"0x0000000000000000000000000000008500000000000000000000000000000064","kernelVersion":"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f","issuanceVersion":"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de","debtor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","debtorFee":"0","creditor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","creditorFee":"0","relayer":"0x0000000000000000000000000000000000000000","relayerFee":"0","underwriter":"0x0000000000000000000000000000000000000000","underwriterFee":"0","underwriterRiskRating":"0","expirationTimestampInSec":"1524613355","salt":"0","debtorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"creditorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"underwriterSignature":{"r":"","s":"","v":0}}',
                        creditor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        description: "Hello, Can I borrow some REP please?",
                        fillLoanShortUrl: "http://bit.ly/2I4bahM",
                    },
                ],
            };
            const wrapper = shallow(<Debts {...props} />);
            const expectedState = determineExpectedState(props.debtOrders);
            expect(wrapper.state()).toEqual(expectedState);
        });

        it("add debtOrder to activeDebtOrders when status is pending", () => {
            const props = {
                debtOrders: [
                    {
                        debtor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        termsContract: "0x1c907384489d939400fa5c6571d8aad778213d74",
                        termsContractParameters:
                            "0x0000000000000000000000000000008500000000000000000000000000000064",
                        underwriter: "0x0000000000000000000000000000000000000000",
                        underwriterRiskRating: new BigNumber(0),
                        amortizationUnit: "hours",
                        interestRate: new BigNumber(3.12),
                        principalAmount: new BigNumber(100),
                        principalTokenSymbol: "REP",
                        termLength: new BigNumber(6),
                        issuanceHash:
                            "0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf",
                        repaidAmount: new BigNumber(4),
                        repaymentSchedule: [1553557371],
                        status: "pending",
                        json:
                            '{"principalToken":"0x9b62bd396837417ce319e2e5c8845a5a960010ea","principalAmount":"10","termsContract":"0x1c907384489d939400fa5c6571d8aad778213d74","termsContractParameters":"0x0000000000000000000000000000008500000000000000000000000000000064","kernelVersion":"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f","issuanceVersion":"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de","debtor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","debtorFee":"0","creditor":"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935","creditorFee":"0","relayer":"0x0000000000000000000000000000000000000000","relayerFee":"0","underwriter":"0x0000000000000000000000000000000000000000","underwriterFee":"0","underwriterRiskRating":"0","expirationTimestampInSec":"1524613355","salt":"0","debtorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"creditorSignature":{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"},"underwriterSignature":{"r":"","s":"","v":0}}',
                        creditor: "0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935",
                        description: "Hello, Can I borrow some REP please?",
                        fillLoanShortUrl: "http://bit.ly/2I4bahM",
                    },
                ],
            };
            const wrapper = shallow(<Debts {...props} />);
            const expectedState = determineExpectedState(props.debtOrders);
            expect(wrapper.state()).toEqual(expectedState);
        });
    });
});
