import * as React from 'react';
import styled from 'styled-components';
import { Label, Row, Col, FormGroup, Input } from 'reactstrap';
import { StyledButton } from '../../../../components';

interface Props {
	className?: string;
}

export const Wrapper = styled.div`
	margin-top: 30px;
`;

export const StyledLabel = styled(Label)`
	text-transform: none;
	color: #002326;
	font-family: DIN;
	font-size: 17px;
	line-height: 25px;
	opacity: 1;
`;

export const GrayRow = styled(Row)`
	padding: 20px;
	background-color: #F5F5F5;
`;

class UglyImageContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col xs="12" md="2" className={this.props.className}>
				{this.props.children}
			</Col>
		);
	}
}

export const ImageContainer = styled(UglyImageContainer)`
	min-height: 100px !important;
	background-color: rgba(45,58,59,0.28);
`;

class UglyDetailContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col xs="12" md="10" className={this.props.className}>
				{this.props.children}
			</Col>
		);
	}
}

export const DetailContainer = styled(UglyDetailContainer)`
`;

export const ShareButtonsContainer = styled.div`
	margin: 10px;

	@media only screen and (max-width: 480px) {
		text-align: center;
	}
`;

export const ShareButton = styled.div`
	display: inline;
	margin: 10px;
	cursor: pointer;
`;

export const StyledFormGroup = styled(FormGroup)`
	margin-left: 10px;

	@media only screen and (max-width: 480px) {
		margin-left: 0;
	}
`;

class UglyInputContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col xs="12" md="8" className={this.props.className}>
				{this.props.children}
			</Col>
		);
	}
}

export const InputContainer = styled(UglyInputContainer)`
`;

export const RequestInput = styled(Input)`
	height: 46px !important;
	font-size: 17px !important;
	width: 95% !important;

	@media only screen and (max-width: 480px) {
		width: 100% !important;
		margin-bottom: 20px;
	}
`;

class UglyButtonContainer extends React.Component<Props, {}> {
	render() {
		return (
			<Col xs="12" md="4" className={this.props.className}>
				{this.props.children}
			</Col>
		);
	}
}

export const ButtonContainer = styled(UglyButtonContainer)`
`;

export const CopyButton = StyledButton.extend`
	min-width: auto !important;
	width: 100% !important;
`;
