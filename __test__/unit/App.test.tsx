import * as React from 'react';
import { shallow } from 'enzyme';
import { App } from 'src/App';
import MockWeb3 from '__mocks__/web3';
jest.mock('react-ga');

it('renders without crashing', () => {
	const props = {
		web3: new MockWeb3(),
		accounts: ['account1']
	};
	shallow(<App {... props} />);
});
