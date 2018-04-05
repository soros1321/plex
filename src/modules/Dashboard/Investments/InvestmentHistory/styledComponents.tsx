import styled from 'styled-components';
import { Row } from 'reactstrap';

export const Wrapper = styled.div`
	margin-top: 80px;

	@media only screen and (max-width: 480px) {
		margin-top: 40px;
	}
`;

export const Title = styled.div`
	color: #002326;
	font-size: 17px;
	line-height: 25px;
	margin-bottom: 20px;
`;

export const TableHeaderRow = styled(Row)`
	text-transform: uppercase;
	border-bottom: 4px solid #DDDDDD;
	opacity: 0.5;
	color: #002326;
	font-family: DIN-Bold;
	font-size: 15px;
	line-height: 25px;
	padding-bottom: 8px;

	@media only screen and (max-width: 480px) {
		font-size: 13px;
	}
`;

export const StyledRow = styled(Row)`
	color: #002326;
	font-family: DIN;
	font-size: 17px;
	line-height: 25px;
	padding: 15px 0px;
	cursor: pointer;

	@media only screen and (max-width: 480px) {
		font-size: 11px;
		padding: 8px 0px;
	}
`;

export const Drawer = styled.div`
	padding: 20px;
	background-color: #F5F5F5;

	@media only screen and (max-width: 480px) {
		padding: 10px;
	}
`;

export const InfoItem = styled.div`
	@media only screen and (max-width: 480px) {
		margin-bottom: 5px;
	}
`;

export const InfoItemTitle = styled.div`
	text-transform: uppercase;
	font-family: DIN-Bold;
	opacity: 0.5;
	color: #002326;
	font-size: 13px;
	line-height: 20px;
`;

export const InfoItemContent = styled.div`
	margin-top: 5px;
	font-family: DIN-Bold;
	opacity: 1;
	color: #002326;
	font-size: 13px;
	line-height: 20px;
	word-wrap: break-word;
`;
