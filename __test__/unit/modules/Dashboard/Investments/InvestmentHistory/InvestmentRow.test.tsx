import * as React from 'react';
import { shallow } from 'enzyme';
import { InvestmentRow } from '../../../../../../src/modules/Dashboard/Investments/InvestmentHistory/InvestmentRow';
import { shortenString, amortizationUnitToFrequency } from '../../../../../../src/utils';
import {
	StyledRow,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent
} from '../../../../../../src/modules/Dashboard/Investments/InvestmentHistory/styledComponents';
import { BigNumber } from 'bignumber.js';
import { Col, Collapse } from 'reactstrap';

describe('<InvestmentRow />', () => {
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
			wrapper = shallow(<InvestmentRow {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		describe('<StyledRow />', () => {
			let styledRow;
			beforeEach(() => {
				styledRow = wrapper.find(StyledRow);
			});

			it('should render', () => {
				expect(styledRow.length).toEqual(1);
			});

			it('should render 4 <Col />', () => {
				expect(styledRow.find(Col).length).toEqual(4);
			});

			it('1st <Col /> should render principal info', () => {
				const content = props.investment.principalAmount.toNumber() + ' ' + props.investment.principalTokenSymbol;
				expect(styledRow.find(Col).at(0).get(0).props.children).toEqual(content);
			});

			it('2nd <Col /> should render issuance hash info', () => {
				const content = shortenString(props.investment.issuanceHash);
				expect(styledRow.find(Col).at(1).get(0).props.children).toEqual(content);
			});

			it('3rd <Col /> should render status info', () => {
				expect(styledRow.find(Col).at(2).get(0).props.children).toEqual('Delinquent');
				props.investment.earnedAmount = props.investment.principalAmount;
				wrapper.setProps(props);
				styledRow = wrapper.find(StyledRow);
				expect(styledRow.find(Col).at(2).get(0).props.children).toEqual('Paid');
			});

			it('4th <Col /> should render terms info', () => {
				expect(styledRow.find(Col).at(3).get(0).props.children).toEqual('Simple Interest Loan (Non-Collateralized)');
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

			it('should render 4 <InfoItem />', () => {
				expect(collapse.find(InfoItem).length).toEqual(4);
			});

			it('1st <InfoItem /> should render Term Length info', () => {
				const elm = collapse.find(InfoItem).at(0);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Term Length');
				const content = props.investment.termLength.toNumber() + ' ' + props.investment.amortizationUnit;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('2nd <InfoItem /> should render Interest Rate info', () => {
				const elm = collapse.find(InfoItem).at(1);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Interest Rate');
				const content = props.investment.interestRate.toNumber() + '%';
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('3rd <InfoItem /> should render Installment Frequency info', () => {
				const elm = collapse.find(InfoItem).at(2);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Installment Frequency');
				const content = amortizationUnitToFrequency(props.investment.amortizationUnit);
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('4th <InfoItem /> should render Description info', () => {
				const elm = collapse.find(InfoItem).at(3);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Description');
				const content = props.investment.description;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});
		});
	});

	describe('#onClick Div', () => {
		it('should call toggleDrawer on click', () => {
			const props = { investment };
			const spy = jest.spyOn(InvestmentRow.prototype, 'toggleDrawer');
			const wrapper = shallow(<InvestmentRow {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
		});

		it('toggleDrawer should call setState', () => {
			const props = { investment };
			const spy = jest.spyOn(InvestmentRow.prototype, 'setState');
			const wrapper = shallow(<InvestmentRow {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
		});
	});
});
