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
import Dharma from '@dharmaprotocol/dharma.js';

interface Props {
	dharma: Dharma;
	accounts: string[];
	handleSetError: (errorMessage: string) => void;
}

interface States {
	debtOrders: DebtOrderEntity[];
	investments: InvestmentEntity[];
	activeTab: string;
}

class Dashboard extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			debtOrders: [],
			investments: []
		};
	}

	async componentDidMount() {
		if (this.props.dharma && this.props.accounts) {
			await this.getDebtsAsync(this.props.dharma, this.props.accounts);
			await this.getInvestmentsAsync(this.props.dharma, this.props.accounts);
		}
	}

	async componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.accounts) {
			await this.getDebtsAsync(nextProps.dharma, nextProps.accounts);
			await this.getInvestmentsAsync(nextProps.dharma, nextProps.accounts);
		}
	}

	async getDebtsAsync(dharma: Dharma, accounts: string[]) {
		try {
			if (!accounts.length) {
				return;
			}
			const issuanceHashes = await dharma.servicing.getDebtsAsync(accounts[0]);
			let debtOrders: DebtOrderEntity[] = [];
			for (let issuanceHash of issuanceHashes) {

				const debtRegistry = await dharma.servicing.getDebtRegistryEntry(issuanceHash);
				const dharmaDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtRegistryEntry(debtRegistry);
				const repaidAmount = await dharma.servicing.getValueRepaid(issuanceHash);
				const repaymentSchedule = await dharma.adapters.simpleInterestLoan.getRepaymentSchedule(debtRegistry);
				const status = repaidAmount.lt(dharmaDebtOrder.principalAmount) ? 'active' : 'inactive';
				const debtOrder = {
					debtor: accounts[0],
					termsContract: debtRegistry.termsContract,
					termsContractParameters: debtRegistry.termsContractParameters,
					underwriter: debtRegistry.underwriter,
					underwriterRiskRating: debtRegistry.underwriterRiskRating,
					amortizationUnit: dharmaDebtOrder.amortizationUnit,
					interestRate: dharmaDebtOrder.interestRate,
					principalAmount: dharmaDebtOrder.principalAmount,
					principalTokenSymbol: dharmaDebtOrder.principalTokenSymbol,
					termLength: dharmaDebtOrder.termLength,
					issuanceHash,
					repaidAmount,
					repaymentSchedule,
					status,
					creditor: debtRegistry.beneficiary
				};
				debtOrders.push(debtOrder);
			}
			this.setState({ debtOrders });
		} catch (e) {
			this.props.handleSetError('Unable to get debts info');
		}
	}

	async getInvestmentsAsync(dharma: Dharma, accounts: string[]) {
		console.log('get investments');
	}

	toggle(tab: string) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		const { debtOrders, investments, activeTab } = this.state;
		const tabs = [
			{
				id: '1',
				titleFirstWord: 'Your ',
				titleRest: 'Debts (' + (debtOrders && debtOrders.length) + ')',
				content: <DebtsContainer debtOrders={debtOrders} />
			},
			{
				id: '2',
				titleFirstWord: 'Your ',
				titleRest: 'Investments (' + (investments && investments.length) + ')',
				content: <InvestmentsContainer investments={investments} />
			}
		];
		const tabNavs = tabs.map((tab) => (
			<StyledNavItem key={tab.id}>
				<NavLink
					className={activeTab === tab.id ? 'active' : ''}
					onClick={() => { this.toggle(tab.id); }}
				>
					<TitleFirstWord>
						{tab.titleFirstWord}
					</TitleFirstWord>
					<TitleRest>
						{tab.titleRest}
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
				<TabContent activeTab={activeTab}>
					{tabContents}
				</TabContent>
			</div>
		);
	}
}

export { Dashboard };
