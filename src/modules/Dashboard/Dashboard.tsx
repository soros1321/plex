import * as React from 'react';
import { DebtOrderEntity, InvestmentEntity } from '../../models';
import { investmentAPI } from '../../services';
import {
	Nav,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap';
import { Debts } from './Debts';
import { Investments } from './Investments';
import { StyledNavItem, TitleFirstWord, TitleRest } from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
}

interface States {
	activeTab: string;
	investments: InvestmentEntity[];
}

class Dashboard extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			investments: []
		};
	}

	componentDidMount() {
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
				title: 'Your Debts (' + (this.props.debtOrders.length) + ')',
				content: <Debts debtOrders={this.props.debtOrders} />
			},
			{
				id: '2',
				title: 'Your Investments (' + (this.state.investments.length) + ')',
				content: <Investments investments={this.state.investments} />
			}
		];
		const tabNavs = tabs.map((tab) => (
			<StyledNavItem key={tab.id}>
				<NavLink
					className={this.state.activeTab === tab.id ? 'active' : ''}
					onClick={() => { this.toggle(tab.id); }}
				>
					<TitleFirstWord>
						{tab.title.indexOf(' ') >= 0 ? tab.title.substr(0, tab.title.indexOf(' ')) : tab.title}
					</TitleFirstWord>
					<TitleRest>
						{tab.title.indexOf(' ') >= 0 ? tab.title.substr(tab.title.indexOf(' ')) : ''}
					</TitleRest>
				</NavLink>
			</StyledNavItem>
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
