import * as React from 'react';
import styled from 'styled-components';
import { Col } from 'reactstrap';
import { Link } from 'react-router';

interface Props {
	className?: string;
}

export const Wrapper = styled.div`
	background-color: #082C30;
	width: inherit;
	position: fixed;
	top: 0px;
	left: 0;
	bottom: 0;
	box-shadow: 0 12px 24px 0 rgba(0,0,0,0.35);

	@media only screen and (max-width: 480px) {
		background-color: #002326;
		margin-top: -1px;
		width: 100%;
		position: static !important;
		top: auto;
		left: auto;
		bottom: auto;
		box-shadow: none;
	}
`;

export const LogoContainer = styled.div`
	margin: 40px 0 50px;
	text-align: center;

	@media only screen and (max-width: 480px) {
		display: none;
	}
`;

export const BrandLogo = styled.img`
	width: 35px;
`;

class UglyCol extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="4" md="12">
				{this.props.children}
			</Col>
		);
	}
}

export const StyledCol = styled(UglyCol)`
`;

export const StyledLink = styled(Link)`
	text-transform: uppercase;
	font-size: 15px;
	color: #FFFFFF;
	font-weight: bold;
	line-height: 25px;
	opacity: 0.5;
	padding: 20px 25px !important;

	&:hover,
	&.active {
		color: #FFFFFF;
		background-color: #1E393C;
		border-left: 5px solid #F3764B;
		opacity: 1;
		padding: 20px 25px 20px 20px !important;
	}

	@media only screen and (max-width: 480px) {
		text-align: center;
		font-size: 13px;
		padding: 15px 0 !important;
		line-height: 20px;

		&:hover {
			border-left: 0;
			background-color: #002326;
			margin-left: 0px;
		}
		&.active {
			border-left: 0;
			background-color: #002326;
			border-bottom: 5px solid #F3764B;
			margin-left: 0px;
			padding: 15px 0 10px !important;
		}
	}
`;

export const TitleFirst = styled.span`
`;

export const TitleRest = styled.span`
	@media only screen and (max-width: 480px) {
		display: none;
	}
`;
