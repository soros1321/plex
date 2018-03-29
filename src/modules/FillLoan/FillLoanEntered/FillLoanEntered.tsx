import * as React from 'react';
import { Link, browserHistory } from 'react-router';
import { amortizationUnitToFrequency, shortenString, debtOrderFromJSON } from '../../../utils';
import { PaperLayout } from '../../../layouts';
import {
	Header,
	ConfirmationModal,
	MainWrapper,
	Bold
} from '../../../components';
import { SuccessModal } from './SuccessModal';
import { Col } from 'reactstrap';
import {
	LoanInfoContainer,
	HalfCol,
	InfoItem,
	Title,
	Content,
	ButtonContainer,
	DeclineButton,
	FillLoanButton
} from './styledComponents';
import * as Web3 from 'web3';
import Dharma from '@dharmaprotocol/dharma.js';
import { DebtOrder } from '@dharmaprotocol/dharma.js/dist/types/src/types';
import { BigNumber } from 'bignumber.js';
import { TokenEntity } from '../../../models';

interface Props {
	location?: any;
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
	tokens: TokenEntity[];
	handleSetError: (errorMessage: string) => void;
	handleFillDebtOrder: (issuanceHash: string) => void;
}

interface States {
	confirmationModal: boolean;
	successModal: boolean;
	debtOrder: DebtOrder.Instance;
	description: string;
	principalTokenSymbol: string;
	interestRate: BigNumber;
	termLength: BigNumber;
	amortizationUnit: string;
	issuanceHash: string;
}

class FillLoanEntered extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.state = {
			confirmationModal: false,
			successModal: false,
			debtOrder: {},
			description: '',
			principalTokenSymbol: '',
			interestRate: new BigNumber(0),
			termLength: new BigNumber(0),
			amortizationUnit: '',
			issuanceHash: ''
		};
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
		this.handleFillOrder = this.handleFillOrder.bind(this);
		this.validateFillOrder = this.validateFillOrder.bind(this);
		this.handleRedirect = this.handleRedirect.bind(this);
	}

	async componentDidMount() {
		if (this.props.dharma && this.props.location.query) {
			this.getDebtOrderDetail(this.props.dharma, this.props.location.query);
		}
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.location.query) {
			this.getDebtOrderDetail(nextProps.dharma, nextProps.location.query);
		}
	}

	async getDebtOrderDetail(dharma: Dharma, urlParams: any) {
		try {
			const debtOrder = debtOrderFromJSON(JSON.stringify(urlParams));
			const description = debtOrder.description;
			const principalTokenSymbol = debtOrder.principalTokenSymbol;
			delete(debtOrder.description);
			delete(debtOrder.principalTokenSymbol);
			this.setState({ debtOrder, description, principalTokenSymbol });
			if (debtOrder.termsContract && debtOrder.termsContractParameters) {
				const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrder);
				const issuanceHash = await dharma.order.getIssuanceHash(debtOrder);
				this.setState({
					interestRate: fromDebtOrder.interestRate,
					termLength: fromDebtOrder.termLength,
					amortizationUnit: fromDebtOrder.amortizationUnit,
					issuanceHash: issuanceHash
				});
			}
		} catch (e) {
			// console.log(e);
		}
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	validateFillOrder() {
		const { debtOrder, principalTokenSymbol } = this.state;
		const { tokens } = this.props;
		const principalAmount = debtOrder.principalAmount || new BigNumber(0);
		if (principalAmount.eq(0)) {
			this.props.handleSetError('Invalid debt order');
			return;
		}

		this.props.handleSetError('');
		let found: boolean = false;
		let error: boolean = false;
		if (debtOrder.principalToken && tokens.length) {
			for (let token of tokens) {
				if (debtOrder.principalToken === token.address) {
					found = true;
					if (!token.tradingPermitted || token.balance.lt(principalAmount)) {
						error = true;
						break;
					}
				}
			}
		} else {
			error = true;
		}
		if (!found) {
			error = true;
		}
		if (error) {
			this.props.handleSetError(principalTokenSymbol + ' is currently disabled for trading');
			return;
		}
		this.confirmationModalToggle();
	}

	async handleFillOrder() {
		try {
			this.props.handleSetError('');
			const { dharma, accounts } = this.props;
			const { debtOrder, issuanceHash } = this.state;

			debtOrder.creditor = accounts[0];
			const txHash = await dharma.order.fillAsync(debtOrder, {from: accounts[0]});

			await dharma.blockchain.awaitTransactionMinedAsync(txHash, 1000, 60000);

			const errorLogs = await dharma.blockchain.getErrorLogs(txHash);

			if (errorLogs.length) {
				this.props.handleSetError(errorLogs[0]);
				this.setState({
					confirmationModal: false
				});
			} else {
				this.props.handleFillDebtOrder(issuanceHash);
				this.successModalToggle();
			}
		} catch (e) {
			this.props.handleSetError(e.message);
			this.setState({
				confirmationModal: false
			});
		}
	}

	successModalToggle() {
		this.setState({
			confirmationModal: false,
			successModal: !this.state.successModal
		});
	}

	handleRedirect() {
		browserHistory.push('/dashboard');
	}

	render() {
		const { debtOrder, description, interestRate, termLength, amortizationUnit, principalTokenSymbol, issuanceHash } = this.state;

		const leftInfoItems = [
			{title: 'Principal', content: (debtOrder.principalAmount ? debtOrder.principalAmount.toNumber() + ' ' + principalTokenSymbol : '')},
			{title: 'Term Length', content: (termLength && amortizationUnit ? termLength.toNumber() + ' ' + amortizationUnit : '-')}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: interestRate.toNumber() + '%'},
			{title: 'Installment Frequency', content: (amortizationUnit ? amortizationUnitToFrequency(amortizationUnit) : '-')}
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
				</Content>
			</InfoItem>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
				</Content>
			</InfoItem>
		));

		const confirmationModalContent = (
			<span>
				You will fill this debt order <Bold>{shortenString(issuanceHash)}</Bold>. This operation will debit <Bold>{debtOrder.principalAmount && debtOrder.principalAmount.toNumber()} {principalTokenSymbol}</Bold> from your account.
			</span>
		);
		const descriptionContent = (
			<span>
				Here are the details of loan request <Bold>{issuanceHash}</Bold>.
				If the terms look fair to you, fill the loan and your transaction will be completed.
			</span>
		);
		return (
			<PaperLayout>
				<MainWrapper>
					<Header title={'Fill a loan'} description={descriptionContent} />
					<LoanInfoContainer>
						<HalfCol>
							{leftInfoItemRows}
						</HalfCol>
						<HalfCol>
							{rightInfoItemRows}
						</HalfCol>
						<Col xs="12">
							<InfoItem>
								<Title>
									Description
								</Title>
								<Content>
									{description}
								</Content>
							</InfoItem>
						</Col>
					</LoanInfoContainer>
					<ButtonContainer>
						<Link to="/fill">
							<DeclineButton>Decline</DeclineButton>
						</Link>
						<FillLoanButton onClick={this.validateFillOrder}>Fill Loan</FillLoanButton>
					</ButtonContainer>
					<ConfirmationModal modal={this.state.confirmationModal} title="Please confirm" content={confirmationModalContent} onToggle={this.confirmationModalToggle} onSubmit={this.handleFillOrder} closeButtonText="Cancel" submitButtonText="Fill Order" />
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} issuanceHash={issuanceHash} onRedirect={this.handleRedirect} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
