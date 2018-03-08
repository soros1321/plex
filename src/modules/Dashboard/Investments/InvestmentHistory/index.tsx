import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
/*
import { formatDate, shortenString } from '../../../../utils';
import {
	Wrapper,
	Title,
	StyledTable,
	TableHeaderCell,
	TableCell,
	TermsCell
} from './styledComponents';
*/

interface Props {
	investments: InvestmentEntity[];
}

class InvestmentHistory extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
		this.determineStatus = this.determineStatus.bind(this);
	}

	determineStatus(investment: InvestmentEntity): string {
		return '';
		/*
		let investmentStatus: string = '-';
		if (investment.defaulted && investment.collected) {
			investmentStatus = 'Delinquent ' + formatDate(investment.defaultedOnTimestamp) + ', Collected ' + formatDate(investment.collectedOnTimestamp);
		} else if (investment.paid) {
			investmentStatus = 'Repaid ' + formatDate(investment.paidOnTimestamp);
		}
		return investmentStatus;
		*/
	}

	render() {
		return null;
		/*
		return (
			<Wrapper>
				<Title>Past debts and investment request</Title>
				<StyledTable>
					<thead>
						<tr>
							<TableHeaderCell>Amount</TableHeaderCell>
							<TableHeaderCell>ID</TableHeaderCell>
							<TableHeaderCell>Status</TableHeaderCell>
							<TableHeaderCell>Terms</TableHeaderCell>
						</tr>
					</thead>
					<tbody>
						{this.props.investments.map((investment) => (
							<tr key={investment.id}>
								<TableCell>{investment.amountLended} {investment.currency}</TableCell>
								<TableCell>{shortenString(investment.id)}</TableCell>
								<TableCell>{this.determineStatus(investment)}</TableCell>
								<TermsCell className="terms">{investment.terms} Interest{investment.installments ? ' (Installments)' : ''}</TermsCell>
							</tr>
						))
						}
					</tbody>
				</StyledTable>
			</Wrapper>
		);
		*/
	}
}

export { InvestmentHistory };
