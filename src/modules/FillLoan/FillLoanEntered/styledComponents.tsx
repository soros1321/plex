import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'reactstrap';
import { StyledButton } from '../../../components';

interface Props {
	className?: string;
}

export const LoanInfoContainer = styled(Row)`
	padding: 20px;
	background-color: #F5F5F5;

	@media only screen and (max-width: 480px) {
		padding: 15px;
	}
`;

class UglyHalfCol extends React.Component<Props, {}> {
	render() {
		return(
			<Col xs="12" md="6" className={this.props.className}>
				{this.props.children}
			</Col>
		);
	}
}

export const HalfCol = styled(UglyHalfCol)`
`;

export const InfoItem = styled.div`
	margin-bottom: 30px;
`;

export const Title = styled.div`
	font-family: DIN-Bold;
	opacity: 0.5;
	color: #002326;
	font-size: 15px;
	line-height: 25px;
	text-transform: uppercase;
`;

export const Content = Title.extend`
	margin-top: 5px;
	opacity: 1;
	font-size: 18px;
	text-transform: none;
	word-wrap: break-word;
`;

export const ButtonContainer = styled.div`
	margin-top: 30px;
`;

export const DeclineButton = StyledButton.extend`
	border: 1px solid #002326 !important;
	background-color: #FFFFFF !important;
	color: #002326 !important;
	font-family: DIN-Bold !important;
	width: 49%;
	margin-right: 1%;

	@media only screen and (max-width: 480px) {
		width: 100%;
		margin-right: 0;
		margin-bottom: 10px;
	}
`;

export const FillLoanButton = StyledButton.extend`
	width: 49%;
	margin-left: 1%;

	@media only screen and (max-width: 480px) {
		width: 100%;
		margin-left: 0;
	}
`;

export const LoaderContainer = styled.div`
	display: inline-block;
	margin-top: 15px;
`;
