import * as React from "react";
import { shallow } from "enzyme";
import { PageLayout } from "../../../../src/layouts/PageLayout";
import TopNavBar from "../../../../src/layouts/TopNavBar";
import LeftNavBar from "../../../../src/layouts/LeftNavBar";
import {
    LeftContainer,
    RightContainer,
    Footer,
    FooterLink,
} from "../../../../src/layouts/PageLayout/styledComponents";

describe("<PageLayout />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<PageLayout />);
    });

    it("should render the component", () => {
        expect(wrapper.length).toEqual(1);
    });

    it("should render a <TopNavBar />", () => {
        expect(wrapper.find(TopNavBar).length).toEqual(1);
    });

    it("should render a <LeftContainer />", () => {
        expect(wrapper.find(LeftContainer).length).toEqual(1);
    });

    it("should render a <LeftNavBar /> inside <LeftContainer />", () => {
        expect(wrapper.find(LeftContainer).find(LeftNavBar).length).toEqual(1);
    });

    it("should render a <RightContainer />", () => {
        expect(wrapper.find(RightContainer).length).toEqual(1);
    });

    it("should render a <Footer /> inside <RightContainer />", () => {
        expect(wrapper.find(RightContainer).find(Footer).length).toEqual(1);
    });

    it("should render 2 <FooterLink /> inside <Footer />", () => {
        expect(
            wrapper
                .find(RightContainer)
                .find(Footer)
                .find(FooterLink).length,
        ).toEqual(2);
    });
});
