import * as React from 'react';
import { shallow } from 'enzyme';
import { DebtOrderRow } from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory/DebtOrderRow';
import { shortenString, amortizationUnitToFrequency } from '../../../../../../src/utils';
import {
	StyledRow,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent
} from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory/styledComponents';
import { BigNumber } from 'bignumber.js';
import { Col, Collapse } from 'reactstrap';

describe('<DebtOrderRow />', () => {
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
			wrapper = shallow(<DebtOrderRow {... props} />);
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
				const content = props.debtOrder.principalAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
				expect(styledRow.find(Col).at(0).get(0).props.children).toEqual(content);
			});

			it('2nd <Col /> should render issuance hash info', () => {
				const content = shortenString(props.debtOrder.issuanceHash);
				expect(styledRow.find(Col).at(1).get(0).props.children).toEqual(content);
			});

			it('3rd <Col /> should render status info', () => {
				const content = 'Delinquent';
				expect(styledRow.find(Col).at(2).get(0).props.children).toEqual('Delinquent');
				props.debtOrder.repaidAmount = props.debtOrder.principalAmount;
				wrapper.setProps(props);
				styledRow = wrapper.find(StyledRow);
				expect(styledRow.find(Col).at(2).get(0).props.children).toEqual('Paid');
			});

			it('4th <Col /> should render issuance hash info', () => {
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

			it('1st <InfoItem /> should render Requested info', () => {
				const elm = collapse.find(InfoItem).at(0);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Term Length');
				const content = props.debtOrder.termLength.toNumber() + ' ' + props.debtOrder.amortizationUnit;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('2nd <InfoItem /> should render Interest Rate info', () => {
				const elm = collapse.find(InfoItem).at(1);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Interest Rate');
				const content = props.debtOrder.interestRate.toNumber() + '%';
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('3rd <InfoItem /> should render Installment Frequency info', () => {
				const elm = collapse.find(InfoItem).at(2);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Installment Frequency');
				const content = amortizationUnitToFrequency(props.debtOrder.amortizationUnit);
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});

			it('4th <InfoItem /> should render Description info', () => {
				const elm = collapse.find(InfoItem).at(3);
				expect(elm.find(InfoItemTitle).get(0).props.children).toEqual('Description');
				const content = props.debtOrder.description;
				expect(elm.find(InfoItemContent).get(0).props.children).toEqual(content);
			});
		});
	});

	describe('#onClick Div', () => {
		it('should call toggleDrawer on click', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(DebtOrderRow.prototype, 'toggleDrawer');
			wrapper = shallow(<DebtOrderRow {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
		});

		it('toggleDrawer should call setState', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(DebtOrderRow.prototype, 'setState');
			wrapper = shallow(<DebtOrderRow {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
		});
	});
});
