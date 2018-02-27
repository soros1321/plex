import * as React from 'react';
import { PaperLayout } from '../../../layouts';
import { Header, ScrollToTopOnMount, MainWrapper } from '../../../components';
// import { GetNotified } from './GetNotified';
import { ShareRequestURL } from './ShareRequestURL';
import { RequestLoanSummary } from './RequestLoanSummary';
import { DebtOrderEntity } from '../../../models';

interface Props {
	params?: any;
	debtOrder: DebtOrderEntity;
	getDebtOrder: (debtorSignature: string) => void;
	requestURL: string;
}

interface States {
	email: string;
}

class RequestLoanSuccess extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);
		this.state = {
			email: ''
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleGetNotified = this.handleGetNotified.bind(this);
		this.handleShareSocial = this.handleShareSocial.bind(this);
	}

	componentDidMount() {
		const debtorSignature = this.props.params.debtorSignature;
		this.props.getDebtOrder(debtorSignature);
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
					<ShareRequestURL issuanceHash={this.props.debtOrder.issuanceHash} debtorSignature={this.props.debtOrder.debtorSignature} onShareSocial={this.handleShareSocial} />
					<RequestLoanSummary debtOrder={this.props.debtOrder} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { RequestLoanSuccess };
