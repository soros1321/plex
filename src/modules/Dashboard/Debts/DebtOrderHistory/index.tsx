import * as React from 'react';
import { DebtOrderMoreDetail } from '../../../../models';
// import { formatDate } from '../../../../utils';
import { Col } from 'reactstrap';
import { DebtOrderRow } from './DebtOrderRow';
import {
	Wrapper,
	Title,
	TableHeaderRow
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderMoreDetail[];
}

class DebtOrderHistory extends React.Component<Props, {}> {
	render() {
		const { debtOrders } = this.props;
		return (
			<Wrapper>
				<Title>Past debts and loan request</Title>
				<TableHeaderRow>
					<Col xs="3" md="2">
						Amount
					</Col>
					<Col xs="3" md="2">
						ID
					</Col>
					<Col xs="3" md="4">
						Status
					</Col>
					<Col xs="3" md="4">
						Terms
					</Col>
				</TableHeaderRow>
				{
					debtOrders.map((debtOrder) => (
						<DebtOrderRow debtOrder={debtOrder} key={debtOrder.issuanceHash} />
					))
				}
			</Wrapper>
		);
	}
}

export { DebtOrderHistory };
