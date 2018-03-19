import * as React from 'react';
import { shallow } from 'enzyme';
import { DebtOrderHistory } from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory';
import { DebtOrderRow } from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory/DebtOrderRow';
import {
	Wrapper,
	Title,
	TableHeaderRow
} from '../../../../../../src/modules/Dashboard/Debts/DebtOrderHistory/styledComponents';
import { Col } from 'reactstrap';
import { BigNumber } from 'bignumber.js';

describe('<DebtOrderHistory />', () => {
	let wrapper;
	let debtOrders = [];
	beforeEach(() => {
		const props = { debtOrders };
		wrapper = shallow(<DebtOrderHistory {... props} />);
	});

	it('should render', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('should render a <Title />', () => {
		expect(wrapper.find(Wrapper).find(Title).length).toEqual(1);
	});

	describe('<TableHeaderRow />', () => {
		let tableHeaderRow;
		beforeEach(() => {
			tableHeaderRow = wrapper.find(Wrapper).find(TableHeaderRow);
		});

		it('should render', () => {
			expect(tableHeaderRow.length).toEqual(1);
		});

		it('should render 4 <Col />', () => {
			expect(tableHeaderRow.find(Col).length).toEqual(4);
		});

		it('1st <Col /> should render Amount', () => {
			expect(tableHeaderRow.find(Col).at(0).get(0).props.children).toEqual('Amount');
		});

		it('2nd <Col /> should render ID', () => {
			expect(tableHeaderRow.find(Col).at(1).get(0).props.children).toEqual('ID');
		});

		it('3rd <Col /> should render Status', () => {
			expect(tableHeaderRow.find(Col).at(2).get(0).props.children).toEqual('Status');
		});

		it('4th <Col /> should render Terms', () => {
			expect(tableHeaderRow.find(Col).at(3).get(0).props.children).toEqual('Terms');
		});
	});

	describe('<DebtOrderRow />', () => {
		it('should render 0 <DebtOrderRow />', () => {
			expect(wrapper.find(DebtOrderRow).length).toEqual(0);
		});

		it('should render 3 <DebtOrderRow />', () => {
			debtOrders = [
				{
					debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(345),
					principalToken: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					principalTokenSymbol: 'MKR',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0xe48276c5b64237ac1c8bd8ee5dc8a06e170e8f34aab0debab0c06ede8c725e83',
					fillLoanShortUrl: 'http://bit.ly/2DtiZKW',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(345),
					principalToken: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					principalTokenSymbol: 'REP',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: '0xe48276c5b64237ac1c8bd8ee5dc8a06e170e8f34aab0debab0c06ede8c725e83',
					fillLoanShortUrl: 'http://bit.ly/2DtiZKW',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(345),
					principalToken: '0xc3017eb5cd063bf6745723895edead65257a5f6e',
					principalTokenSymbol: 'ZRX',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some ZRX please?',
					issuanceHash: '0xe48276c5b64237ac1c8bd8ee5dc8a06e170e8f34aab0debab0c06ede8c725e83',
					fillLoanShortUrl: 'http://bit.ly/2DtiZKW',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				}
			];
			wrapper.setProps({ debtOrders });
			expect(wrapper.find(DebtOrderRow).length).toEqual(3);
		});
	});
});
