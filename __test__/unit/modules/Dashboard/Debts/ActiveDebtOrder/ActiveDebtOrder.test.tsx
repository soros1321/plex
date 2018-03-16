import * as React from 'react';
import { shallow } from 'enzyme';
import { ActiveDebtOrder } from '../../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder';
import {
	Wrapper,
	ImageContainer,
	IdenticonImage,
	DetailContainer,
	Amount,
	Url,
	StatusActive,
	StatusPending,
	Terms,
	RepaymentScheduleContainer,
	Title,
	Schedule,
	ScheduleIconContainer,
	ScheduleIcon,
	Strikethrough,
	PaymentDate,
	ShowMore,
	DetailLink,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent,
	MakeRepaymentButton
} from '../../../../../../src/modules/Dashboard/Debts/ActiveDebtOrder/styledComponents';
import { Collapse } from 'reactstrap';
import { getIdenticonImgSrc, shortenString, amortizationUnitToFrequency } from '../../../../../../src/utils';
import { BigNumber } from 'bignumber.js';

describe('<ActiveDebtOrder />', () => {
	let wrapper;
	let props;
	const debtOrder = {
		debtorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
		debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
		principalAmount: new BigNumber(123),
		principalToken: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
		principalTokenSymbol: 'REP',
		termsContract: '0x1c907384489d939400fa5c6571d8aad778213d74',
		termsContractParameters: '0x0000000000000000000000000000008500000000000000000000000000000064',
		description: 'Hello, Can I borrow some REP please?',
		issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
		fillLoanShortUrl: 'http://bit.ly/2HDpT2P',
		repaidAmount: new BigNumber(10),
		termLength: new BigNumber(20),
		interestRate: new BigNumber(3.24),
		amortizationUnit: 'days',
		status: 'active'
	};

	describe('#render', () => {
		beforeEach(() => {
			props = { debtOrder };
			wrapper = shallow(<ActiveDebtOrder {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		describe('<ImageContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(ImageContainer).length).toEqual(1);
			});

			it('should render a <IdenticonImage />', () => {
				const identiconImgSrc = getIdenticonImgSrc(props.debtOrder.issuanceHash, 60, 0.1);
				expect(wrapper.find(ImageContainer).find(IdenticonImage).length).toEqual(1);
				expect(wrapper.find(ImageContainer).find(IdenticonImage).prop('src')).toEqual(identiconImgSrc);
			});
		});

		describe('<DetailContainer />', () => {
			let detailContainer;
			beforeEach(() => {
				detailContainer = wrapper.find(DetailContainer);
			});

			it('should render', () => {
				expect(detailContainer.length).toEqual(1);
			});

			it('should render correct <Amount />', () => {
				const amount = [props.debtOrder.principalAmount.toNumber(), ' ', props.debtOrder.principalTokenSymbol];
				expect(detailContainer.find(Amount).length).toEqual(1);
				expect(detailContainer.find(Amount).get(0).props.children).toEqual(amount);
			});

			it('should render correct <DetailLink />', () => {
				expect(detailContainer.find(Url).find(DetailLink).length).toEqual(1);
				expect(detailContainer.find(Url).find(DetailLink).prop('to')).toEqual('/request/success/' + props.debtOrder.issuanceHash);
				expect(detailContainer.find(Url).find(DetailLink).get(0).props.children).toEqual(shortenString(props.debtOrder.issuanceHash));
			});

			it('should render a <MakeRepaymentButton /> if status active', () => {
				expect(detailContainer.find(MakeRepaymentButton).length).toEqual(1);
			});

			it('should render <StatusActive /> if active', () => {
				expect(detailContainer.find(StatusActive).length).toEqual(1);
			});

			it('should not render a <MakeRepaymentButton /> if status not active', () => {
				props.debtOrder.status = 'pending';
				wrapper.setProps({ props });
				detailContainer = wrapper.find(DetailContainer);
				expect(detailContainer.find(MakeRepaymentButton).length).toEqual(0);
			});

			it('should render <StatusPending /> if pending', () => {
				expect(detailContainer.find(StatusPending).length).toEqual(1);
			});

			it('should render a <Terms />', () => {
				expect(detailContainer.find(Terms).length).toEqual(1);
			});
		});

		describe('<RepaymentScheduleContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(RepaymentScheduleContainer).length).toEqual(1);
			});

			it('should have class .active when status is active', () => {
				props.debtOrder.status = 'active';
				wrapper.setProps({ props });
				expect(wrapper.find(RepaymentScheduleContainer).hasClass('active')).toEqual(true);
			});

			it('should not have class .active when status is pending', () => {
				props.debtOrder.status = 'pending';
				wrapper.setProps({ props });
				expect(wrapper.find(RepaymentScheduleContainer).hasClass('active')).toEqual(false);
				props.debtOrder.status = 'active';
				wrapper.setProps({ props });
			});

			it('should render a <Title />', () => {
				expect(wrapper.find(RepaymentScheduleContainer).find(Title).length).toEqual(1);
			});

			it('should not render <Schedule />', () => {
				expect(wrapper.find(RepaymentScheduleContainer).find(Schedule).length).toEqual(0);
			});
		});
	});

	describe('<Collapse />', () => {
		let collapse;
		beforeEach(() => {
			collapse = wrapper.find(Collapse);
		});

		it('should render', () => {
			expect(collapse.length).toEqual(1);
		});

		it('should render 6 <InfoItem />', () => {
			expect(collapse.find(InfoItem).length).toEqual(6);
		});

		it('1st <InfoItem /> should render Requested info', () => {
			const elm = collapse.find(InfoItem).at(0);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Requested');
			const content = props.debtOrder.principalAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});

		it('2nd <InfoItem /> should render Repaid info', () => {
			const elm = collapse.find(InfoItem).at(1);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Repaid');
			const content = props.debtOrder.repaidAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});

		it('3rd <InfoItem /> should render Term Length info', () => {
			const elm = collapse.find(InfoItem).at(2);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Term Length');
			const content = props.debtOrder.termLength.toNumber() + ' ' + props.debtOrder.amortizationUnit;
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});

		it('4th <InfoItem /> should render Interest Rate info', () => {
			const elm = collapse.find(InfoItem).at(3);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Interest Rate');
			const content = props.debtOrder.interestRate.toNumber() + '%';
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});

		it('5th <InfoItem /> should render Installment Frequency info', () => {
			const elm = collapse.find(InfoItem).at(4);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Installment Frequency');
			const content = amortizationUnitToFrequency(props.debtOrder.amortizationUnit);
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});

		it('6th <InfoItem /> should render Description info', () => {
			const elm = collapse.find(InfoItem).at(5);
			expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Description');
			const content = props.debtOrder.description;
			expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
		});
	});

	describe('#onClick Wrapper', () => {
		it('should call toggleDrawer on click', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'toggleDrawer');
			wrapper = shallow(<ActiveDebtOrder {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
		});

		it('toggleDrawer should call setState', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'setState');
			wrapper = shallow(<ActiveDebtOrder {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
		});
	});

	describe('#onClick <MakeRepaymentButton />', () => {
		it('should call makeRepayment', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(ActiveDebtOrder.prototype, 'makeRepayment');
			wrapper = shallow(<ActiveDebtOrder {... props} />);
			const event = {
				stopPropagation: jest.fn()
			};
			wrapper.find(MakeRepaymentButton).simulate('click', event);
			expect(spy).toHaveBeenCalledWith(event);
		});
	});
});
