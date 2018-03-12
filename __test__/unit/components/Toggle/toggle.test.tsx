import * as React from 'react';
import { shallow } from 'enzyme';
import { Toggle } from '../../../../src/components/Toggle';
import { ToggleLabel, ToggleName } from '../../../../src/components/Toggle/styledComponents';
import ReactToggle from 'react-toggle';

describe('Toggle Component (Unit)', () => {
	let wrapper;
	const props = {
		disabled: false,
		name: 'Some Toggle',
		label: 'Some Toggle',
		checked: false,
		onChange: jest.fn()
	};

	beforeAll(() => {
		wrapper = shallow(<Toggle {... props} />);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render a <ReactToggle /> component', () => {
		expect(wrapper.find(ReactToggle).length).toEqual(1);
	});

	it('should render a <ToggleLabel /> component', () => {
		expect(wrapper.find(ToggleLabel).length).toEqual(1);
	});

	it('should render a <ToggleName /> component inside <ToggleLabel />', () => {
		expect(wrapper.find(ToggleLabel).find(ToggleName).length).toEqual(1);
	});

	it('<ToggleName /> should have the correct content', () => {
		expect(wrapper.find(ToggleLabel).find(ToggleName).get(0).props.children).toBe(props.label);
	});

  test('calls onChange prop on click', () => {
    const event = {
      currentTarget: {
        checked: true
      }
    };
    wrapper.instance().handleChange(event);
    expect(props.onChange.mock.calls.length).toBe(1);
  });
});
