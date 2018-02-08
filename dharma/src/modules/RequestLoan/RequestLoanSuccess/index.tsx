import * as React from 'react';
import { Header } from '../../../components';
import { GetNotified } from './GetNotified';
import { ShareRequestURL } from './ShareRequestURL';
import { RequestLoanSummary } from './RequestLoanSummary';

interface Props {
	requestURL: string;
	amount: string;
	description: string;
	principle: string;
	interest: string;
	repaymentDate: string;
	repaymentTerms: string;
	summaryJSON: string;
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
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
		this.handleShareSocial = this.handleShareSocial.bind(this);
	}

	handleEmailChange(email: string) {
		this.setState({email: email});
	}

	handleGetNotified() {
		console.log('Get Notified', this.state);
	}

	handleCopyClipboard() {
		console.log('Copy to clipboard');
	}

	handleShareSocial(socialMediaName: string) {
		console.log('Share social', socialMediaName);
	}

	render() {
		return (
			<div className="main-wrapper">
				<Header title={'Next, share your loan request with lenders'} description={'Get lenders to fill your loan request by directing them to your request URL.'} />
				<GetNotified email={this.state.email} onInputChange={this.handleEmailChange} onFormSubmit={this.handleGetNotified} />
				<ShareRequestURL requestURL={this.props.requestURL} onCopyClipboard={this.handleCopyClipboard} onShareSocial={this.handleShareSocial} />
				<RequestLoanSummary
					amount={this.props.amount}
					description={this.props.description}
					principle={this.props.principle}
					interest={this.props.interest}
					repaymentDate={this.props.repaymentDate}
					repaymentTerms={this.props.repaymentTerms}
					summaryJSON={this.props.summaryJSON}
					onCopyClipboard={this.handleCopyClipboard}
				/>
			</div>
		);
	}
}

export { RequestLoanSuccess };
