import styled from 'styled-components';
import { Label } from 'reactstrap';
import { Link } from 'react-router';

export const StyledLabel = styled(Label)`
	color: #002326;
	font-family: DIN;
	font-size: 17px;
	line-height: 25px;
	text-transform: none;
	opacity: 1;
`;

export const InputBorder = styled.div`
	border: 1px solid #1CC1CC;
	background-color: rgba(28,193,204,0.03);
	padding: 15px 20px;
`;

export const ButtonContainer = styled.div`
	margin-top: 30px;
`;

export const Instructions = styled.div`
	margin-top: 50px;
`;

export const Title = styled.div`
`;

export const StyledLink = styled(Link)`
	font-family: DIN-Bold;
	color: #002326;
	font-size: 15px;
	margin: 10px 0;
	display: block;
`;
