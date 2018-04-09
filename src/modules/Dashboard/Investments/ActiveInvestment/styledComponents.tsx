import * as React from 'react';
import styled from 'styled-components';
import { Col } from 'reactstrap';
import { StyledLink, StyledButton } from '../../../../components';

interface Props {
	className?: string;
}

// styles-components
export const Wrapper = styled.div`
	margin-bottom: 20px;
	background-color: #FFFFFF;
	box-shadow: 0 12px 24px 0 rgba(0,0,0,0.12);
	cursor: pointer;
`;

class UglyImageContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="3" md="1">
				{this.props.children}
			</Col>
		);
	}
}

export const ImageContainer = styled(UglyImageContainer)`
	padding: 15px 0 15px 15px !important;

	@media only screen and (max-width: 823px) {
		padding: 10px 0 10px 10px !important;
	}
	@media only screen and (max-width: 568px) {
		padding: 10px 0 10px 10px !important;
	}
`;

export const IdenticonImage = styled.img`
	width: 60px;
	height: 60px;

	@media only screen and (max-width: 823px) {
		width: 40px;
		height: 40px;
	}
	@media only screen and (max-width: 568px) {
		width: 80px;
		height: 80px;
	}
	@media only screen and (max-width: 480px) {
		width: 60px;
		height: 60px;
	}
`;

class UglyDetailContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="9" md="5">
				{this.props.children}
			</Col>
		);
	}
}

export const DetailContainer = styled(UglyDetailContainer)`
	padding: 15px !important;

	@media only screen and (max-width: 823px) {
		padding: 10px !important;
	}
	@media only screen and (max-width: 568px) {
		padding: 10px !important;
	}
`;

export const Amount = styled.div`
	color: #002326;
	font-family: DIN-Bold;
	font-size: 17px;
	line-height: 25px;

	@media only screen and (max-width: 823px) {
		font-size: 14px;
		line-height: 22px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 14px;
		line-height: 22px;
	}
`;

export const Url = styled.div`
	color: #002326;
	font-size: 15px;
	line-height: 25px;

	@media only screen and (max-width: 823px) {
		font-size: 10px;
		line-height: 18px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 10px;
		line-height: 18px;
	}
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

	@media only screen and (max-width: 823px) {
		font-size: 8px;
		line-height: 12px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 8px;
		line-height: 12px;
	}
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

	@media only screen and (max-width: 823px) {
		font-size: 8px;
		line-height: 16px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 8px;
		line-height: 16px;
	}
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

export const RepaymentScheduleContainer = styled(HalfCol)`
	padding: 15px 30px !important;
	background-color: #082C30;
	color: #FFFFFF;
	display: block;

	@media only screen and (max-width: 823px) {
		padding: 10px !important;
	}
	@media only screen and (max-width: 568px) {
		padding: 10px !important;
	}
`;

export const Title = styled.div`
	color: #FFFFFF;
	font-size: 13px;
	line-height: 25px;
	text-transform: uppercase;

	@media only screen and (max-width: 823px) {
		font-size: 10px;
		line-height: 18px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 10px;
		line-height: 18px;
	}
`;

export const Strikethrough = styled.div`
	position: relative;
	display: inline-block;
	opacity: 0.5;

	&::before {
		content: " ";
		position: absolute;
		top: -4px;
		left: 0;
		border-bottom: 1px solid #FFFFFF;
		width: 65px;
	}

	@media only screen and (max-width: 823px) {
		&::before {
			top: -3px;
			width: 43px;
		}
	}
	@media only screen and (max-width: 568px) {
		&::before {
			top: -3px;
			width: 63px;
		}
	}
	@media only screen and (max-width: 480px) {
		&::before {
			top: -3px;
			width: 44px;
		}
	}
`;

export const Schedule = styled.div`
	display: inline-block;
	width: 80px;
	opacity: 0.5;

	&:last-child > ${Strikethrough} {
		opacity: 0;
	}

	&.active {
		opacity: 1;
	}

	@media only screen and (max-width: 823px) {
		width: 53px;
	}
	@media only screen and (max-width: 568px) {
		width: 73px;
	}
	@media only screen and (max-width: 480px) {
		width: 54px;
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
	@media only screen and (max-width: 823px) {
		width: 10px;
	}
	@media only screen and (max-width: 568px) {
		width: 10px;
	}
`;

export const PaymentDate = styled.div`
	color: #FFFFFF;
	font-size: 13px;
	line-height: 25px;

	@media only screen and (max-width: 823px) {
		font-size: 8px;
		line-height: 16px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 8px;
		line-height: 16px;
	}
`;

export const ShowMore = PaymentDate.extend`
	text-transform: uppercase;
`;

export const Drawer = styled.div`
	padding: 20px;
	background-color: #F5F5F5;

	@media only screen and (max-width: 823px) {
		padding: 10px;
	}
	@media only screen and (max-width: 568px) {
		padding: 10px;
	}
`;

export const InfoItem = styled.div`
	@media only screen and (max-width: 823px) {
		margin-bottom: 5px;
	}
	@media only screen and (max-width: 568px) {
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

	@media only screen and (max-width: 823px) {
		font-size: 10px;
		line-height: 18px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 10px;
		line-height: 18px;
	}
`;

export const InfoItemContent = styled.div`
	margin-top: 5px;
	font-family: DIN-Bold;
	opacity: 1;
	color: #002326;
	font-size: 13px;
	line-height: 20px;
	word-wrap: break-word;

	@media only screen and (max-width: 823px) {
		margin-top: 2px;
		font-size: 10px;
		line-height: 18px;
	}
	@media only screen and (max-width: 568px) {
		margin-top: 2px;
		font-size: 10px;
		line-height: 18px;
	}
`;

export const DetailLink = StyledLink.extend`
	font-family: DIN;
	&:hover {
		font-family: DIN;
	}
`;

export const TransferButton = StyledButton.extend`
	background-color: #E93D59 !important;
	font-size: 13px !important;
	border-color: #E93D59 !important;
	min-width: auto !important;
	padding: 0px 15px !important;
	float: right;
	line-height: 36px !important;

	@media only screen and (max-width: 823px) {
		margin-top: 5px;
		padding: 4px 14px !important;
		font-size: 10px !important;
		line-height: 14px !important;
		min-width: auto !important;
	}
	@media only screen and (max-width: 568px) {
		margin-top: 5px;
		padding: 4px 14px !important;
		font-size: 10px !important;
		line-height: 14px !important;
		min-width: auto !important;
	}
	@media only screen and (max-width: 480px) {
		padding: 3px 12px !important;
		font-size: 8px !important;
		line-height: 12px !important;
	}
`;
