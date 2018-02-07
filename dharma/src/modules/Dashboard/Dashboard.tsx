import * as React from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap';

interface Props {
	numDebts: number;
	numInvestments: number;
}

interface States {
	activeTab: string;
}

class Dashboard extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1'
		};
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
			{id: '1', title: 'Your Debts (' + this.props.numDebts + ')', content: ''},
			{id: '2', title: 'Your Investments (' + this.props.numDebts + ')', content: ''}
		];
		const tabNavs = tabs.map((tab) => (
			<NavItem key={tab.id}>
				<NavLink
					className={this.state.activeTab === tab.id ? 'active' : ''}
					onClick={() => { this.toggle(tab.id); }}
				>
					{tab.title}
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
