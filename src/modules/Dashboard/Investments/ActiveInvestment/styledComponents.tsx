import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'reactstrap';

interface Props {
	className?: string;
}

// styles-components
export const Wrapper = styled(Row)`
	margin: 20px 0px;
	background-color: #FFFFFF;
	box-shadow: 0 12px 24px 0 rgba(0,0,0,0.12);
`;

class UglyImageContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="4" md="1">
				{this.props.children}
			</Col>
		);
	}
}

export const ImageContainer = styled(UglyImageContainer)`
	padding: 15px 0 15px 15px !important;
`;

export const Image = styled.div`
	height: 60px;
	width: inherit;
	background-color: #082C30;
`;

class UglyDetailContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="8" md="5">
				{this.props.children}
			</Col>
		);
	}
}

export const DetailContainer = styled(UglyDetailContainer)`
	padding: 15px !important;
`;

class HalfCol extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="12" md="6">
				{this.props.children}
			</Col>
		);
	}
}
export { HalfCol };

export const Amount = styled.div`
	color: #002326;
	font-family: DIN-Bold;
	font-size: 17px;
	line-height: 25px;
`;

export const Url = styled.a`
	color: #002326;
	font-size: 15px;
	line-height: 25px;
`;

export const CollectButton = styled.button`
	background-color: #E93D59 !important;
	border: 1px #E93D59 !important;
	min-width: auto !important;
	padding: 2px 15px !important;
	float: right;
`;

export const StatusActive = styled.div`
	display: inline-block;
	color: #FFFFFF;
	font-size: 12px;
	letter-spacing: 1px;
	line-height: 16px;
	border-radius: 12.5px;
	background-color: #1CC1CC;
	text-transform: uppercase;
	padding: 2px 10px;
	margin-right: 10px;
`;

export const StatusDefaulted = StatusActive.extend`
	background-color: #E93D59;
`;

export const Terms = styled.div`
	display: inline-block;
	font-family: DIN-Bold;
	font-size: 13px;
	line-height: 16px;
	text-transform: uppercase;
`;

export const RepaymentScheduleContainer = styled(HalfCol)`
	padding: 15px 30px !important;
	background-color: #082C30;
	color: #FFFFFF;
`;

export const Title = styled.div`
	color: #FFFFFF;
	font-size: 13px;
	line-height: 25px;
	text-transform: uppercase;
`;

export const Schedule = styled.div`
	display: inline-block;
	width: 85px;
	opacity: 0.5;

	&:last-child > div:nth-child(2) {
		opacity: 0;
	}

	@media only screen and (max-width: 480px) {
		width: 56px;
	}
`;

export const ScheduleIconContainer = styled.div`
	display: inline-block;
	&:last-child {
		opacity: 0;
	}
`;

export const ScheduleIcon = styled.img`
	width: 15px;
	@media only screen and (max-width: 480px) {
		width: 10px;
	}
`;

export const Strikethrough = styled.div`
	position: relative;
	display: inline-block;
	opacity: 0.5;

	&:before {
		content: " ";
		position: absolute;
		top: -4px;
		left: 0;
		border-bottom: 1px solid #FFFFFF;
		width: 70px;
	}

	@media only screen and (max-width: 480px) {
		&:before {
			top: -5px;
			width: 46px;
		}
	}

`;

export const PaymentDate = styled.div`
	color: #FFFFFF;
	font-size: 13px;
	line-height: 25px;
	@media only screen and (max-width: 480px) {
		font-size: 11px;
	}
`;

export const ShowMore = PaymentDate.extend`
	text-transform: uppercase;
`;
