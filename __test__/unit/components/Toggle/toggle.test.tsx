import * as React from 'react';
import { shallow } from 'enzyme';
import { Toggle } from '../../../../src/components/Toggle';
import ReactToggle from 'react-toggle';

describe('Toggle Component (Unit)', () => {
  test('calls onChange prop on click', () => {
    const props = {
      disabled: false,
      name: 'Some Toggle',
      label: 'Some Toggle',
      checked: false,
      onChange: jest.fn(),
    }

    const toggle = shallow(<Toggle {... props} />);
    const event = {
      currentTarget: {
        checked: true
      }
    }

    toggle.instance().handleChange(event);

    expect(props.onChange.mock.calls.length).toBe(1);
  });
});
