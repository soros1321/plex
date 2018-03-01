import styled from 'styled-components';
import { Button } from 'reactstrap';

// styles-components
export const MainWrapper = styled.div`
	padding: 50px;
	@media only screen and (max-width: 480px) {
		padding: 15px;
	}
`;

// styles-components
export const Code = styled.code`
	margin: 30px 0px;
	font-size: 13px;
`;

export const StyledButton = styled(Button)`
	color: #FFFFFF !important;
	font-family: DIN;
	font-size: 15px !important;
	line-height: 40px !important;
	padding: 2px 45px !important;
	background-color: #1CC1CC !important;
	border: 1px solid #1CC1CC !important;
	border-radius: 0 !important;
	text-transform: uppercase;
	min-width: 200px !important;
`;

export const Wrapper30 = styled.div`
	margin: 30px 0px;
`;

export const Bold = styled.span`
	font-family: DIN-Bold;
`;
