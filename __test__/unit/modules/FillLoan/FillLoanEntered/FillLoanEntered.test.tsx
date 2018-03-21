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
import { Link } from 'react-router';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fillDebtOrder } from '../../../../../src/modules/FillLoan/FillLoanEntered/actions';

describe('<FillLoanEntered />', () => {
	let web3;
	let dharma;
	let props;
	beforeEach(() => {
		web3 = new MockWeb3();
		dharma = new MockDharma();
		props = {
			location: {
				query: {
					principalAmount: 345,
					principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					debtorSignature: '{"v": 27,"r": "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a","s": "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					description: 'Hello, Can I borrow some MKR please?',
					principalTokenSymbol: 'MKR'
				}
			},
			web3,
			accounts: [],
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
			props.location.query = {
				principalAmount: 345,
				principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
				termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
				termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
				debtorSignature: '{"v": 27,"r": "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a","s": "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
				debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
				description: 'Hello, Can I borrow some MKR please?',
				principalTokenSymbol: 'MKR'
			};
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
			const expectedDebtOrderWithDescription = {
				...props.location.query,
				principalAmount: new BigNumber(props.location.query.principalAmount),
				debtorSignature: JSON.parse(props.location.query.debtorSignature)
			};
			delete(expectedDebtOrderWithDescription.principalTokenSymbol);
			expect(wrapper.state('debtOrderWithDescription')).toEqual(expectedDebtOrderWithDescription);
			expect(wrapper.state('principalTokenSymbol')).toEqual(props.location.query.principalTokenSymbol);
			spy.mockRestore();
		});

		it('calls Dharma#fromDebtOrder', async() {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const debtOrderWithDescription = {
				...props.location.query,
				principalAmount: new BigNumber(props.location.query.principalAmount),
				debtorSignature: JSON.parse(props.location.query.debtorSignature)
			};
			delete(debtOrderWithDescription.principalTokenSymbol);
			await wrapper.instance().getDebtOrderDetail(props.dharma, props.location.query);
			await expect(dharma.adapters.simpleInterestLoan.fromDebtOrder).toHaveBeenCalledWith(debtOrderWithDescription);
		});

		it('calls Dharma#getIssuanceHash', async() {
			const wrapper = shallow(<FillLoanEntered {... props} />);
			const debtOrderWithDescription = {
				...props.location.query,
				principalAmount: new BigNumber(props.location.query.principalAmount),
				debtorSignature: JSON.parse(props.location.query.debtorSignature)
			};
			delete(debtOrderWithDescription.principalTokenSymbol);
			await wrapper.instance().getDebtOrderDetail(props.dharma, props.location.query);
			await expect(dharma.order.getIssuanceHash).toHaveBeenCalledWith(debtOrderWithDescription);
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
			debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
			debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
			creditorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
			creditor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
			principalAmount: new BigNumber(345),
			principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
			principalTokenSymbol: 'MKR',
			termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
			termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
			description: 'Hello, Can I borrow some MKR please?',
			issuanceHash: 'active'
		};
		store.dispatch(fillDebtOrder(investment));
		const actions = store.getActions();
		const expectedPayload = {type: 'FILL_DEBT_ORDER', payload: investment};
		expect(actions[0]).toEqual(expectedPayload);
	});
});
