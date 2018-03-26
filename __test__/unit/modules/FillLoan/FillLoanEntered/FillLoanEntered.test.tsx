import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { FillLoanEntered } from '../../../../../src/modules/FillLoan/FillLoanEntered/FillLoanEntered';
import { FillLoanEnteredContainer } from '../../../../../src/modules/FillLoan/FillLoanEntered/FillLoanEnteredContainer';
import { PaperLayout } from '../../../../../src/layouts';
import {
	Header,
	ConfirmationModal,
	MainWrapper
} from '../../../../../src/components';
import { Col } from 'reactstrap';
import { SuccessModal } from '../../../../../src/modules/FillLoan/FillLoanEntered/SuccessModal';
import {
	LoanInfoContainer,
	HalfCol,
	InfoItem,
	Title,
	Content,
	ButtonContainer,
	DeclineButton,
	FillLoanButton
} from '../../../../../src/modules/FillLoan/FillLoanEntered/styledComponents';
import MockWeb3 from '../../../../../__mocks__/web3';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
import { Link, browserHistory } from 'react-router';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fillDebtOrder } from '../../../../../src/modules/FillLoan/FillLoanEntered/actions';
import { DebtKernel } from '@dharmaprotocol/contracts';
import { debtOrderFromJSON } from '../../../../../src/utils';
const compact = require('lodash.compact');
const ABIDecoder = require('abi-decoder');
ABIDecoder.addABI(DebtKernel.abi);

describe('<FillLoanEntered />', () => {
	let web3;
	let dharma;
	let props;
	let query;
	beforeEach(() => {
		web3 = new MockWeb3();
		dharma = new MockDharma();
		query = {
			principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
			principalAmount: 10,
			termsContract: '0x1c907384489d939400fa5c6571d8aad778213d74',
			termsContractParameters: '0x0000000000000000000000000000008500000000000000000000000000000064',
			kernelVersion: '0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f',
			issuanceVersion: '0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de',
			debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
			debtorFee: 0,
			creditor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
			creditorFee: 0,
			relayer: '0x0000000000000000000000000000000000000000',
			relayerFee: 0,
			underwriter: '0x0000000000000000000000000000000000000000',
			underwriterFee: 0,
			underwriterRiskRating: 0,
			expirationTimestampInSec: 1524613355,
			salt: 0,
			debtorSignature: '{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"}',
			creditorSignature: '{"v":27,"r":"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d","s":"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788"}',
			underwriterSignature: '{"r":"","s":"","v":0}',
			description: 'Hello, Can I borrow some MKR please?',
			principalTokenSymbol: 'MKR'
		};

		props = {
			location: {
				query
			},
			web3,
			accounts: ['0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935'],
			dharma,
			tokens: [],
			handleSetError: jest.fn(),
			handleFillDebtOrder: jest.fn()
		};
	});

	describe('#render', () => {
		let wrapper;
		beforeEach(() => {
			wrapper = shallow(<FillLoanEntered {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		it('should render a <Header />', () => {
			expect(wrapper.find(PaperLayout).find(MainWrapper).find(Header).length).toEqual(1);
		});

		describe('<LoanInfoContainer />', () => {
			let loanInfoContainer;
			beforeEach(() => {
				loanInfoContainer = wrapper.find(PaperLayout).find(MainWrapper).find(LoanInfoContainer);
			});

			it('should render', () => {
				expect(loanInfoContainer.length).toEqual(1);
			});

			it('should render 2 <HalfCol />', () => {
				expect(loanInfoContainer.find(HalfCol).length).toEqual(2);
			});

			describe('1st <HalfCol />', () => {
				let firstHalfCol;
				beforeEach(() => {
					firstHalfCol = loanInfoContainer.find(HalfCol).first();
				});

				it('should render 2 <InfoItem />', () => {
					expect(firstHalfCol.find(InfoItem).length).toEqual(2);
				});

				it('1st <InfoItem /> should render Principal info', () => {
					expect(firstHalfCol.find(InfoItem).first().find(Title).get(0).props.children).toEqual('Principal');
				});

				it('2nd <InfoItem /> should render Term Length info', () => {
					expect(firstHalfCol.find(InfoItem).last().find(Title).get(0).props.children).toEqual('Term Length');
				});
			});

			describe('2nd <HalfCol />', () => {
				let lastHalfCol;
				beforeEach(() => {
					lastHalfCol = loanInfoContainer.find(HalfCol).last();
				});

				it('should render 2 <InfoItem />', () => {
					expect(lastHalfCol.find(InfoItem).length).toEqual(2);
				});

				it('1st <InfoItem /> should render Interest Rate info', () => {
					expect(lastHalfCol.find(InfoItem).first().find(Title).get(0).props.children).toEqual('Interest Rate');
				});

				it('2nd <InfoItem /> should render Installment Frequency info', () => {
					expect(lastHalfCol.find(InfoItem).last().find(Title).get(0).props.children).toEqual('Installment Frequency');
				});
			});

			it('should render Description info', () => {
				expect(loanInfoContainer.find(InfoItem).last().find(Title).get(0).props.children).toEqual('Description');
			});
		});

		describe('<ButtonContainer />', () => {
			let buttonContainer;
			beforeEach(() => {
				buttonContainer = wrapper.find(PaperLayout).find(MainWrapper).find(ButtonContainer);
			});

			it('should render', () => {
				expect(buttonContainer.length).toEqual(1);
			});

			it('should render a <Link />', () => {
				expect(buttonContainer.find(Link).length).toEqual(1);
				expect(buttonContainer.find(Link).prop('to')).toEqual('/fill');
			});

			it('should render a <DeclineButton />', () => {
				expect(buttonContainer.find(Link).find(DeclineButton).length).toEqual(1);
			});

			it('should render a <FillLoanButton />', () => {
				expect(buttonContainer.find(FillLoanButton).length).toEqual(1);
			});
		});

		it('should render a <ConfirmationModal />', () => {
			expect(wrapper.find(PaperLayout).find(MainWrapper).find(ConfirmationModal).length).toEqual(1);
		});

		it('should render a <SuccessModal />', () => {
			expect(wrapper.find(PaperLayout).find(MainWrapper).find(SuccessModal).length).toEqual(1);
		});
	});

	describe('#componentDidMount', async () => {
		it('should call getDebtOrderDetail', async () => {
			const spy = jest.spyOn(FillLoanEntered.prototype, 'getDebtOrderDetail');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			await expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should not call getDebtOrderDetail when there is no dharma and no location.query', async () => {
			props.dharma = null;
			props.location.query = null;
			const spy = jest.spyOn(FillLoanEntered.prototype, 'getDebtOrderDetail');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});
	});

	describe('#componentWillReceiveProps', async () => {
		it('should call getDebtOrderDetail', async () => {
			props.location.query = null;
			props.dharma = null;
			const spy = jest.spyOn(FillLoanEntered.prototype, 'getDebtOrderDetail');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			props.location.query = query;
			props.dharma = dharma;
			wrapper.setProps(props);
			expect(spy).toHaveBeenCalledWith(props.dharma, props.location.query);
			spy.mockRestore();
		});

		it('should not call getDebtOrderDetail when there is no dharma and no location.query', async () => {
			props.location.query = null;
			props.dharma = null;
			const spy = jest.spyOn(FillLoanEntered.prototype, 'getDebtOrderDetail');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			props.dharma = null;
			props.location.query = null;
			wrapper.setProps(props);
			expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});
	});

	describe('#confirmationModalToggle', () => {
		it('should call setState', () => {
			const spy = jest.spyOn(FillLoanEntered.prototype, 'setState');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const confirmationModal = wrapper.state('confirmationModal');
			wrapper.instance().confirmationModalToggle();
			expect(spy).toHaveBeenCalledWith({ confirmationModal: !confirmationModal });
			spy.mockRestore();
		});
	});

	describe('#successModalToggle', () => {
		it('should call setState', () => {
			const spy = jest.spyOn(FillLoanEntered.prototype, 'setState');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const successModal = wrapper.state('successModal');
			wrapper.instance().successModalToggle();
			expect(spy).toHaveBeenCalledWith({ confirmationModal: false, successModal: !successModal });
			spy.mockRestore();
		});
	});

	describe('#getDebtOrderDetail', () => {
		it('calls setState', async () => {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'setState');
			await wrapper.instance().getDebtOrderDetail(props.dharma, props.location.query);
			await expect(spy).toHaveBeenCalled();
			const expectedDebtOrder = debtOrderFromJSON(JSON.stringify(props.location.query));
			const expectedDescription = expectedDebtOrder.description;
			const expectedPrincipalTokenSymbol = expectedDebtOrder.principalTokenSymbol;
			delete(expectedDebtOrder.description);
			delete(expectedDebtOrder.principalTokenSymbol);
			expect(wrapper.state('debtOrder')).toEqual(expectedDebtOrder);
			expect(wrapper.state('description')).toEqual(expectedDescription);
			expect(wrapper.state('principalTokenSymbol')).toEqual(expectedPrincipalTokenSymbol);
			spy.mockRestore();
		});

		it('calls Dharma#fromDebtOrder', async() {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const expectedDebtOrder = debtOrderFromJSON(JSON.stringify(props.location.query));
			delete(expectedDebtOrder.description);
			delete(expectedDebtOrder.principalTokenSymbol);
			await wrapper.instance().getDebtOrderDetail(props.dharma, props.location.query);
			await expect(dharma.adapters.simpleInterestLoan.fromDebtOrder).toHaveBeenCalledWith(expectedDebtOrder);
		});

		it('calls Dharma#getIssuanceHash', async() {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const expectedDebtOrder = debtOrderFromJSON(JSON.stringify(props.location.query));
			delete(expectedDebtOrder.description);
			delete(expectedDebtOrder.principalTokenSymbol);
			await wrapper.instance().getDebtOrderDetail(props.dharma, props.location.query);
			await expect(dharma.order.getIssuanceHash).toHaveBeenCalledWith(expectedDebtOrder);
		});

		describe('no termsContract or no termsContractParameters', () => {
			it('should not call Dharma#fromDebtOrder', async () => {
				dharma.adapters.simpleInterestLoan.fromDebtOrder.mockRestore();
				dharma.adapters.simpleInterestLoan.fromDebtOrder.mockReset();
				const _props = Object.assign({}, props);
				_props.location.query.termsContract = null;
				_props.location.query.termsContractParameters = null;
				const wrapper = shallow(<FillLoanEntered {... _props} />);
				await wrapper.instance().getDebtOrderDetail(_props.dharma, _props.location.query);
				await expect(dharma.adapters.simpleInterestLoan.fromDebtOrder).not.toHaveBeenCalled();
			});
		});
	});

	describe('#handleFillOrder', () => {
		describe('no error', () => {
			let debtOrder;
			beforeEach(() => {
				debtOrder = debtOrderFromJSON(JSON.stringify(props.location.query));
				delete(debtOrder.description);
				delete(debtOrder.principalTokenSymbol);
				ABIDecoder.decodeLogs = jest.fn((logs) => [{name: 'LogDebtOrderFilled'}]);
			});

			afterEach(() => {
				ABIDecoder.decodeLogs.mockRestore();
			});

			it('should call props handleSetError', async () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(props.handleSetError).toHaveBeenCalledWith('');
			});

			it('calls Dharma#fillAsync', async () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(dharma.order.fillAsync).toHaveBeenCalledWith(debtOrder, {from: props.accounts[0]});
			});

			it('calls Dharma#awaitTransactionMinedAsync', async () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				const expectedTxHash = await dharma.order.fillAsync(debtOrder);
				await expect(dharma.blockchain.awaitTransactionMinedAsync).toHaveBeenCalledWith(expectedTxHash, 1000, 10000);
			});

			it('calls Dharma#getErrorLogs', async () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				const expectedTxHash = await dharma.order.fillAsync(debtOrder);
				const expectedErrorLogs = await dharma.blockchain.getErrorLogs(expectedTxHash);
				await expect(dharma.blockchain.getErrorLogs).toHaveBeenCalledWith(expectedTxHash);
			});

			it('calls ABIDecoder.decodeLogs', async () => {
				const spy = jest.spyOn(ABIDecoder, 'decodeLogs');
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(spy).toHaveBeenCalled();
				await expect(ABIDecoder.decodeLogs).toHaveBeenCalled();
			});

			it('calls props handleFillDebtOrder', async () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(props.handleFillDebtOrder).toHaveBeenCalled();
			});

			it('calls successModalToggle', async () => {
				const spy = jest.spyOn(FillLoanEntered.prototype, 'successModalToggle');
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(spy).toHaveBeenCalled();
			});
		});

		describe('#ABIDecoder.decodeLogs does\'t return LogDebtOrderFilled event', () => {
			it('should call props.handleSetError', async () => {
				ABIDecoder.decodeLogs = jest.fn((logs) => [{name: ''}]);
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(props.handleSetError).toHaveBeenCalled();
				ABIDecoder.decodeLogs.mockRestore();
			});
		});

		describe('#getErrorLogs has error', () => {
			it('should call props.handleSetError', async () => {
				dharma.blockchain.getErrorLogs = jest.fn( async(txHash) => ['Some error message']);
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(props.handleSetError).toHaveBeenCalled();
				await expect(props.handleFillDebtOrder).not.toHaveBeenCalled();
				dharma.blockchain.getErrorLogs.mockRestore();
			});
		});

		describe('#throw error', () => {
			it('should call props.handleSetError', async () => {
				dharma.order.fillAsync = jest.fn( async(debtOrder, txData) => throw new Error('error'); );
				const wrapper = shallow(<FillLoanEntered {... props} />);
				await wrapper.instance().handleFillOrder();
				await expect(props.handleSetError).toHaveBeenCalled();
				dharma.order.fillAsync.mockRestore();
			});
		});
	});

	describe('#handleRedirect', () => {
		it('should call browserHistory', () => {
			const spy = jest.spyOn(browserHistory, 'push');
			const wrapper = shallow(<FillLoanEntered {... props} />);
			wrapper.instance().handleRedirect();
			expect(spy).toHaveBeenCalledWith('/dashboard');
		});
	});

	describe('#validateFillOrder', () => {
		it('should call clear error', () => {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			wrapper.instance().validateFillOrder();
			expect(props.handleSetError).toHaveBeenCalledWith('');
		});

		describe('no token', () => {
			it('should set error', () => {
				const wrapper = shallow(<FillLoanEntered {... props} />);
				wrapper.instance().validateFillOrder();
				const errorMessage = props.location.query.principalTokenSymbol + ' is currently disabled for trading';
				expect(props.handleSetError).toHaveBeenCalledWith(errorMessage);
			});
		});

		describe('token is not permitted for trading', () => {
			it('should set error', () => {
				props.tokens = [
					{
						address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						tokenSymbol: 'MKR',
						tradingPermitted: false,
						balance: new BigNumber(0)
					}
				];
				const wrapper = shallow(<FillLoanEntered {... props} />);
				wrapper.instance().validateFillOrder();
				const errorMessage = props.location.query.principalTokenSymbol + ' is currently disabled for trading';
				expect(props.handleSetError).toHaveBeenCalledWith(errorMessage);
			});
		});

		describe('token is permitted for trading', () => {
			it('should call confirmationModalToggle', () => {
				props.tokens = [
					{
						address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						tokenSymbol: 'MKR',
						tradingPermitted: true,
						balance: new BigNumber(1000000)
					}
				];
				const wrapper = shallow(<FillLoanEntered {... props} />);
				const spy = jest.spyOn(wrapper.instance(), 'confirmationModalToggle');
				wrapper.instance().validateFillOrder();
				expect(spy).toHaveBeenCalled();
			});
		});

		describe('no token match', () => {
			it('should set error', () => {
				props.tokens = [
					{
						address: '0x00000',
						tokenSymbol: 'REP',
						tradingPermitted: true,
						balance: new BigNumber(1000000)
					}
				];
				const wrapper = shallow(<FillLoanEntered {... props} />);
				wrapper.instance().validateFillOrder();
				const errorMessage = props.location.query.principalTokenSymbol + ' is currently disabled for trading';
				expect(props.handleSetError).toHaveBeenCalledWith(errorMessage);
			});
		});

		describe('no principalAmount', () => {
			it('should set error', () => {
				props.tokens = [
					{
						address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						tokenSymbol: 'MKR',
						tradingPermitted: true,
						balance: new BigNumber(1000000)
					}
				];
				props.location.query.principalAmount = null;
				const wrapper = shallow(<FillLoanEntered {... props} />);
				wrapper.instance().validateFillOrder();
				const errorMessage = 'Invalid debt order';
				expect(props.handleSetError).toHaveBeenCalledWith(errorMessage);
			});
		});
	});
});

describe('<FillLoanEnteredContainer />', () => {
	const initialState = {};
	const mockStore = configureStore();
	let store, wrapper;

	beforeEach(() => {
		store = mockStore(initialState);
		wrapper = shallow(<Provider store={store}><FillLoanEnteredContainer /></Provider>);
	});

	it('should render the component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render the connected smart component', () => {
		expect(wrapper.find(FillLoanEnteredContainer).length).toEqual(1);
	});

	it('should dispatch an action', () => {
		const investment = {
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
		store.dispatch(fillDebtOrder(investment));
		const actions = store.getActions();
		const expectedPayload = {type: 'FILL_DEBT_ORDER', payload: investment};
		expect(actions[0]).toEqual(expectedPayload);
	});
});
