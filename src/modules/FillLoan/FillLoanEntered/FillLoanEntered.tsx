import * as React from 'react';
import { Link } from 'react-router';
import { amortizationUnitToFrequency, shortenString } from '../../../utils';
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

interface DebtOrderWithDescription extends DebtOrder {
	description?: string;
}

interface Props {
	location?: any;
	web3: Web3;
	accounts: string[];
	dharma: Dharma;
	tokens: TokenEntity[];
	handleSetError: (errorMessage: string) => void;
}

interface States {
	confirmationModal: boolean;
	successModal: boolean;
	debtOrderWithDescription: DebtOrderWithDescription;
	interestRate: BigNumber | undefined;
	termLength: BigNumber | undefined;
	amortizationUnit: string;
	principalTokenSymbol: string;
}

class FillLoanEntered extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.state = {
			confirmationModal: false,
			successModal: false,
			debtOrderWithDescription: {},
			interestRate: undefined,
			termLength: undefined,
			amortizationUnit: '',
			principalTokenSymbol: ''
		};
		this.confirmationModalToggle = this.confirmationModalToggle.bind(this);
		this.successModalToggle = this.successModalToggle.bind(this);
		this.handleFillOrder = this.handleFillOrder.bind(this);
		this.validateFillOrder = this.validateFillOrder.bind(this);
		this.getDebtOrderDetail(this.props.dharma, this.props.location.query);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.location.query) {
			this.getDebtOrderDetail(nextProps.dharma, nextProps.location.query);
		}
	}

	async getDebtOrderDetail(dharma: Dharma, urlParams: any) {
		try {
			if (!dharma || !urlParams) {
				return;
			}
			let debtOrderWithDescription: DebtOrderWithDescription = {
				principalAmount: new BigNumber(urlParams.principalAmount),
				principalToken: urlParams.principalToken,
				termsContract: urlParams.termsContract,
				termsContractParameters: urlParams.termsContractParameters,
				debtorSignature: JSON.parse(urlParams.debtorSignature),
				debtor: urlParams.debtor,
				description: urlParams.description
			};
			this.setState({
				debtOrderWithDescription: debtOrderWithDescription,
				principalTokenSymbol: urlParams.principalTokenSymbol
			});

			if (debtOrderWithDescription.termsContract && debtOrderWithDescription.termsContractParameters) {
				const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(debtOrderWithDescription);
				this.setState({
					interestRate: fromDebtOrder.interestRate,
					termLength: fromDebtOrder.termLength,
					amortizationUnit: fromDebtOrder.amortizationUnit
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	confirmationModalToggle() {
		this.setState({
			confirmationModal: !this.state.confirmationModal
		});
	}

	validateFillOrder() {
		const { debtOrderWithDescription } = this.state;
		const { tokens } = this.props;

		this.props.handleSetError('');
		if (debtOrderWithDescription.principalToken && tokens.length) {
			for (let token of tokens) {
				if (debtOrderWithDescription.principalToken === token.address && !token.tradingPermitted) {
					this.props.handleSetError(token.tokenSymbol + ' is currently disabled for trading');
					return;
				}
			}
		}

		this.confirmationModalToggle();
	}

	async handleFillOrder() {
		try {
			this.props.handleSetError('');
			const { dharma, accounts } = this.props;
			const { debtOrderWithDescription } = this.state;

			debtOrderWithDescription.creditor = accounts[0];
			const response = await dharma.order.fillAsync(debtOrderWithDescription);

			console.log(response);
			this.successModalToggle();
		} catch (e) {
			this.props.handleSetError('Unable to fill this Debt Order');
			this.setState({
				confirmationModal: false
			});
			console.log(e);
			return;
		}
	}

	successModalToggle() {
		this.setState({
			confirmationModal: false,
			successModal: !this.state.successModal
		});
	}

	render() {
		const { debtOrderWithDescription: debtOrder, interestRate, termLength, amortizationUnit, principalTokenSymbol } = this.state;
		if (!debtOrder) {
			return null;
		}

		const leftInfoItems = [
			{title: 'Principal', content: (debtOrder.principalAmount ? debtOrder.principalAmount.toNumber() + ' ' + principalTokenSymbol : '')},
			{title: 'Term Length', content: (termLength && amortizationUnit ? termLength.toNumber() + ' ' + amortizationUnit : '-')}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: (interestRate ? interestRate.toNumber() + '%' : '-')},
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
				You will fill this debt order <Bold>{debtOrder.debtorSignature && shortenString(debtOrder.debtorSignature.r)}</Bold>. This operation will debit <Bold>{debtOrder.principalAmount && debtOrder.principalAmount.toNumber()} {principalTokenSymbol}</Bold> from your account.
			</span>
		);
		const descriptionContent = (
			<span>
				Here are the details of loan request <Bold>{debtOrder.debtorSignature && debtOrder.debtorSignature.r}</Bold>. If the terms look fair to you, fill the loan and Dharma will //insert statement.
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
									{debtOrder && debtOrder.description}
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
					<SuccessModal modal={this.state.successModal} onToggle={this.successModalToggle} debtorSignature={debtOrder.debtorSignature ? debtOrder.debtorSignature.r : ''} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { FillLoanEntered };
