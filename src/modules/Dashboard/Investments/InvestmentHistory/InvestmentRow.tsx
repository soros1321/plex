import * as React from 'react';
import { InvestmentEntity } from '../../../../models';
import { shortenString, amortizationUnitToFrequency } from '../../../../utils';
import { Row, Col, Collapse } from 'reactstrap';
import {
	StyledRow,
	Drawer,
	InfoItem,
	InfoItemTitle,
	InfoItemContent
} from './styledComponents';
import { TokenAmount } from 'src/components';

interface Props {
	investment: InvestmentEntity;
}

interface State {
	collapse: boolean;
}

class InvestmentRow extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			collapse: false
		};
		this.toggleDrawer = this.toggleDrawer.bind(this);
	}

	toggleDrawer() {
		this.setState({ collapse: !this.state.collapse });
	}

	render() {
		const { investment } = this.props;
		if (!investment) {
			return null;
		}
		return (
			<div onClick={this.toggleDrawer}>
				<StyledRow>
					<Col xs="3" md="2">
						<TokenAmount tokenAmount={investment.principalAmount} tokenSymbol={investment.principalTokenSymbol}/>
					</Col>
					<Col xs="3" md="2">
						{shortenString(investment.issuanceHash)}
					</Col>
					<Col xs="3" md="4">
						{investment.earnedAmount.gte(investment.principalAmount) ? 'Paid' : 'Delinquent'}
					</Col>
					<Col xs="3" md="4">
						Simple Interest Loan (Non-Collateralized)
					</Col>
				</StyledRow>
				<Collapse isOpen={this.state.collapse}>
					<Drawer>
						<Row>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Term Length
									</InfoItemTitle>
									<InfoItemContent>
										{investment.termLength.toNumber() + ' ' + investment.amortizationUnit}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="2">
								<InfoItem>
									<InfoItemTitle>
										Interest Rate
									</InfoItemTitle>
									<InfoItemContent>
										{investment.interestRate.toNumber() + '%'}
									</InfoItemContent>
								</InfoItem>
							</Col>
							<Col xs="12" md="3">
								<InfoItem>
									<InfoItemTitle>
										Installment Frequency
									</InfoItemTitle>
									<InfoItemContent>
										{amortizationUnitToFrequency(investment.amortizationUnit)}
									</InfoItemContent>
								</InfoItem>
							</Col>
						</Row>
					</Drawer>
				</Collapse>
			</div>
		);
	}
}

export { InvestmentRow };
