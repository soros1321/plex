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
	getPendingDebtOrder: (issuanceHash: string) => void;
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
		const issuanceHash = this.props.params.issuanceHash;
		this.props.getPendingDebtOrder(issuanceHash);
	}

	handleEmailChange(email: string) {
		this.setState({email: email});
	}

	handleGetNotified() {
		console.log('Get Notified', this.state);
	}

	handleShareSocial(socialMediaName: string) {
		const { fillLoanShortUrl, description, principalAmount, principalTokenSymbol } = this.props.debtOrder;

		if (!fillLoanShortUrl) {
			return;
		}

		let text = `I'd like to borrow ${principalAmount} ${principalTokenSymbol}`;

		if (description) {
            text += `for ${description}`;
		}

		if (socialMediaName === 'twitter') {
			const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fillLoanShortUrl)}&text=${text}`;
			const windowProps = 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0';

			window.open(url, '', windowProps);
        }
	}

	render() {
		const { debtOrder } = this.props;
		if (!debtOrder) {
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
						issuanceHash={debtOrder.issuanceHash}
						shortUrl={debtOrder.fillLoanShortUrl || ''}
						onShareSocial={this.handleShareSocial}
					/>
					<RequestLoanSummary debtOrder={debtOrder} />
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { RequestLoanSuccess };
