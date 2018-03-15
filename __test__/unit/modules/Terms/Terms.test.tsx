import * as React from 'react';
import { shallow } from 'enzyme';
import { Terms } from '../../../../src/modules/Terms';

describe('<Terms />', () => {
	it('should render the component', () => {
		const wrapper = shallow(<Terms />);
		expect(wrapper.length).toEqual(1);
	});
});
