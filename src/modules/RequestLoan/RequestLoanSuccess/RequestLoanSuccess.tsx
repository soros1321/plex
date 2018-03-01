import * as React from 'react';
import { PaperLayout } from '../../../layouts';
import { Header, ScrollToTopOnMount, MainWrapper } from '../../../components';
// import { GetNotified } from './GetNotified';
import { ShareRequestURL } from './ShareRequestURL';
import { RequestLoanSummary } from './RequestLoanSummary';
import { DebtOrderEntity } from '../../../models';
import Dharma from '@dharmaprotocol/dharma.js';

interface Props {
	params?: any;
	debtOrder: DebtOrderEntity;
	getDebtOrder: (debtorSignature: string) => void;
	dharma: Dharma;
}

interface States {
	email: string;
	termLength: number | undefined;
	interestRate: number | undefined;
	amortizationUnit: string;
}

class RequestLoanSuccess extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);
		this.state = {
			email: '',
			termLength: undefined,
			interestRate: undefined,
			amortizationUnit: ''
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleGetNotified = this.handleGetNotified.bind(this);
		this.handleShareSocial = this.handleShareSocial.bind(this);
	}

	componentDidMount() {
		const debtorSignature = this.props.params.debtorSignature;
		this.props.getDebtOrder(debtorSignature);
	}

	async componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.debtOrder) {
			const { debtOrder , dharma } = nextProps;
			const dharmaDebtOrder = {
				principalAmount: debtOrder.principalAmount,
				principalToken: debtOrder.principalToken,
				termsContract: debtOrder.termsContract,
				termsContractParameters: debtOrder.termsContractParameters
			};
			if (dharmaDebtOrder.termsContract && dharmaDebtOrder.termsContractParameters) {
				const fromDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtOrder(dharmaDebtOrder);
				this.setState({
					termLength: fromDebtOrder.termLength.toNumber(),
					amortizationUnit: fromDebtOrder.amortizationUnit,
					interestRate: fromDebtOrder.interestRate.toNumber()
				});
			}
		}
	}

	handleEmailChange(email: string) {
		this.setState({email: email});
	}

	handleGetNotified() {
		console.log('Get Notified', this.state);
	}

	handleShareSocial(socialMediaName: string) {
		console.log('Share social', socialMediaName);
	}

	render() {
		if (!this.props.debtOrder) {
			return null;
		}
		// <GetNotified email={this.state.email} onInputChange={this.handleEmailChange} onFormSubmit={this.handleGetNotified} />
		const descriptionContent = <span>Get lenders to fill your loan request by directing them to your request URL.</span>;
		return (
			<PaperLayout>
				<MainWrapper>
					<ScrollToTopOnMount />
					<Header title={'Next, share your loan request with lenders'} description={descriptionContent} />
					<ShareRequestURL
						issuanceHash={this.props.debtOrder.issuanceHash}
						shortUrl={this.props.debtOrder.fillLoanShortUrl}
						onShareSocial={this.handleShareSocial}
					/>
					<RequestLoanSummary
						debtOrder={this.props.debtOrder}
						termLength={this.state.termLength}
						interestRate={this.state.interestRate}
						amortizationUnit={this.state.amortizationUnit}
					/>
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { RequestLoanSuccess };
