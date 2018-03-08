import * as React from 'react';
import { DebtOrderEntity, InvestmentEntity } from '../../models';
import {
	Nav,
	NavLink,
	TabContent,
	TabPane
} from 'reactstrap';
import { DebtsContainer } from './Debts/DebtsContainer';
import { InvestmentsContainer } from './Investments/InvestmentsContainer';
import { StyledNavItem, TitleFirstWord, TitleRest } from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
	investments: InvestmentEntity[];
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
			{
				id: '1',
				title: 'Your Debts (' + (this.props.debtOrders && this.props.debtOrders.length) + ')',
				content: <DebtsContainer debtOrders={this.props.debtOrders} />
			},
			{
				id: '2',
				title: 'Your Investments (' + (this.props.investments && this.props.investments.length) + ')',
				content: <InvestmentsContainer investments={this.props.investments} />
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
