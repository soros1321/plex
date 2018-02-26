import * as React from 'react';
import {
	Row,
	Col,
	Label
} from 'reactstrap';
import { DebtOrderEntity } from '../../../../models';
import {
	Wrapper,
	StyledLabel,
	GrayContainer,
	InfoItem,
	Title,
	Content,
	SummaryJsonContainer,
	SummaryJsonInput,
	CopyButton
} from './styledComponents';

interface Props {
	debtOrder: DebtOrderEntity;
	onCopyClipboard: () => void;
}

class RequestLoanSummary extends React.Component<Props, {}> {
	constructor (props: Props) {
		super(props);
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
	}

	handleCopyClipboard() {
		this.props.onCopyClipboard();
	}

	render() {
		const { debtOrder } = this.props;
		let installmentFrequency: string = '';
		switch (debtOrder.amortizationUnit) {
			case 'hours':
				installmentFrequency = 'Hourly';
				break;
			case 'days':
				installmentFrequency = 'Daily';
				break;
			case 'weeks':
				installmentFrequency = 'Weekly';
				break;
			case 'months':
				installmentFrequency = 'Monthly';
				break;
			case 'years':
				installmentFrequency = 'Yearly';
				break;
			default:
				break;
		}

		const leftInfoItems = [
			{title: 'Principal', content: debtOrder.principalAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol},
			{title: 'Term Length', content: debtOrder.termLength.toNumber() + ' ' + debtOrder.amortizationUnit},
			{title: 'Description', content: debtOrder.description}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: debtOrder.interestRate.toNumber() + '%'},
			{title: 'Installment Frequency', content: installmentFrequency},
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content || 'Some Content'}
				</Content>
			</InfoItem>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content || 'Some Content'}
				</Content>
			</InfoItem>
		));

		return (
			<Wrapper>
				<StyledLabel>Loan request summary</StyledLabel>
				<GrayContainer>
					<Row>
						<Col xs="12" md="6">
							{leftInfoItemRows}
						</Col>
						<Col xs="12" md="6">
							{rightInfoItemRows}
						</Col>
					</Row>
					<SummaryJsonContainer>
						<Label>JSON</Label>
						<SummaryJsonInput type="textarea" value={JSON.stringify(debtOrder)} readOnly={true} />
						<CopyButton className="button" onClick={this.handleCopyClipboard}>Copy</CopyButton>
					</SummaryJsonContainer>
				</GrayContainer>
			</Wrapper>
		);
	}
}

export { RequestLoanSummary };
