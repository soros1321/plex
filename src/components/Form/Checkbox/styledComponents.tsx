import styled from 'styled-components';
import { Label } from 'reactstrap';

export const Checkmark = styled.span`
	position: absolute;
	top: 4px;
	left: 0;
	height: 18px;
	width: 18px;
	background-color: #eee;

	&::after {
		content: "";
		position: absolute;
		display: none;
	}
`;

export const CheckboxLabel = styled(Label)`
	display: block;
	position: relative;
	padding-left: 30px;
	margin-bottom: 12px;
	cursor: pointer;
	font-family: DIN;
	font-size: 17px;
	text-transform: none;
	color: #002326;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	opacity: 1;

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}

	&:hover input ~ ${Checkmark} {
		background-color: #ccc;
	}

	input:checked ~ ${Checkmark} {
		background-color: #1CC1CC;
	}

	input:checked ~ ${Checkmark}:after {
		display: block;
	}

	${Checkmark}:after {
		left: 5px;
		top: 1px;
		width: 8px;
		height: 12px;
		border: solid white;
		border-width: 0 2px 2px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}
`;
