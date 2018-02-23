import styled from 'styled-components';
import { Row } from 'reactstrap';

export const Wrapper = styled.div`
	height: 100%;
`;

export const StyledRow = styled(Row)`
	min-height: 100%;
	@media only screen and (max-width: 480px) {
		min-height: auto;
	}
`;

export const LeftContainer = styled.div`
	float: left;
	width: 213px;

	@media only screen and (max-width: 480px) {
		width: 100%;
	}
`;

export const RightContainer = styled.div`
	float: left;
	width: -webkit-calc(100% - 213px) !important;
	width:    -moz-calc(100% - 213px) !important;
	width:         calc(100% - 213px) !important;
	min-height: 100%;

	@media only screen and (max-width: 480px) {
		width: 100% !important;
		min-height: auto;
	}
`;
