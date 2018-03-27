import * as React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RequestLoanFormContainer } from '../../../../src/modules/RequestLoan/RequestLoanForm/RequestLoanFormContainer';
import { userRequestDebtOrder } from '../../../../src/modules/RequestLoan/RequestLoanForm/actions';
import { BigNumber } from 'bignumber.js';

describe('<RequestLoanFormContainer />', () => {
	const initialState = {};
	const mockStore = configureStore();
	let store, wrapper;

	beforeEach(() => {
		store = mockStore(initialState);
		wrapper = shallow(<Provider store={store}><RequestLoanFormContainer /></Provider>);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render the connected smart component', () => {
		expect(wrapper.find(RequestLoanFormContainer).length).toEqual(1);
	});

	it('should dispatch REQUEST_DEBT_ORDER action', () => {
		const debtOrder = {
			json: "{\"principalToken\":\"0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
			principalTokenSymbol: 'MKR',
			description: 'Hello, Can I borrow some MKR please?',
			issuanceHash: 'active',
			fillLoanShortUrl: 'http://bit.ly/2I4bahM',
			repaidAmount: new BigNumber(4),
			termLength: new BigNumber(100),
			interestRate: new BigNumber(12.3),
			amortizationUnit: 'hours',
			status: 'active'
		};
		store.dispatch(userRequestDebtOrder(debtOrder));
		const actions = store.getActions();
		const expectedPayload = {type: 'REQUEST_DEBT_ORDER', payload: debtOrder};
		expect(actions[0]).toEqual(expectedPayload);
	}));
});
