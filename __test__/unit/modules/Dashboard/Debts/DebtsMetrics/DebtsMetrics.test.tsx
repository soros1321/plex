import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { DebtsMetrics } from '../../../../../../src/modules/Dashboard/Debts/DebtsMetrics/DebtsMetrics';
import { TokenEntity, DebtOrderEntity } from '../../../../../../src/models';
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
			}
		];

		tokens = [
			{
				address: '0x9b62bd396837417ce319e2e5c8845a5a960010ea',
				tokenSymbol: 'REP',
				tradingPermitted: true,
				balance: new BigNumber(10000)
			}
		];

		props = { debtOrders, tokens };
	});

	describe('#render', () => {
		it('should render the component', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.length).toEqual(1);
		});

		it('should render correct Total Owed and Total Repaid value', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.find(HalfCol).length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(Value).find(TokenWrapper).get(0).props.children).toEqual('10 REP');
			expect(wrapper.find(HalfCol).first().find(Label).get(0).props.children).toEqual('Total Owed');
			expect(wrapper.find(HalfCol).last().find(Value).find(TokenWrapper).get(0).props.children).toEqual('4 REP');
			expect(wrapper.find(HalfCol).last().find(Label).get(0).props.children).toEqual('Total Repaid');
		});

		it('should render 0 ETH Total Owed and 0 ETH Total Repaid when there is no debtOrders', () => {
			props.debtOrders = [];
			const wrapper = shallow(<DebtsMetrics {... props} />);
			const defaultTotal = '0 ETH';
			expect(wrapper.find(HalfCol).length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
			expect(wrapper.find(HalfCol).first().find(Label).get(0).props.children).toEqual('Total Owed');
			expect(wrapper.find(HalfCol).last().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
			expect(wrapper.find(HalfCol).last().find(Label).get(0).props.children).toEqual('Total Repaid');
		});

		it('should render 0 ETH Total Owed and 0 ETH Total Repaid when there is no tokens', () => {
			props.tokens = [];
			const wrapper = shallow(<DebtsMetrics {... props} />);
			const defaultTotal = '0 ETH';
			expect(wrapper.find(HalfCol).length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
			expect(wrapper.find(HalfCol).first().find(Label).get(0).props.children).toEqual('Total Owed');
			expect(wrapper.find(HalfCol).last().find(Value).find(TokenWrapper).get(0).props.children).toEqual(defaultTotal);
			expect(wrapper.find(HalfCol).last().find(Label).get(0).props.children).toEqual('Total Repaid');
			expect(wrapper.state('tokenBalances')).toEqual({});
		});
	});

	describe('#componentDidMount', () => {
		it('should call initiateTokenBalance', () => {
			const spy = jest.spyOn(DebtsMetrics.prototype, 'initiateTokenBalance');
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(spy).toHaveBeenCalledWith(props.tokens, props.debtOrders);
		});

		it('should set the correct token balance', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')['REP'].totalRequested).toEqual(new BigNumber(10));
			expect(wrapper.state('tokenBalances')['REP'].totalRepaid).toEqual(new BigNumber(4));
		});
	});

	describe('#componentWillReceiveProps', () => {
		it('should call initiateTokenBalance when there is debtOrders and tokens', () => {
			const wrapper = shallow(<DebtsMetrics />);
			const spy = jest.spyOn(wrapper.instance(), 'initiateTokenBalance');
			wrapper.setProps({ debtOrders, tokens });
			expect(spy).toHaveBeenCalledWith(tokens, debtOrders);
			spy.mockRestore();
		});

		it('should not call initiateTokenBalance when there is no debtOrders and no tokens', () => {
			const wrapper = shallow(<DebtsMetrics />);
			const spy = jest.spyOn(wrapper.instance(), 'initiateTokenBalance');
			wrapper.setProps({ debtOrders: null, tokens: null });
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('#render (5 Tokens)', () => {
		beforeEach(() => {
			debtOrders = [
				{
					json: "{\"principalToken\":\"0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'MKR',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0xc3017eb5cd063bf6745723895edead65257a5f6e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'ZRX',
					description: 'Hello, Can I borrow some ZRX please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0x744d70fdbe2ba4cf95131626614a1763df805b9e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'SNT',
					description: 'Hello, Can I borrow some SNT please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0xd26114cd6EE289AccF82350c8d8487fedB8A0C07\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'OMG',
					description: 'Hello, Can I borrow some OMG please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
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

		it('should have the correct tokenBalances', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')).toEqual({
				MKR: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				ZRX: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				REP: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				SNT: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				OMG: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				}
			});
		});

		it('should not render more than 4 Tokens in Total Owed section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(5);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toBeLessThanOrEqual(4);
		});

		it('Total Owed\'s last element should render AND MORE', () => {
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
					json: "{\"principalToken\":\"0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'MKR',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
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

		it('should have the correct tokenBalances', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')).toEqual({
				MKR: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				REP: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				}
			});
		});

		it('should render 2 Tokens in Total Owed section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(2);
		});

		it('Total Owed\'s last element should not render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).last().get(0).props.children).not.toEqual('AND MORE');
		});

		it('should render 2 Tokens in Total Repaid section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).length).toEqual(2);
		});

		it('Total Repaid\'s last element should not render AND MORE', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(2);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).last().get(0).props.children).not.toEqual('AND MORE');
		});
	});

	describe('Debt Orders with invalid Token should not be included', () => {
		beforeEach(() => {
			debtOrders = [
				{
					json: "{\"principalToken\":\"0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'MKR',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(10),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
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

		it('should have the correct tokenBalances', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')).toEqual({
				MKR: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				}
			});
		});

		it('should render 1 Token in Total Owed section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(1);
			expect(debtOrders.length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(1);
		});
	});

	describe('Only render Token with amount in Total Owed/Repaid section', () => {
		beforeEach(() => {
			debtOrders = [
				{
					json: "{\"principalToken\":\"0x07e93e27ac8a1c114f1931f65e3c8b5186b9b77e\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'MKR',
					description: 'Hello, Can I borrow some MKR please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
					repaidAmount: new BigNumber(0),
					termLength: new BigNumber(20),
					interestRate: new BigNumber(3.12),
					amortizationUnit: 'hours',
					status: 'active'
				},
				{
					json: "{\"principalToken\":\"0x9b62bd396837417ce319e2e5c8845a5a960010ea\",\"principalAmount\":\"345\",\"termsContract\":\"0x1c907384489d939400fa5c6571d8aad778213d74\",\"termsContractParameters\":\"0x0000000000000000000000000000008500000000000000000000000000000064\",\"kernelVersion\":\"0x89c5b853e9e32bf47c7da1ccb02e981b74c47f2f\",\"issuanceVersion\":\"0x1d8e76d2022e017c6c276b44cb2e4c71bd3cc3de\",\"debtor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"debtorFee\":\"0\",\"creditor\":\"0x431194c3e0f35bc7f1266ec6bb85e0c5ec554935\",\"creditorFee\":\"0\",\"relayer\":\"0x0000000000000000000000000000000000000000\",\"relayerFee\":\"0\",\"underwriter\":\"0x0000000000000000000000000000000000000000\",\"underwriterFee\":\"0\",\"underwriterRiskRating\":\"0\",\"expirationTimestampInSec\":\"1524613355\",\"salt\":\"0\",\"debtorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"creditorSignature\":{\"v\":27,\"r\":\"0xc5c0aaf7b812cb865aef48958e2d39686a13c292f8bd4a82d7b43d833fb5047d\",\"s\":\"0x2fbbe9f0b8e12ed2875905740fa010bbe710c3e0c131f1efe14fb41bb7921788\"},\"underwriterSignature\":{\"r\":\"\",\"s\":\"\",\"v\":0}}",
					principalTokenSymbol: 'REP',
					description: 'Hello, Can I borrow some REP please?',
					issuanceHash: '0x89e9eac37c5f14b657c69ccd891704b3236b84b9ca1d449bd09c5fbaa24afebf',
					fillLoanShortUrl: 'http://bit.ly/2I4bahM',
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

		it('should have the correct tokenBalances', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(wrapper.state('tokenBalances')).toEqual({
				MKR: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(0)
				},
				REP: {
					totalRequested: new BigNumber(345),
					totalRepaid: new BigNumber(10)
				},
				OMG: {
					totalRequested: new BigNumber(0),
					totalRepaid: new BigNumber(0)
				}
			});
		});

		it('should render 10 REP in Total Repaid section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(3);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).length).toEqual(1);
			expect(wrapper.find(HalfCol).last().find(TokenWrapper).get(0).props.children).toEqual('10 REP');
		});

		it('should render 345 MKR and 345 REP in Total Owed section', () => {
			const wrapper = shallow(<DebtsMetrics {... props} />);
			expect(tokens.length).toEqual(3);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).length).toEqual(2);
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).first().get(0).props.children).toEqual('345 MKR');
			expect(wrapper.find(HalfCol).first().find(TokenWrapper).last().get(0).props.children).toEqual('345 REP');
		});
	});
});
