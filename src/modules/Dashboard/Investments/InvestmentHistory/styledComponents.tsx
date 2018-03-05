import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'reactstrap';

interface Props {
	className?: string;
}

// styles-components
export const Wrapper = styled.div`
	margin-top: 80px;
`;

export const Title = styled.div`
	color: #002326;
	font-size: 17px;
	line-height: 25px;
	margin-bottom: 20px;
`;

class UglyTable extends React.Component<Props, {}> {
	render() {
		return (
			<Table className={this.props.className} hover={true}>
				{this.props.children}
			</Table>
		);
	}
}

export const StyledTable = styled(UglyTable)`
	@media only screen and (max-width: 480px) {
		font-size: 11px !important;
	}
`;

export const TableHeaderCell = styled.th`
	opacity: 0.5;
	color: #002326;
	font-size: 17px;
	line-height: 25px;
	text-transform: uppercase;
	border-top: 0 !important;
	border-bottom: 4px solid #F0F0F0 !important;

	@media only screen and (max-width: 480px) {
		font-size: 13px !important;
	}
`;

export const TableCell = styled.td`
	border: 0 !important;
	font-size: 11px !important;
`;
export const TermsCell = TableCell.extend`
	font-family: DIN-Bold;
	text-transform: uppercase;
	font-size: 8px !important;
`;
