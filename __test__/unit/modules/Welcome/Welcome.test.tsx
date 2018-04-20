import * as React from "react";
import { shallow } from "enzyme";
import { Welcome } from "../../../../src/modules/Welcome/Welcome";
import { MainWrapper, Checkbox } from "../../../../src/components";
import {
    BannerContainer,
    Header,
    Description,
    ButtonContainer,
    NextButton,
} from "../../../../src/modules/Welcome/styledComponents";
import { browserHistory } from "react-router";

describe("<Welcome />", () => {
    describe("#render", () => {
        let wrapper;
        const props = {
            handleSetError: jest.fn(),
            handleAgreeToTerms: jest.fn(),
        };
        beforeEach(() => {
            wrapper = shallow(<Welcome {...props} />);
        });

        it("should render the component", () => {
            expect(wrapper.length).toEqual(1);
        });

        it("should render a <BannerContainer />", () => {
            expect(wrapper.find(Header).length).toEqual(1);
        });

        it("should render a <Header />", () => {
            expect(wrapper.find(MainWrapper).find(Header).length).toEqual(1);
        });

        it("should render a <Description />", () => {
            expect(wrapper.find(MainWrapper).find(Description).length).toEqual(1);
        });

        it("should render a <Checkbox />", () => {
            expect(wrapper.find(MainWrapper).find(Checkbox).length).toEqual(1);
        });

        it("should render a <NextButton />", () => {
            expect(
                wrapper
                    .find(MainWrapper)
                    .find(ButtonContainer)
                    .find(NextButton).length,
            ).toEqual(1);
        });
    });

    describe("#Checkbox", () => {
        it("should update agreeToTermsOfUse when checkbox is toggled", () => {
            const props = {
                handleSetError: jest.fn(),
                handleAgreeToTerms: jest.fn(),
            };
            const spy = jest.spyOn(Welcome.prototype, "setState");
            const wrapper = shallow(<Welcome {...props} />);
            wrapper.find(Checkbox).simulate("change", true);
            expect(spy).toHaveBeenCalledWith({ agreeToTermsOfUse: true });
            wrapper.find(Checkbox).simulate("change", false);
            expect(spy).toHaveBeenCalledWith({ agreeToTermsOfUse: false });
        });
    });

    describe("#NextButton", () => {
        it("should call props handleSetError if checkbox is not checked", () => {
            const props = {
                handleSetError: jest.fn(),
                handleAgreeToTerms: jest.fn(),
            };
            const wrapper = shallow(<Welcome {...props} />);
            wrapper.find(NextButton).simulate("click");
            expect(props.handleSetError.mock.calls.length).toBe(2);
        });

        it("should redirect to request if checkbox is checked", () => {
            const spy = jest.spyOn(browserHistory, "push");
            const props = {
                handleSetError: jest.fn(),
                handleAgreeToTerms: jest.fn(),
            };
            const wrapper = shallow(<Welcome {...props} />);
            wrapper.find(Checkbox).simulate("change", true);
            wrapper.find(NextButton).simulate("click");
            expect(spy).toHaveBeenCalledWith("/request");
        });
    });
});
