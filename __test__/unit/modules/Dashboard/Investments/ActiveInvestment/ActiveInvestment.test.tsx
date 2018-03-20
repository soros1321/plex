import * as React from 'react';
import { shallow } from 'enzyme';
import { ActiveInvestment } from '../../../../../../src/modules/Dashboard/Investments/ActiveInvestment';
import {
	Wrapper,
	ImageContainer,
	IdenticonImage,
	DetailContainer,
	Amount,
	Url,
	StatusActive,
	StatusDefaulted,
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
	TransferButton
} from '../../../../../../src/modules/Dashboard/Investments/ActiveInvestment/styledComponents';
import { Collapse } from 'reactstrap';
import { getIdenticonImgSrc, shortenString, amortizationUnitToFrequency } from '../../../../../../src/utils';
import { BigNumber } from 'bignumber.js';

describe('<ActiveInvestment />', () => {
	const investment = {
		debtorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
		debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
		creditorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
		creditor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
		principalAmount: new BigNumber(123),
		principalToken: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
		principalTokenSymbol: 'REP',
		termsContract: '0x1c907384489d939400fa5c6571d8aad778213d74',
		termsContractParameters: '0x0000000000000000000000000000008500000000000000000000000000000064',
		description: 'Hello, Can I borrow some REP please?',
		issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
		earnedAmount: new BigNumber(10),
		termLength: new BigNumber(20),
		interestRate: new BigNumber(3.24),
		amortizationUnit: 'days',
		status: 'active'
	};

	describe('#render', () => {
		let wrapper;
		let props;
		beforeEach(() => {
			props = { investment };
			wrapper = shallow(<ActiveInvestment {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		describe('<ImageContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(ImageContainer).length).toEqual(1);
			});

			it('should render a <IdenticonImage />', () => {
				const identiconImgSrc = getIdenticonImgSrc(props.investment.issuanceHash, 60, 0.1);
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
				const amount = props.investment.principalAmount.toNumber() + ' ' + props.investment.principalTokenSymbol;
				expect(detailContainer.find(Amount).length).toEqual(1);
				expect(detailContainer.find(Amount).get(0).props.children).toEqual(amount);
			});

			it('should render correct <DetailLink />', () => {
				expect(detailContainer.find(Url).find(DetailLink).length).toEqual(1);
				expect(detailContainer.find(Url).find(DetailLink).prop('to')).toEqual('/request/success/' + props.investment.issuanceHash);
				expect(detailContainer.find(Url).find(DetailLink).get(0).props.children).toEqual(shortenString(props.investment.issuanceHash));
			});

			it('should render a <TransferButton /> if status active', () => {
				expect(detailContainer.find(TransferButton).length).toEqual(1);
			});

			it('should render <StatusActive /> if active', () => {
				expect(detailContainer.find(StatusActive).length).toEqual(1);
			});

			it('should not render a <TransferButton /> if status not active', () => {
				props.investment.status = 'defaulted';
				wrapper.setProps({ props });
				detailContainer = wrapper.find(DetailContainer);
				expect(detailContainer.find(TransferButton).length).toEqual(0);
			});

			it('should render <StatusDefaulted /> if status defaulted', () => {
				expect(detailContainer.find(StatusDefaulted).length).toEqual(1);
			});

			it('should render a <Terms />', () => {
				expect(detailContainer.find(Terms).length).toEqual(1);
			});
		});

		describe('<RepaymentScheduleContainer />', () => {
			it('should render', () => {
				expect(wrapper.find(RepaymentScheduleContainer).length).toEqual(1);
			});

			it('should render a <Title />', () => {
				expect(wrapper.find(RepaymentScheduleContainer).find(Title).length).toEqual(1);
			});

			it('should not render <Schedule />', () => {
				expect(wrapper.find(RepaymentScheduleContainer).find(Schedule).length).toEqual(0);
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

			it('1st <InfoItem /> should render Lended info', () => {
				const elm = collapse.find(InfoItem).at(0);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Lended');
				const content = props.investment.principalAmount.toNumber() + ' ' + props.investment.principalTokenSymbol;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('2nd <InfoItem /> should render Earned info', () => {
				const elm = collapse.find(InfoItem).at(1);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Earned');
				const content = props.investment.earnedAmount.toNumber() + ' ' + props.investment.principalTokenSymbol;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('3rd <InfoItem /> should render Term Length info', () => {
				const elm = collapse.find(InfoItem).at(2);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Term Length');
				const content = props.investment.termLength.toNumber() + ' ' + props.investment.amortizationUnit;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('4th <InfoItem /> should render Interest Rate info', () => {
				const elm = collapse.find(InfoItem).at(3);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Interest Rate');
				const content = props.investment.interestRate.toNumber() + '%';
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('5th <InfoItem /> should render Installment Frequency info', () => {
				const elm = collapse.find(InfoItem).at(4);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Installment Frequency');
				const content = amortizationUnitToFrequency(props.investment.amortizationUnit);
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('6th <InfoItem /> should render Description info', () => {
				const elm = collapse.find(InfoItem).at(5);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Description');
				const content = props.investment.description;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});
		});
	});

	describe('#onClick Wrapper', () => {
		it('should call toggleDrawer on click', () => {
			const props = { investment };
			const spy = jest.spyOn(ActiveInvestment.prototype, 'toggleDrawer');
			const wrapper = shallow(<ActiveInvestment {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
		});

		it('toggleDrawer should call setState', () => {
			const props = { investment };
			const spy = jest.spyOn(ActiveInvestment.prototype, 'setState');
			const wrapper = shallow(<ActiveInvestment {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
		});
	});

	describe('#onClick <TransferButton />', () => {
		it('should call handleTransfer', () => {
			const props = { investment };
			props.investment.status = 'active';
			const spy = jest.spyOn(ActiveInvestment.prototype, 'handleTransfer');
			const wrapper = shallow(<ActiveInvestment {... props} />);
			const event = {
				stopPropagation: jest.fn()
			};
			expect(wrapper.find(TransferButton).length).toEqual(1);

			wrapper.find(TransferButton).simulate('click', event);
			expect(spy).toHaveBeenCalledWith(event);
		});
	});
});
