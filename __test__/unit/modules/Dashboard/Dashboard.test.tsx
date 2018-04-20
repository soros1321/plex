import * as React from "react";
import { shallow } from "enzyme";
import { Dashboard } from "src/modules/Dashboard/Dashboard";
import { OpenOrders } from "src/modules/Dashboard/OpenOrders";
import { DebtsContainer } from "src/modules/Dashboard/Debts/DebtsContainer";
import { InvestmentsContainer } from "src/modules/Dashboard/Investments/InvestmentsContainer";
import { Nav, NavLink, TabPane, TabContent } from "reactstrap";
import { StyledNavItem, TitleFirstWord, TitleRest } from "src/modules/Dashboard/styledComponents";
import MockDharma from "__mocks__/dharma.js";

describe("<Dashboard />", () => {
    describe("#render", () => {
        let wrapper;
        const props = {
            dharma: new MockDharma(),
            accounts: [],
            filledDebtOrders: [],
            pendingDebtOrders: [],
            handleSetError: jest.fn(),
            handleSetFilledDebtOrders: jest.fn(),
            handleFilledDebtOrder: jest.fn(),
        };
        beforeEach(() => {
            wrapper = shallow(<Dashboard {...props} />);
        });

        it("should render the component", () => {
            expect(wrapper.length).toEqual(1);
        });

        it("should render 3 <StyledNavItem />", () => {
            expect(wrapper.find(Nav).find(StyledNavItem).length).toEqual(3);
        });

        it("should render the correct title", () => {
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(0)
                    .find(TitleFirstWord)
                    .get(0).props.children,
            ).toEqual("");
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(0)
                    .find(TitleRest)
                    .get(0).props.children,
            ).toEqual("Open Orders (0)");
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(1)
                    .find(TitleFirstWord)
                    .get(0).props.children,
            ).toEqual("Your ");
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(1)
                    .find(TitleRest)
                    .get(0).props.children,
            ).toEqual("Debts (0)");
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(2)
                    .find(TitleFirstWord)
                    .get(0).props.children,
            ).toEqual("Your ");
            expect(
                wrapper
                    .find(Nav)
                    .find(StyledNavItem)
                    .at(2)
                    .find(TitleRest)
                    .get(0).props.children,
            ).toEqual("Investments (0)");
        });

        it("should render a <TabContent />", () => {
            expect(wrapper.find(TabContent).length).toEqual(1);
        });

        it("should render 3 <TabPane />", () => {
            expect(wrapper.find(TabContent).find(TabPane).length).toEqual(3);
        });

        it("should render a <OpenOrdersContainer />", () => {
            expect(
                wrapper
                    .find(TabContent)
                    .find(TabPane)
                    .at(0)
                    .find(OpenOrders).length,
            ).toEqual(1);
        });

        it("should render a <DebtsContainer />", () => {
            expect(
                wrapper
                    .find(TabContent)
                    .find(TabPane)
                    .at(1)
                    .find(DebtsContainer).length,
            ).toEqual(1);
        });

        it("should render an <InvestmentsContainer />", () => {
            expect(
                wrapper
                    .find(TabContent)
                    .find(TabPane)
                    .at(2)
                    .find(InvestmentsContainer).length,
            ).toEqual(1);
        });
    });

    describe("#toggle", () => {
        it("should call toggle when <NavLink /> is clicked", () => {
            const props = {
                dharma: new MockDharma(),
                accounts: [],
                filledDebtOrders: [],
                pendingDebtOrders: [],
                handleSetError: jest.fn(),
                handleSetFilledDebtOrders: jest.fn(),
                handleFilledDebtOrder: jest.fn(),
            };
            const spy = jest.spyOn(Dashboard.prototype, "toggle");
            const wrapper = shallow(<Dashboard {...props} />);
            wrapper
                .find(NavLink)
                .at(0)
                .simulate("click");
            expect(spy).toHaveBeenCalledWith("1");
            wrapper
                .find(NavLink)
                .at(1)
                .simulate("click");
            expect(spy).toHaveBeenCalledWith("2");
            wrapper
                .find(NavLink)
                .at(2)
                .simulate("click");
            expect(spy).toHaveBeenCalledWith("3");
        });

        it("toggle should call set the correct state", () => {
            const props = {
                dharma: new MockDharma(),
                accounts: [],
                filledDebtOrders: [],
                pendingDebtOrders: [],
                handleSetError: jest.fn(),
                handleSetFilledDebtOrders: jest.fn(),
                handleFilledDebtOrder: jest.fn(),
            };
            const spy = jest.spyOn(Dashboard.prototype, "setState");
            const wrapper = shallow(<Dashboard {...props} />);
            wrapper
                .find(NavLink)
                .at(0)
                .simulate("click");
            expect(spy).not.toHaveBeenCalled();
            wrapper
                .find(NavLink)
                .at(1)
                .simulate("click");
            expect(spy).toHaveBeenCalledWith({ activeTab: "2" });
            wrapper
                .find(NavLink)
                .at(2)
                .simulate("click");
            expect(spy).toHaveBeenCalledWith({ activeTab: "3" });
        });
    });
});
