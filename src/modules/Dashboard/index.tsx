import * as React from 'react';
import { LoanEntity, InvestmentEntity } from '../../models';
import { loanAPI, investmentAPI } from '../../services';
import {
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap';
import { Debts } from './Debts';
import { Investments } from './Investments';
import './Dashboard.css';

interface States {
	activeTab: string;
	loans: LoanEntity[];
	investments: InvestmentEntity[];
}

class Dashboard extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			loans: [],
			investments: []
		};
	}

	componentDidMount() {
		loanAPI.fetchLoans().then((loans) => {
			this.setState({loans});
		});
		investmentAPI.fetchInvestments().then((investments) => {
			this.setState({investments});
		});
	}

	toggle(tab: string) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		const tabs = [
			{
				id: '1',
				title: 'Your Debts (' + (this.state.loans.length) + ')',
				content: <Debts loans={this.state.loans} />
			},
			{
				id: '2',
				title: 'Your Investments (' + (this.state.investments.length) + ')',
				content: <Investments investments={this.state.investments} />
			}
		];
		const tabNavs = tabs.map((tab) => (
			<NavItem key={tab.id}>
				<NavLink
					className={this.state.activeTab === tab.id ? 'active' : ''}
					onClick={() => { this.toggle(tab.id); }}
				>
					<span className="title-first">
						{tab.title.indexOf(' ') >= 0 ? tab.title.substr(0, tab.title.indexOf(' ')) : tab.title}
					</span>
					<span className="title-rest">
						{tab.title.indexOf(' ') >= 0 ? tab.title.substr(tab.title.indexOf(' ')) : ''}
					</span>
				</NavLink>
			</NavItem>
		));
		const tabContents = tabs.map((tab) => (
			<TabPane tabId={tab.id} key={tab.id}>
				{tab.content}
			</TabPane>
		));

		return (
			<div>
				<Nav tabs={true}>
					{tabNavs}
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					{tabContents}
				</TabContent>
			</div>
		);
	}
}

export { Dashboard };
