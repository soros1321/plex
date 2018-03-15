import * as React from 'react';
import { shallow } from 'enzyme';
import { IndexLink } from 'react-router';
import LeftNavBar from '../../../../src/layouts/LeftNavBar';
import {
	LogoContainer,
	BrandLogo,
	StyledLink,
	TitleFirst,
	TitleRest
} from '../../../../src/layouts/LeftNavBar/styledComponents';
import { TradingPermissionsContainer } from '../../../../src/components';

describe('<LeftNavBar />', () => {
	let wrapper;
	const props = {
		linkItems: [
			{url: '/someurl', display: 'Some Url'}
		]
	};

	beforeEach(() => {
		wrapper = shallow(<LeftNavBar {... props} />);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render a <LogoContainer />', () => {
		expect(wrapper.find(LogoContainer).length).toEqual(1);
	});

	it('should have an <IndexLink /> to "/"', () => {
		expect(wrapper.find(LogoContainer).find(IndexLink).length).toEqual(1);
		expect(wrapper.find(LogoContainer).find(IndexLink).prop('to')).toEqual('/');
	});

	it('should have a <BrandLogo /> inside <IndexLink />', () => {
		expect(wrapper.find(LogoContainer).find(IndexLink).find(BrandLogo).length).toEqual(1);
	});

	it('should render a <StyledLink />', () => {
		expect(wrapper.find(StyledLink).length).toEqual(1);
	});

	it('should render a <TradingPermissionsContainer /> with class .left', () => {
		expect(wrapper.find(TradingPermissionsContainer).length).toEqual(1);
		expect(wrapper.find(TradingPermissionsContainer).hasClass('left')).toEqual(true);
	});
});

describe('<StyledLink />', () => {
	let wrapper;

	it('should render the correct title', () => {
		let props = {
			linkItems: [
				{url: '/someurl', display: 'Some Url'}
			]
		};
		wrapper = shallow(<LeftNavBar {... props} />);
		expect(wrapper.find(StyledLink).first().find(TitleFirst).get(0).props.children).toEqual('Some');
		expect(wrapper.find(StyledLink).first().find(TitleRest).get(0).props.children).toEqual(' Url');
		props = {
			linkItems: [
				{url: '/someurl', display: 'Title'}
			]
		};
		wrapper = shallow(<LeftNavBar {... props} />);
		expect(wrapper.find(StyledLink).first().find(TitleFirst).get(0).props.children).toEqual('Title');
		expect(wrapper.find(StyledLink).first().find(TitleRest).get(0).props.children).toEqual('');
	});
});
