import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Debts } from '../../../../../src/modules/Dashboard/Debts/Debts';
import { Header, MainWrapper } from '../../../../../src/components';
import { DebtsMetricsContainer } from '../../../../../src/modules/Dashboard/Debts/DebtsMetrics/DebtsMetricsContainer';
import { ActiveDebtOrder } from '../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder';
import { DebtOrderHistory } from '../../../../../src/modules/Dashboard/Debts/DebtOrderHistory';
import Dharma from '@dharmaprotocol/dharma.js';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';

describe('<Debts />', () => {
	describe('#render', () => {
		let wrapper;
		let dharma;
		let props;

		beforeEach(() => {
			dharma = new MockDharma();
			props = {
				dharma,
				debtOrders: []
			};
			wrapper = shallow(<Debts {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		it('should render a <Header />', () => {
			expect(wrapper.find(MainWrapper).find(Header).length).toEqual(1);
		});

		it('should render a <DebtsMetricsContainer />', () => {
			expect(wrapper.find(MainWrapper).find(DebtsMetricsContainer).length).toEqual(1);
		});

		it('should render 0 <ActiveDebtOrder />', () => {
			expect(wrapper.find(MainWrapper).find(ActiveDebtOrder).length).toEqual(0);
		});

		it('should render a <DebtOrderHistory />', () => {
			expect(wrapper.find(MainWrapper).find(DebtOrderHistory).length).toEqual(1);
		});
	});

	describe('#componentDidMount', async () => {
		it('should call getDebtOrdersDetails', async () => {
			const spy = jest.spyOn(Debts.prototype, 'getDebtOrdersDetails');
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: []
			};
			const wrapper = shallow(<Debts {... props} />);
			await expect(spy.mock.calls.length).toEqual(1);
		});
	});

	describe('#componentWillReceiveProps', async () => {
		it('should not call getDebtOrderDetails when dharma and debtOrders are null', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: []
			};
			const wrapper = shallow(<Debts {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'getDebtOrdersDetails');
			wrapper.setProps({ dharma: null, debtOrders: null });
			await expect(spy).not.toHaveBeenCalledWith(null, null);
		});

		it('should call getDebtOrderDetails when dharma and debtOrders are avail', async () => {
			const props = {
				dharma: null,
				debtOrders: null
			};
			const wrapper = shallow(<Debts {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'getDebtOrdersDetails');
			const dharma = new MockDharma();
			const debtOrders = [
				{
					debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(345),
					principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					principalTokenSymbol: 'MKR',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: 'active',
					fillLoanShortUrl: 'http://bit.ly/2DtiZKW'
				}
			];
			wrapper.setProps({ dharma: dharma, debtOrders: debtOrders });
			await expect(spy).toHaveBeenCalledWith(dharma, debtOrders);
		});


	});

	describe('#getDebtOrderDetails', async () => {
		let determineExpectedState = async (dharma, debtOrders) => {
			const allDebtOrders = [];
			const activeDebtOrders = [];
			const inactiveDebtOrders = [];
			for (let debtOrder of debtOrders) {
				try {
					const dharmaDebtOrder = {
						principalAmount: debtOrder.principalAmount,
						principalToken: debtOrder.principalToken,
						termsContract: debtOrder.termsContract,
						termsContractParameters: debtOrder.termsContractParameters
					};

					const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
					const debtOrderMoreDetail = {
						...debtOrder,
						termLength: fromDebtOrder.termLength,
						amortizationUnit: fromDebtOrder.amortizationUnit,
						interestRate: fromDebtOrder.interestRate,
						repaidAmount: new BigNumber(0),
						status: ''
					};

					try {
						const repaidAmount = await dharma.servicing.getValueRepaid(debtOrder.issuanceHash);
						debtOrderMoreDetail.repaidAmount = repaidAmount;
						debtOrderMoreDetail.status = repaidAmount.lt(debtOrder.principalAmount) ? 'active' : 'inactive';
						if (debtOrderMoreDetail.status === 'active') {
							activeDebtOrders.push(debtOrderMoreDetail);
						} else {
							inactiveDebtOrders.push(debtOrderMoreDetail);
						}
						allDebtOrders.push(debtOrderMoreDetail);
					} catch (ex) {
						debtOrderMoreDetail.status = 'pending';
						activeDebtOrders.push(debtOrderMoreDetail);
						allDebtOrders.push(debtOrderMoreDetail);
					}
				} catch (e) {
					// console.log(e);
				}
			}
			const expectedState = {
				allDebtOrders,
				activeDebtOrders,
				inactiveDebtOrders
			};
			return expectedState;
		};
		it('returns without setting state if debtOrders is empty', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: []
			};
			const wrapper = shallow(<Debts {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'setState');

			wrapper.instance().getDebtOrdersDetails(dharma, []);
			await expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});

		it('status is active when the repaidAmount is less than principalAmount', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: [
					{
						debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
						debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
						principalAmount: new BigNumber(345),
						principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						principalTokenSymbol: 'MKR',
						termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
						termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
						description: 'Hello, Can I borrow some MKR please?',
						issuanceHash: 'active',
						fillLoanShortUrl: 'http://bit.ly/2DtiZKW'
					}
				]
			};
			const wrapper = shallow(<Debts {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.debtOrders);
			await expect(wrapper.state()).toEqual(expectedState);
		});

		it('status is inactive when the repaidAmount is greater than or equal to principalAmount', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: [
					{
						debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
						debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
						principalAmount: new BigNumber(345),
						principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						principalTokenSymbol: 'MKR',
						termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
						termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
						description: 'Hello, Can I borrow some MKR please?',
						issuanceHash: 'inactive',
						fillLoanShortUrl: 'http://bit.ly/2DtiZKW'
					}
				]
			};
			const wrapper = shallow(<Debts {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.debtOrders);
			await expect(wrapper.state()).toEqual(expectedState);
		});

		it('status is pending when unable to determine the repaidValue', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				debtOrders: [
					{
						debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
						debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
						principalAmount: new BigNumber(345),
						principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
						principalTokenSymbol: 'MKR',
						termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
						termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
						description: 'Hello, Can I borrow some MKR please?',
						issuanceHash: 'pending',
						fillLoanShortUrl: 'http://bit.ly/2DtiZKW'
					}
				]
			};
			const wrapper = shallow(<Debts {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.debtOrders);
			await expect(wrapper.state()).toEqual(expectedState);
		});
	});
});
