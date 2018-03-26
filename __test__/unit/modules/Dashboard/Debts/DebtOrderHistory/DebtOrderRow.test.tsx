import * as React from 'react';
import { shallow } from 'enzyme';
import { DebtOrderRow } from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory/DebtOrderRow';
import { shortenString, amortizationUnitToFrequency, debtOrderFromJSON } from '../../../../../../src/utils';
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
	const debtOrder = {
		json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"10\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
		principalTokenSymbol: 'REP',
		description: 'Hello, Can I borrow some REP please?',
		issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
		fillLoanShortUrl: 'http://bit.ly/2I4bahM',
		repaidAmount: new BigNumber(4),
		termLength: new BigNumber(100),
		interestRate: new BigNumber(12.3),
		amortizationUnit: 'hours',
		status: 'active'
	};

	describe('#render', () => {
		let wrapper;
		let props;
		let debtOrderInfo;
		beforeEach(() => {
			props = { debtOrder };
			debtOrderInfo = debtOrderFromJSON(props.debtOrder.json);
			wrapper = shallow(<DebtOrderRow {... props} />);
		});

		it('should render successfully', () => {
			expect(wrapper.length).toEqual(1);
		});

		it('should not render when there is no debtOrder', () => {
			wrapper.setProps({ debtOrder: null });
			expect(wrapper.find(StyledRow).length).toEqual(0);
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
				const content = debtOrderInfo.principalAmount.toNumber() + ' ' + props.debtOrder.principalTokenSymbol;
				expect(styledRow.find(Col).at(0).get(0).props.children).toEqual(content);
			});

			it('2nd <Col /> should render issuance hash info', () => {
				const content = shortenString(props.debtOrder.issuanceHash);
				expect(styledRow.find(Col).at(1).get(0).props.children).toEqual(content);
			});

			it('3rd <Col /> should render status info', () => {
				expect(styledRow.find(Col).at(2).get(0).props.children).toEqual('Delinquent');
				props.debtOrder.repaidAmount = debtOrderInfo.principalAmount;
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
			const wrapper = shallow(<DebtOrderRow {... props} />);
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalled();
		});

		it('toggleDrawer should call setState', () => {
			const props = { debtOrder };
			const spy = jest.spyOn(DebtOrderRow.prototype, 'setState');
			const wrapper = shallow(<DebtOrderRow {... props} />);
			const collapse = wrapper.state('collapse');
			wrapper.simulate('click');
			expect(spy).toHaveBeenCalledWith({collapse: !collapse});
		});
	});
});
