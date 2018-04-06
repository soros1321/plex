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

	@media only screen and (max-width: 568px) {
		margin: 20px 0 30px;
	}
	@media only screen and (max-width: 480px) {
		display: none;
	}
`;

export const BrandLogo = styled.img`
	width: 35px;

	@media only screen and (max-width: 568px) {
		width: 25px;
	}
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
	@media only screen and (max-width: 568px) {
		-ms-flex: 0 0 100% !important;
		flex: 0 0 100% !important;
		max-width: 100% !important;
	}
	@media only screen and (max-width: 480px) {
		-ms-flex: 0 0 33.33% !important;
		flex: 0 0 33.33% !important;
		max-width: 33.33% !important;
	}
`;

export const StyledLink = styled(Link)`
	font-family: DIN;
	text-transform: uppercase;
	letter-spacing: 1px;
	font-size: 14px;
	color: #FFFFFF;
	line-height: 25px;
	opacity: 0.5;
	padding: 20px 25px !important;

	&:hover,
	&.active {
		color: #FFFFFF;
		background-color: rgba(255,255, 255, 0.08);
		border-left: 5px solid #F3764B;
		opacity: 1;
		padding: 20px 25px 20px 20px !important;
	}

	@media only screen and (max-width: 568px) {
		font-size: 8px;
		line-height: 12px;
		padding: 10px 10px !important;

		&:hover,
		&.active {
			border-left: 3px solid #F3764B;
			padding: 10px 10px 10px 7px !important;
		}
	}

	@media only screen and (max-width: 480px) {
		text-align: center;
		font-size: 13px;
		padding: 13px 0 !important;
		line-height: 20px;

		&:hover {
			border-left: 0;
			background-color: #002326;
			margin-left: 0px;
			padding: 13px 0 13px !important;
		}
		&.active {
			border-left: 0;
			background-color: #002326;
			border-bottom: 5px solid #F3764B;
			margin-left: 0px;
			padding: 13px 0 8px !important;
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
