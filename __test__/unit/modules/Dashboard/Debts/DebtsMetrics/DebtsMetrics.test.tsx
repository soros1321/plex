import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { DebtsMetrics } from '../../../../../../src/modules/Dashboard/Debts/DebtsMetrics/DebtsMetrics';
import { TokenEntity, DebtOrderMoreDetail } from '../../../../../../src/models';
import { BigNumber } from 'bignumber.js';
import {
	HalfCol,
	Value,
	TokenWrapper,
	Label
} from '../../../../../../src/modules/Dashboard/Debts/DebtsMetrics/styledComponents';

describe('<DebtsMetrics />', () => {
	let debtOrders;
	let tokens;
	let props;
	beforeEach(() => {
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
			}
		];

		tokens = [
			{
				address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
				tokenSymbol: 'MKR',
				tradingPermitted: true,
				balance: new BigNumber(10000)
			}
		];

		props = { debtOrders, tokens };
	});

	it('should render the component', () => {
		const wrapper = shallow(<DebtsMetrics {... props} />);
		expect(wrapper.length).toEqual(1);
	});

	it('should render Total Requested and Total Repaid', () => {
		props.debtOrders = [];
		props.tokens = [];
		const wrapper = shallow(<DebtsMetrics {... props} />);

		expect(wrapper.length).toEqual(1);
		const defaultTotal = '0 ETH';
		expect(wrapper.find(HalfCol).length).toEqual(2);
		expect(wrapper.find(HalfCol).first().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
		expect(wrapper.find(HalfCol).first().find(Label).get(0).props.children).toEqual('Total Requested');
		expect(wrapper.find(HalfCol).last().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
		expect(wrapper.find(HalfCol).last().find(Label).get(0).props.children).toEqual('Total Repaid');
	});

	describe('#componentDidMount', () => {
		it('should call initiateTokenBalance', () => {
			const spy = jest.spyOn(DebtsMetrics.prototype, 'initiateTokenBalance');
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(spy).toHaveBeenCalled();
		});

		it('should set the correct token balance', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')['MKR'].totalRequested).toEqual(new BigNumber(345));
		});
	});

	describe('#componentWillReceiveProps', () => {
		it('should call initiateTokenBalance when there is debtOrders and tokens', () => {
			props.debtOrders = null;
			props.tokens = null;
			const wrapper = shallow(<DebtsMetrics {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'initiateTokenBalance');
			wrapper.setProps({ debtOrders, tokens });
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should not call initiateTokenBalance when there is no debtOrders and no tokens', () => {
			props.debtOrders = null;
			props.tokens = null;
			const wrapper = shallow(<DebtsMetrics {... props} />);
			const spy = jest.spyOn(wrapper.instance(), 'initiateTokenBalance');
			wrapper.setProps({ debtOrders: null, tokens: null });
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('#render (5 Tokens)', () => {
		beforeEach(() => {
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
				},
				{
					debtorSignature: '{v: 27,r: "0xb90c74efb3b13bc6459f37cf1fc65f1f29a391d0d6280b15beac2a34572a3d9a",s: "0x66358c759588ba845ec0d3bded452c5dcef638f3fae6489a709ed26c75da138b"}',
					debtor: '0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935',
					principalAmount: new BigNumber(345),
					principalToken: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
					principalTokenSymbol: 'SNT',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some SNT please?',
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
					principalToken: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
					principalTokenSymbol: 'OMG',
					termsContract: '0x60a1779d5af15f808d91f3afbc4bcaddbf288ced',
					termsContractParameters: '0x000000000000000000000000000006bd02000000000000000000000000000014',
					description: 'Hello, Can I borrow some OMG please?',
					issuanceHash: '0xe48276c5b64237ac1c8bd8ee5dc8a06e170e8f34aab0debab0c06ede8c725e83',
					fillLoanShortUrl: 'http://bit.ly/2DtiZKW',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				}
			];

			tokens = [
				{
					address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					tokenSymbol: 'MKR',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0xc3017eb5cd063bf6745723895edead65257a5f6e',
					tokenSymbol: 'ZRX',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					tokenSymbol: 'REP',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
					tokenSymbol: 'SNT',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
					tokenSymbol: 'OMG',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				}
			];

			props = { debtOrders, tokens };
		});

		it('should not render more than 4 Tokens in Total Requested section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(5);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toBeLessThanOrEqual(4);
		});

		it('Total Requested\'s last element should render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(5);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).last().get(0).props.children).toEqual('AND MORE');
		});

		it('should not render more than 4 Tokens in Total Repaid section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(5);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).length).toBeLessThanOrEqual(4);
		});

		it('Total Repaid\'s last element should render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(5);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).last().get(0).props.children).toEqual('AND MORE');
		});
	});

	describe('#render (2 Tokens)', () => {
		beforeEach(() => {
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
				}
			];

			tokens = [
				{
					address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					tokenSymbol: 'MKR',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					tokenSymbol: 'REP',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				}
			];

			props = { debtOrders, tokens };
		});

		it('should render 2 Tokens in Total Requested section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(2);
		});

		it('last element should not render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).last().get(0).props.children).not.toEqual('AND MORE');
		});

		it('should render 2 Tokens in Total Repaid section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).length).toEqual(2);
		});

		it('last element should not render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).last().get(0).props.children).not.toEqual('AND MORE');
		});
	});

	describe('Debt Orders with invalid Token should not be included', () => {
		beforeEach(() => {
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
				}
			];

			tokens = [
				{
					address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					tokenSymbol: 'MKR',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				}
			];

			props = { debtOrders, tokens };
		});

		it('should render 1 Token in Total Requested section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(1);
			expect(debtOrders.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(1);
		});
	});

	describe('Only render Token with amount in Total Requested/Repaid section', () => {
		beforeEach(() => {
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
					repaidAmount: new BigNumber(0),
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
				}
			];

			tokens = [
				{
					address: '0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e',
					tokenSymbol: 'MKR',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
					tokenSymbol: 'REP',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				},
				{
					address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
					tokenSymbol: 'OMG',
					tradingPermitted: true,
					balance: new BigNumber(10000)
				}
			];

			props = { debtOrders, tokens };
		});

		it('should render 10 REP in Total Repaid section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(3);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).length).toEqual(1);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).get(0).props.children).toEqual('10 REP');
		});

		it('should render 345 MKR and 345 REP in Total Requested section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(3);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).first().get(0).props.children).toEqual('345 MKR');
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).last().get(0).props.children).toEqual('345 REP');
		});
	});
});
