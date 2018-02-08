import * as React from 'react';
import { LoanEntity } from '../../models';
import { loanAPI } from '../../services/loan';
import {
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap';
import { Debts } from './Debts';
import './Dashboard.css';

interface States {
	activeTab: string;
	loans: LoanEntity[];
	numDebts: number;
	numInvestments: number;
	totalRequested: number;
	totalRepayed: number;
}

class Dashboard extends React.Component<{}, States> {
	constructor(props: {}) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			loans: [],
			numDebts: 0,
			numInvestments: 0,
			totalRequested: 0,
			totalRepayed: 0
		};
	}

	componentDidMount() {
		loanAPI.fetchLoans().then((loans) => {
			this.setState({loans});
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
				title: 'Your Debts (' + (this.state.numDebts) + ')',
				content: <Debts totalRequested={this.state.totalRequested} totalRepayed={this.state.totalRepayed} loans={this.state.loans} />
			},
			{
				id: '2',
				title: 'Your Investments (' + (this.state.numInvestments) + ')',
				content: ''
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
