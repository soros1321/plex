import * as React from 'react';
import { shallow } from 'enzyme';
import { InvestmentHistory } from '../../../../../../src/modules/Dashboard/Investments/InvestmentHistory';
import { InvestmentRow } from '../../../../../../src/modules/Dashboard/Investments/InvestmentHistory/InvestmentRow';
import {
	Wrapper,
	Title,
	TableHeaderRow
} from '../../../../../../src/modules/Dashboard/Investments/InvestmentHistory/styledComponents';
import { Col } from 'reactstrap';
import { BigNumber } from 'bignumber.js';

describe('<InvestmentHistory />', () => {
	let wrapper;
	let investments = [];
	let props;
	beforeEach(() => {
		props = { investments };
		wrapper = shallow(<InvestmentHistory {... props} />);
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

		it('3rd <Col /> shoul render Status', () => {
			expect(tableHeaderRow.find(Col).at(2).get(0).props.children).toEqual('Status');
		});

		it('4th <Col /> should render Terms', () => {
			expect(tableHeaderRow.find(Col).at(3).get(0).props.children).toEqual('Terms');
		});
	});

	describe('<InvestmentRow />', () => {
		it('should render 0 <InvestmentRow />', () => {
			expect(wrapper.find(InvestmentRow).length).toEqual(0);
		});

		it('should render 3 <InvestmentRow />', () => {
			investments = [
				{
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
				},
				{
					debtorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					creditorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
					creditor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(123),
					principalToken: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					principalTokenSymbol: 'MKR',
					termsContract: '0x1c907384489d939400fa5c6571d8aad778213d74',
					termsContractParameters: '0x0000000000000000000000000000008500000000000000000000000000000064',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					earnedAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.24),
					amortizationUnit: 'days',
					status: 'active'
				},
				{
					debtorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					creditorSignature: '{"v": 27,"r": "0xfe481d58d09ac4bf3057a02afe1ef155ef08d3a44a707d98309d305b1a3120a0","s": "0x7fdd34c625a73e543465b38506358a659c221897b1fcfc5c94b3bb74b2e1f246"}',
					creditor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(123),
					principalToken: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					principalTokenSymbol: 'ZRX',
					termsContract: '0x1c907384489d939400fa5c6571d8aad778213d74',
					termsContractParameters: '0x0000000000000000000000000000008500000000000000000000000000000064',
					description: 'Hello, Can I borrow some ZRX please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					earnedAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.24),
					amortizationUnit: 'days',
					status: 'active'
				}
			];
			wrapper.setProps({ investments });
			expect(wrapper.find(InvestmentRow).length).toEqual(3);
		});
	});
});
