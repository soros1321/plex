import * as React from 'react';
import {
	Row,
	Col,
	Label
} from 'reactstrap';
import { DebtOrderEntity } from '../../../../models';
import { amortizationUnitToFrequency } from '../../../../utils';
import {
	Wrapper,
	StyledLabel,
	GrayContainer,
	InfoItem,
	Title,
	Content,
	SummaryJsonContainer,
	StyledTextarea,
	CopyButton,
	CopiedMessage
} from './styledComponents';

interface Props {
	debtOrder: DebtOrderEntity;
	termLength: number | undefined;
	interestRate: number | undefined;
	amortizationUnit: string;
}

interface State {
	copied: boolean;
}

class RequestLoanSummary extends React.Component<Props, State> {
	private summaryTextarea: HTMLTextAreaElement | null;

	constructor (props: Props) {
		super(props);
		this.state = {
			copied: false
		};
		this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
	}

	handleCopyClipboard() {
		this.summaryTextarea!.select();
		document.execCommand('copy');
		this.summaryTextarea!.focus();
		this.setState({ copied: true });
	}

	render() {
		const { debtOrder, termLength, interestRate, amortizationUnit } = this.props;
		const leftInfoItems = [
			{title: 'Principal', content: debtOrder.principalAmount.toNumber() + ' ' + debtOrder.principalTokenSymbol},
			{title: 'Term Length', content: (termLength && amortizationUnit ? termLength + ' ' + amortizationUnit : '-')}
		];
		const rightInfoItems = [
			{title: 'Interest Rate', content: (interestRate ? interestRate + '%' : '-')},
			{title: 'Installment Frequency', content: (amortizationUnit ? amortizationUnitToFrequency(amortizationUnit) : '-')}
		];
		const leftInfoItemRows = leftInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
				</Content>
			</InfoItem>
		));
		const rightInfoItemRows = rightInfoItems.map((item) => (
			<InfoItem key={item.title}>
				<Title>
					{item.title}
				</Title>
				<Content>
					{item.content}
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
						<Col xs="12">
							<InfoItem>
								<Title>
									Description
								</Title>
								<Content>
									{debtOrder.description}
								</Content>
							</InfoItem>
						</Col>
					</Row>
					<SummaryJsonContainer>
						<Label>JSON</Label>
						<StyledTextarea
							value={JSON.stringify(debtOrder)}
							readOnly={true}
							innerRef={(textarea: HTMLTextAreaElement) => { this.summaryTextarea = textarea; }}
						/>
						<CopiedMessage>{this.state.copied ? 'Copied!' : ''}</CopiedMessage>
						<CopyButton onClick={this.handleCopyClipboard}>Copy</CopyButton>
					</SummaryJsonContainer>
				</GrayContainer>
			</Wrapper>
		);
	}
}

export { RequestLoanSummary };
