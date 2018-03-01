import styled from 'styled-components';
import { Table } from 'reactstrap';

export const Wrapper = styled.div`
	margin-top: 80px;
`;

export const Title = styled.div`
	color: #002326;
	font-size: 17px;
	line-height: 25px;
	margin-bottom: 20px;
`;

export const DebtOrderHistoryTable = styled(Table)`
	th {
		opacity: 0.5;
		color: #002326;
		font-size: 17px;
		line-height: 25px;
		text-transform: uppercase;
	}

	thead th {
		border-top: 0;
		border-bottom: 4px solid #F0F0F0;
	}

	td {
		border: 0;
	}

	@media only screen and (max-width: 480px) {
		font-size: 11px;

		th {
			font-size: 13px;
		}
	}
`;

export const Terms = styled.td`
	font-family: DIN-Bold;
	text-transform: uppercase;
`;
