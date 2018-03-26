import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Debts } from '../../../../../src/modules/Dashboard/Debts/Debts';
import { Header, MainWrapper } from '../../../../../src/components';
import { DebtsMetricsContainer } from '../../../../../src/modules/Dashboard/Debts/DebtsMetrics/DebtsMetricsContainer';
import { ActiveDebtOrderContainer } from '../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder/ActiveDebtOrderContainer';
import { DebtOrderHistory } from '../../../../../src/modules/Dashboard/Debts/DebtOrderHistory';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
import { debtOrderFromJSON } from '../../../../../src/utils';

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

		it('should render 0 <ActiveDebtOrderContainer />', () => {
			expect(wrapper.find(MainWrapper).find(ActiveDebtOrderContainer).length).toEqual(0);
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
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: 'active',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(4),
					termLength: new BigNumber(100),
					interestRate: new BigNumber(12.3),
					amortizationUnit: 'hours',
					status: 'active'
				}
			];
			wrapper.setProps({ dharma: dharma, debtOrders: debtOrders });
			await expect(spy).toHaveBeenCalledWith(dharma, debtOrders);
		});
	});

	describe('#getDebtOrdersDetails', async () => {
		let determineExpectedState = async (dharma, debtOrders) => {
			const allDebtOrders = [];
			const activeDebtOrders = [];
			const inactiveDebtOrders = [];
			for (let debtOrder of debtOrders) {
				try {
					const debtOrderInfo = debtOrderFromJSON(debtOrder.json);
					const repaidAmount = await dharma.servicing.getValueRepaid(debtOrder.issuanceHash);
					debtOrder.repaidAmount = repaidAmount;
					debtOrder.status = repaidAmount.lt(debtOrderInfo.principalAmount) ? 'active' : 'inactive';
					if (debtOrder.status === 'active') {
						activeDebtOrders.push(debtOrder);
					} else {
						inactiveDebtOrders.push(debtOrder);
					}
					allDebtOrders.push(debtOrder);
				} catch (ex) {
					debtOrder.status = 'pending';
					activeDebtOrders.push(debtOrder);
					allDebtOrders.push(debtOrder);
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
						json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
						principalTokenSymbol: 'REP',
						description: 'Hello, Can I borrow some REP please?',
						issuanceHash: 'active',
						fillLoanShortUrl: 'http://bit.ly/2I4bahM',
						repaidAmount: new BigNumber(4),
						termLength: new BigNumber(100),
						interestRate: new BigNumber(12.3),
						amortizationUnit: 'hours',
						status: 'active'
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
						json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
						principalTokenSymbol: 'REP',
						description: 'Hello, Can I borrow some REP please?',
						issuanceHash: 'inactive',
						fillLoanShortUrl: 'http://bit.ly/2I4bahM',
						repaidAmount: new BigNumber(4),
						termLength: new BigNumber(100),
						interestRate: new BigNumber(12.3),
						amortizationUnit: 'hours',
						status: 'active'
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
						json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
						principalTokenSymbol: 'REP',
						description: 'Hello, Can I borrow some REP please?',
						issuanceHash: 'pending',
						fillLoanShortUrl: 'http://bit.ly/2I4bahM',
						repaidAmount: new BigNumber(4),
						termLength: new BigNumber(100),
						interestRate: new BigNumber(12.3),
						amortizationUnit: 'hours',
						status: 'active'
					}
				]
			};
			const wrapper = shallow(<Debts {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.debtOrders);
			await expect(wrapper.state()).toEqual(expectedState);
		});
	});
});
