import * as React from 'react';
import {
	Row,
	Col,
	Label
} from 'reactstrap';
import { DebtOrderEntity } from '../../../../models';
import { amortizationUnitToFrequency, debtOrderFromJSON, normalizeDebtOrder } from '../../../../utils';
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
import { TokenAmount } from 'src/components';

interface Props {
	debtOrder: DebtOrderEntity;
}

interface State {
	copied: boolean;
}

class RequestLoanSummary extends React.Component<Props, State> {
	private summaryTextarea: HTMLTextAreaElement;

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
		const { debtOrder } = this.props;
		if (!debtOrder.json) {
			return null;
		}
		const debtOrderInfo = debtOrderFromJSON(debtOrder.json);
		const summaryJSON = {
			...debtOrderInfo,
			description: debtOrder.description,
			principalTokenSymbol: debtOrder.principalTokenSymbol
		};
		const termLength = `${debtOrder.termLength.toNumber()} ${debtOrder.amortizationUnit}`;
		const interestRate = `${debtOrder.interestRate.toNumber()}%`;
		const installmentFrequency = amortizationUnitToFrequency(debtOrder.amortizationUnit);

		return (
			<Wrapper>
				<StyledLabel>Loan request summary</StyledLabel>
				<GrayContainer>
					<Row>
						<Col xs="12" md="6">
							<InfoItem>
								<Title>
									Principal
								</Title>
								<Content>
									<TokenAmount tokenAmount={debtOrder.principalAmount} tokenSymbol={debtOrder.principalTokenSymbol}/>
								</Content>
							</InfoItem>
							<InfoItem>
								<Title>
									Term Length
								</Title>
								<Content>
									{termLength}
								</Content>
							</InfoItem>
						</Col>
						<Col xs="12" md="6">
							<InfoItem>
								<Title>
									Interest Rate
								</Title>
								<Content>
									{interestRate}
								</Content>
							</InfoItem>
							<InfoItem>
								<Title>
									Installment Frequency
								</Title>
								<Content>
									{installmentFrequency}
								</Content>
							</InfoItem>
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
							value={JSON.stringify(normalizeDebtOrder(summaryJSON))}
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
