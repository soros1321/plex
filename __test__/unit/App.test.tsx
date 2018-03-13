import * as React from 'react';
import { shallow } from 'enzyme';
import { App } from '../../src/App';

it('renders without crashing', () => {
	const accounts: string[] = [];
	const web3: any = null;
	shallow(<App accounts={accounts} web3={web3} />);
});
