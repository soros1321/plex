import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Investments } from '../../../../../src/modules/Dashboard/Investments/Investments';
import { Header, MainWrapper } from '../../../../../src/components';
import { InvestmentsMetricsContainer } from '../../../../../src/modules/Dashboard/Investments/InvestmentsMetrics/InvestmentsMetricsContainer';
import { ActiveInvestment } from '../../../../../src/modules/Dashboard/Investments/ActiveInvestment';
import { InvestmentHistory } from '../../../../../src/modules/Dashboard/Investments/InvestmentHistory';
import MockDharma from '../../../../../__mocks__/dharma.js';
import { BigNumber } from 'bignumber.js';

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

		it('should render 0 <ActiveInvestment />', () => {
			expect(wrapper.find(MainWrapper).find(ActiveInvestment).length).toEqual(0);
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
					const dharmaDebtOrder = {
						principalAmount: investment.principalAmount,
						principalToken: investment.principalToken,
						termsContract: investment.termsContract,
						termsContractParameters: investment.termsContractParameters
					};

					const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
					const investmentMoreDetail = {
						...investment,
						termLength: fromDebtOrder.termLength,
						amortizationUnit: fromDebtOrder.amortizationUnit,
						interestRate: fromDebtOrder.interestRate,
						earnedAmount: new BigNumber(0),
						status: ''
					};

					try {
						const earnedAmount = await dharma.servicing.getValueRepaid(investment.issuanceHash);
						investmentMoreDetail.earnedAmount = earnedAmount;
						investmentMoreDetail.status = investment.principalAmount && earnedAmount.lt(investment.principalAmount) ? 'active' : 'inactive';
						if (investmentMoreDetail.status === 'active') {
							activeInvestments.push(investmentMoreDetail);
						} else {
							inactiveInvestments.push(investmentMoreDetail);
						}
						allInvestments.push(investmentMoreDetail);
					} catch (ex) {
						// console.log(ex);
					}
				} catch (e) {
					// console.log(e);
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
