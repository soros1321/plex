import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Investments } from '../../../../../src/modules/Dashboard/Investments/Investments';
import { Header, MainWrapper } from '../../../../../src/components';
import { InvestmentsMetricsContainer } from '../../../../../src/modules/Dashboard/Investments/InvestmentsMetrics/InvestmentsMetricsContainer';
import { ActiveInvestmentContainer } from '../../../../../src/modules/Dashboard/Investments/ActiveInvestment/ActiveInvestmentContainer';
import { InvestmentHistory } from '../../../../../src/modules/Dashboard/Investments/InvestmentHistory';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';
import { debtOrderFromJSON } from '../../../../../src/utils';

describe('<Investments />', () => {
	describe('#render', () => {
		let wrapper;
		let dharma;
		let props;

		beforeEach(() => {
			dharma = new MockDharma();
			props = {
				dharma,
				investments: []
			};
			wrapper = shallow(<Investments {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		it('should render a <Header />', () => {
			expect(wrapper.find(MainWrapper).find(Header).length).toEqual(1);
		});

		it('should render an <InvestmentsMetricsContainer />', () => {
			expect(wrapper.find(MainWrapper).find(InvestmentsMetricsContainer).length).toEqual(1);
		});

		it('should render 0 <ActiveInvestmentContainer />', () => {
			expect(wrapper.find(MainWrapper).find(ActiveInvestmentContainer).length).toEqual(0);
		});

		it('should render a <InvestmentHistory />', () => {
			expect(wrapper.find(MainWrapper).find(InvestmentHistory).length).toEqual(1);
		});
	});

	describe('#componentDidMount', async () => {
		it('should call getInvestmentsDetails', async () => {
			const spy = jest.spyOn(Investments.prototype, 'getInvestmentsDetails');
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments: []
			};
			const wrapper = shallow(<Investments {... props} />);
			await expect(spy).toHaveBeenCalledWith(dharma, []);
		});
	});

	describe('#componentWillReceiveProps', async () => {
		it('should not call getInvestmentsDetails when dharma and investments are null', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments: []
			};
			const wrapper = shallow(<Investments {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'getInvestmentsDetails');
			wrapper.setProps({ dharma: null, investments: null });
			await expect(spy).not.toHaveBeenCalledWith(null, null);
		});

		it('should call getInvestmentsDetails when dharma and investments are avail', async () => {
			const props = {
				dharma: null,
				investments: null
			};
			const wrapper = shallow(<Investments {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'getInvestmentsDetails');
			const dharma = new MockDharma();
			const investments = [
				{
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: 'active',
					earnedAmount: new BigNumber(4),
					termLength: new BigNumber(100),
					interestRate: new BigNumber(12.3),
					amortizationUnit: 'hours',
					status: 'active'
				}
			];
			wrapper.setProps({ dharma: dharma, investments: investments });
			await expect(spy).toHaveBeenCalledWith(dharma, investments);
		});
	});

	describe('#getInvestmentsDetails', async () => {
		let determineExpectedState = async (dharma, investments) => {
			const allInvestments = [];
			const activeInvestments = [];
			const inactiveInvestments = [];
			for (let investment of investments) {
				try {
					const investmentInfo = debtOrderFromJSON(investment.json);
					const earnedAmount = await dharma.servicing.getValueRepaid(investment.issuanceHash);
					investment.earnedAmount = earnedAmount;
					investment.status = investmentInfo.principalAmount && earnedAmount.lt(investmentInfo.principalAmount) ? 'active' : 'inactive';
					if (investment.status === 'active') {
						activeInvestments.push(investment);
					} else {
						inactiveInvestments.push(investment);
					}
					allInvestments.push(investment);
				} catch (ex) {
					// console.log(ex);
				}
			}
			const expectedState = {
				allInvestments,
				activeInvestments,
				inactiveInvestments
			};
			return expectedState;
		};

		const investments = [
			{
				json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
				principalTokenSymbol: 'REP',
				description: 'Hello, Can I borrow some REP please?',
				issuanceHash: 'active',
				earnedAmount: new BigNumber(4),
				termLength: new BigNumber(100),
				interestRate: new BigNumber(12.3),
				amortizationUnit: 'hours',
				status: 'active'
			}
		];

		it('returns without setting state if investments is empty', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments: []
			};
			const wrapper = shallow(<Investments {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'setState');

			wrapper.instance().getInvestmentsDetails(dharma, []);
			await expect(spy).not.toHaveBeenCalled();
			spy.mockRestore();
		});

		it('status is active when the earnedAmount is less than principalAmount', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments
			};
			props.investments[0].issuanceHash = 'active';
			const wrapper = shallow(<Investments {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.investments);
			await expect(wrapper.state()).toEqual(expectedState);
		});

		it('status is inactive when the earnedAmount is greater than or equal to principalAmount', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments
			};
			props.investments[0].issuanceHash = 'inactive';
			const wrapper = shallow(<Investments {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.investments);
			await expect(wrapper.state()).toEqual(expectedState);
		});

		it('no insert to active/inactive when unable to determine the repaidValue', async () => {
			const dharma = new MockDharma();
			const props = {
				dharma,
				investments
			};
			props.investments[0].issuanceHash = 'pending';
			const wrapper = shallow(<Investments {... props} />);
			const expectedState = await determineExpectedState(props.dharma, props.investments);
			await expect(wrapper.state()).toEqual(expectedState);
		});
	});
});
