import * as React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { setError } from '../../../../src/components/Error/actions';
import { Error } from '../../../../src/components/Error/Error';
import { ErrorContainer } from '../../../../src/components/Error/ErrorContainer';
import { StyledAlert } from '../../../../src/components/Error/styledComponents';

describe('<Error />', () => {
	let wrapper;
	const props = {
		errorMessage: 'Some error message',
		handleSetError: jest.fn()
	};

	beforeAll(() => {
		wrapper = shallow(<Error {... props} />);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should have a <StyledAlert /> component', () => {
		expect(wrapper.find(StyledAlert).length).toEqual(1);
	});

	it('<StyledAlert /> should have the correct content', () => {
		expect(wrapper.find(StyledAlert).get(0).props.children).toBe(props.errorMessage);
	});

	it('<StyledAlert /> `isOpen` is false when `visible` is false', () => {
		wrapper.setState({ visible: false });
		expect(wrapper.find(StyledAlert).prop('isOpen')).toBe(wrapper.state('visible'));
	});
});

describe('<ErrorContainer />', () => {
	const initialState = { errorMessage: 'Some error message' };
	const mockStore = configureStore();
	let store, wrapper;

	beforeEach(() => {
		store = mockStore(initialState);
		wrapper = shallow(<Provider store={store}><ErrorContainer /></Provider>);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render the connected smart component', () => {
		expect(wrapper.find(ErrorContainer).length).toEqual(1);
	});

	it('should dispatch an action', () => {
		store.dispatch(setError('Some error message'));
		const actions = store.getActions();
		const expectedPayload = {type: 'SET_ERROR', errorMessage: 'Some error message'};
		expect(actions[0]).toEqual(expectedPayload);
	});
});

describe('<Error /> componentWillReceiveProps', () => {
	let wrapper;
	it('should render the component', () => {
		const props = {
			errorMessage: 'Some error message',
			handleSetError: jest.fn()
		};
		wrapper = mount(<Error {... props} />);
		expect(wrapper.length).toEqual(1);
	});

	it('set visible to true if there is errorMessage', () => {
		const spy = jest.spyOn(Error.prototype, 'setState');
		const props = {
			errorMessage: '',
			handleSetError: jest.fn()
		};
		wrapper = mount(<Error {... props} />);
		wrapper.setProps({ errorMessage: 'Some error' });
		expect(spy).toHaveBeenCalledWith({visible: true});
	});

	it('should not set visible to true if there is no errorMessage', () => {
		const spy = jest.spyOn(Error.prototype, 'setState');
		const props = {
			errorMessage: '',
			handleSetError: jest.fn()
		};
		wrapper = mount(<Error {... props} />);
		wrapper.setProps({ errorMessage: '' });
		expect(spy).not.toHaveBeenCalledWith();
	});

});

describe('<Error /> onDismiss()', () => {
	let wrapper;

  it('set visible to false onDismiss()', () => {
		const spy = jest.spyOn(Error.prototype, 'setState');
		const props = {
			errorMessage: '',
			handleSetError: jest.fn()
		};
		wrapper = mount(<Error {... props} />);
    wrapper.instance().onDismiss();
		expect(spy).toHaveBeenCalledWith({visible: false});
  });

  it('calls props handleSetError onDismiss()', () => {
		const props = {
			errorMessage: '',
			handleSetError: jest.fn()
		};
		wrapper = mount(<Error {... props} />);
    wrapper.instance().onDismiss();
		expect(props.handleSetError).toHaveBeenCalledWith('');
  });
});
