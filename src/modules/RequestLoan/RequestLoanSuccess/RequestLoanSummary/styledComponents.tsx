import styled from 'styled-components';
import { Label, FormGroup } from 'reactstrap';
import { StyledButton } from '../../../../components';

export const Wrapper = styled.div`
	margin-top: 30px;

	@media only screen and (max-width: 480px) {
		margin-top: 45px;
	}
`;

export const StyledLabel = styled(Label)`
	text-transform: none;
	color: #002326;
	font-family: DIN;
	font-size: 17px;
	line-height: 25px;
	opacity: 1;
`;

export const GrayContainer = styled.div`
	padding: 20px;
	background-color: #F5F5F5;
`;

export const InfoItem = styled.div`
	margin-bottom: 30px;
`;

export const Title = styled.div`
	text-transform: uppercase;
	font-family: DIN-Bold;
	opacity: 0.5;
	color: #002326;
	font-size: 15px;
	line-height: 25px;
`;

export const Content = styled.div`
	margin-top: 5px;
	font-family: DIN-Bold;
	opacity: 1;
	color: #002326;
	font-size: 17px;
	line-height: 25px;
	word-wrap: break-word;
`;

export const SummaryJsonContainer = styled(FormGroup)`
	width: 100%;
	position: relative;
`;

export const StyledTextarea = styled.textarea`
	width: 100%;
	min-height: 150px;
`;

export const CopyButton = StyledButton.extend`
	position: absolute;
	right: 0;
	bottom: 6px;
	min-width: auto !important;
	border-color: #002326 !important;
	background-color: #002326 !important;

	@media only screen and (max-width: 480px) {
		margin-top: 20px;
		position: relative;
		right: auto;
		bottom: auto;
		width: 100% !important;
	}
`;

export const CopiedMessage = styled.div`
	position: absolute;
	font-family: DIN-Bold;
	font-size: 15px;

	@media only screen and (max-width: 480px) {
		position: relative;
		margin-bottom: 5px;
	}
`;
