import * as React from "react";
import { InvestmentEntity } from "../../../../models";
import { shortenString, amortizationUnitToFrequency } from "../../../../utils";
import { Row, Col, Collapse } from "reactstrap";
import { StyledRow, Drawer, InfoItem, InfoItemTitle, InfoItemContent } from "./styledComponents";
import { TokenAmount } from "src/components";
import Dharma from "@dharmaprotocol/dharma.js";
import { BigNumber } from "bignumber.js";

interface Props {
    dharma: Dharma;
    investment: InvestmentEntity;
}

interface State {
    collapse: boolean;
    status: string;
}

class InvestmentRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            collapse: false,
            status: "",
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    async componentDidMount() {
        await this.determineStatus(this.props.dharma);
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.dharma !== prevProps.dharma) {
            await this.determineStatus(this.props.dharma);
        }
    }

    async determineStatus(dharma: Dharma) {
        const { investment } = this.props;
        if (!dharma || !investment) {
            return;
        }
        const earnedAmount = await dharma.servicing.getValueRepaid(investment.issuanceHash);
        const totalExpectedEarning = await dharma.servicing.getTotalExpectedRepayment(
            investment.issuanceHash,
        );
        this.setState({
            status: new BigNumber(earnedAmount).lt(new BigNumber(totalExpectedEarning))
                ? "Delinquent"
                : "Paid",
        });
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
                        <TokenAmount
                            tokenAmount={investment.principalAmount}
                            tokenSymbol={investment.principalTokenSymbol}
                        />
                    </Col>
                    <Col xs="3" md="2">
                        {shortenString(investment.issuanceHash)}
                    </Col>
                    <Col xs="3" md="4">
                        {this.state.status}
                    </Col>
                    <Col xs="3" md="4">
                        Simple Interest Loan (Non-Collateralized)
                    </Col>
                </StyledRow>
                <Collapse isOpen={this.state.collapse}>
                    <Drawer>
                        <Row>
                            <Col xs="6" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Term Length</InfoItemTitle>
                                    <InfoItemContent>
                                        {investment.termLength.toNumber() +
                                            " " +
                                            investment.amortizationUnit}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="6" md="2">
                                <InfoItem>
                                    <InfoItemTitle>Interest Rate</InfoItemTitle>
                                    <InfoItemContent>
                                        {investment.interestRate.toNumber() + "%"}
                                    </InfoItemContent>
                                </InfoItem>
                            </Col>
                            <Col xs="12" md="3">
                                <InfoItem>
                                    <InfoItemTitle>Installment Frequency</InfoItemTitle>
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
