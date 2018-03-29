import * as React from 'react';
import { PageLayout } from './layouts';
import { ToastContainer } from './components';
import * as Web3 from 'web3';
const promisify = require('tiny-promisify');

interface Props {
	web3: Web3;
	accounts: string[];
}

interface State {
	intervalId: any;
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			intervalId: undefined
		};
	}

	componentDidMount() {
		const intervalId = setInterval(
			() => this.checkAccount(this.props.web3, this.props.accounts),
			1000
		);
		this.setState({ intervalId });
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (nextProps.web3 && nextProps.accounts) {
			this.checkAccount(nextProps.web3, nextProps.accounts);
		}
	}

	async checkAccount(web3: Web3, accounts: string[]) {
		if (!web3 || !accounts) {
			return;
		}
		const latestAccounts = await promisify(web3.eth.getAccounts)();
		if (latestAccounts.length && accounts.length && latestAccounts[0] !== accounts[0]) {
			window.location.reload();
		}
	}

	render() {
		return (
			<PageLayout>
				<ToastContainer />
				{this.props.children}
			</PageLayout>
		);
	}
}

export { App };
