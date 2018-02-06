import * as React from 'react';
import { Header } from '../../components';
import { GetNotified } from './GetNotified';

interface States {
	email: string;
}

class RequestLoanSuccess extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);
		this.state = {
			email: ''
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleGetNotified = this.handleGetNotified.bind(this);
	}

	handleEmailChange(email: string) {
		this.setState({email: email});
	}

	handleGetNotified() {
		console.log('Get Notified', this.state);
	}

	render() {
		return (
			<div>
				<Header title={'Next, share your loan request with lenders'} description={'Get lenders to fill your loan request by directing them to your request URL.'} />
				<GetNotified email={this.state.email} onInputChange={this.handleEmailChange} onFormSubmit={this.handleGetNotified} />
			</div>
		);
	}
}

export { RequestLoanSuccess };
