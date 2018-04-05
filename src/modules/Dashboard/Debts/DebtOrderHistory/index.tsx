import * as React from 'react';
import { DebtOrderEntity } from '../../../../models';
// import { formatDate } from '../../../../utils';
import { Col } from 'reactstrap';
import { DebtOrderRowContainer } from './DebtOrderRowContainer';
import {
	Wrapper,
	Title,
	TableHeaderRow
} from './styledComponents';

interface Props {
	debtOrders: DebtOrderEntity[];
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
						<DebtOrderRowContainer debtOrder={debtOrder} key={debtOrder.issuanceHash} />
					))
				}
			</Wrapper>
		);
	}
}

export { DebtOrderHistory };
