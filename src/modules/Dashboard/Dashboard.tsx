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
import { Wrapper, StyledNavItem, TitleFirstWord, TitleRest } from './styledComponents';
import Dharma from '@dharmaprotocol/dharma.js';
import { debtOrderFromJSON } from '../../utils';

interface Props {
	dharma: Dharma;
	accounts: string[];
	filledDebtOrders: DebtOrderEntity[];
	pendingDebtOrders: DebtOrderEntity[];
	handleSetError: (errorMessage: string) => void;
	handleSetFilledDebtOrders: (filledDebtOrders: DebtOrderEntity[]) => void;
	handleFillDebtOrder: (issuanceHash: string) => void;
}

interface States {
	investments: InvestmentEntity[];
	initiallyLoading: boolean;
	activeTab: string;
}

class Dashboard extends React.Component<Props, States> {
	constructor(props: Props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			investments: [],
			initiallyLoading: true,
		};
	}

	async componentDidMount() {
		if (this.props.dharma) {
			await this.getDebtsAsync(this.props.dharma);
			await this.getInvestmentsAsync(this.props.dharma);
			this.setState({ initiallyLoading: false });
		}
	}

	async componentDidUpdate(prevProps: Props) {
		if (this.props.dharma !== prevProps.dharma) {
			await this.getDebtsAsync(this.props.dharma);
			await this.getInvestmentsAsync(this.props.dharma);
			this.setState({ initiallyLoading: false });
		}
	}

	async getDebtsAsync(dharma: Dharma) {
		try {
			if (!dharma || !this.props.accounts || !this.props.accounts.length) {
				return;
			}
			const { accounts, pendingDebtOrders } = this.props;
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

			// Check whether any of the pending debt orders is filled
			// Then, we want to remove it from the list
			if (pendingDebtOrders) {
				for (let pendingDebtOrder of pendingDebtOrders) {
					if (issuanceHashes.indexOf(pendingDebtOrder.issuanceHash) >= 0) {
						this.props.handleFillDebtOrder(pendingDebtOrder.issuanceHash);
					}
				}
			}
		} catch (e) {
			// this.props.handleSetError('Unable to get debt orders info');
			this.props.handleSetError(e.message);
		}
	}

	async getInvestmentsAsync(dharma: Dharma) {
		try {
			if (!dharma || !this.props.accounts || !this.props.accounts.length) {
				return;
			}
			const { accounts } = this.props;
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
			// this.props.handleSetError('Unable to get investments info');
			this.props.handleSetError(e.message);
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
		const { pendingDebtOrders } = this.props;
		if (pendingDebtOrders) {
			for (const index of Object.keys(pendingDebtOrders)) {
				pendingDebtOrders[index] = debtOrderFromJSON(JSON.stringify(pendingDebtOrders[index]));
			}
		}

		const debtOrders = pendingDebtOrders.concat(this.props.filledDebtOrders);

		const { investments, activeTab, initiallyLoading } = this.state;
		const tabs = [
			{
				id: '1',
				titleFirstWord: 'Your ',
				titleRest: 'Debts (' + (debtOrders && debtOrders.length) + ')',
				content: <DebtsContainer dharma={this.props.dharma} debtOrders={debtOrders} initializing={initiallyLoading}/>
			},
			{
				id: '2',
				titleFirstWord: 'Your ',
				titleRest: 'Investments (' + (investments && investments.length) + ')',
				content: <InvestmentsContainer investments={investments} initializing={initiallyLoading}  />
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
			<Wrapper>
				<Nav tabs={true}>
					{tabNavs}
				</Nav>
				<TabContent activeTab={activeTab}>
					{tabContents}
				</TabContent>
			</Wrapper>
		);
	}
}

export { Dashboard };
