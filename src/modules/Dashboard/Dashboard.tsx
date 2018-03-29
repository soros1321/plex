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
	filledDebtOrders: DebtOrderEntity[];
	pendingDebtOrders: DebtOrderEntity[];
	handleSetError: (errorMessage: string) => void;
	handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) => void;
}

interface States {
	investments: InvestmentEntity[];
	activeTab: string;
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

	async componentDidMount() {
		if (this.props.dharma && this.props.accounts) {
			await this.getDebtsAsync(this.props.dharma, this.props.accounts, this.props.pendingDebtOrders);
			await this.getInvestmentsAsync(this.props.dharma, this.props.accounts);
		}
	}

	async componentWillReceiveProps(nextProps: Props) {
		if (nextProps.dharma && nextProps.accounts) {
			await this.getDebtsAsync(nextProps.dharma, nextProps.accounts, nextProps.pendingDebtOrders);
			await this.getInvestmentsAsync(nextProps.dharma, nextProps.accounts);
		}
	}

	async getDebtsAsync(dharma: Dharma, accounts: string[], pendingDebtOrders: DebtOrderEntity[]) {
		try {
			if (!accounts.length) {
				return;
			}
			const issuanceHashes = await dharma.servicing.getDebtsAsync(accounts[0]);
			let filledDebtOrders: DebtOrderEntity[] = [];
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
				filledDebtOrders.push(debtOrder);
			}

			this.props.handleSetFilledDebtOrders(filledDebtOrders);
		} catch (e) {
			this.props.handleSetError('Unable to get debt orders info');
		}
	}

	async getInvestmentsAsync(dharma: Dharma, accounts: string[]) {
		try {
			if (!accounts.length) {
				return;
			}
			const issuanceHashes = await dharma.servicing.getInvestmentsAsync(accounts[0]);
			let investments: InvestmentEntity[] = [];
			for (let issuanceHash of issuanceHashes) {
				const debtRegistry = await dharma.servicing.getDebtRegistryEntry(issuanceHash);
				const dharmaDebtOrder = await dharma.adapters.simpleInterestLoan.fromDebtRegistryEntry(debtRegistry);
				const earnedAmount = await dharma.servicing.getValueRepaid(issuanceHash);
				const repaymentSchedule = await dharma.adapters.simpleInterestLoan.getRepaymentSchedule(debtRegistry);
				const status = earnedAmount.lt(dharmaDebtOrder.principalAmount) ? 'active' : 'inactive';
				const investment = {
					creditor: debtRegistry.beneficiary,
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
					earnedAmount,
					repaymentSchedule,
					status
				};
				investments.push(investment);
			}
			this.setState({ investments });
		} catch (e) {
			this.props.handleSetError('Unable to get investments info');
		}
	}

	toggle(tab: string) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		const debtOrders = this.props.pendingDebtOrders.concat(this.props.filledDebtOrders);

		const { investments, activeTab } = this.state;
		const tabs = [
			{
				id: '1',
				titleFirstWord: 'Your ',
				titleRest: 'Debts (' + (debtOrders && debtOrders.length) + ')',
				content: <DebtsContainer dharma={this.props.dharma} debtOrders={debtOrders} />
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
