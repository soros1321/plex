import styled from 'styled-components';
import { Alert } from 'reactstrap';

export const Wrapper = styled.div`
	position: fixed;
	top: 0;
	z-index: 1;
	width: -webkit-calc(100% - 213px) !important;
	width:    -moz-calc(100% - 213px) !important;
	width:         calc(100% - 213px) !important;

	&:empty {
		display: none;
	}
	@media only screen and (max-width: 812px) {
		width: 652px !important;
	}
	@media only screen and (max-width: 800px) {
		width: 640px !important;
	}
	@media only screen and (max-width: 768px) {
		width: 608px !important;
	}
	@media only screen and (max-width: 740px) {
		width: 580px !important;
	}
	@media only screen and (max-width: 720px) {
		width: 560px !important;
	}
	@media only screen and (max-width: 736px) {
		width: 576px !important;
	}
	@media only screen and (max-width: 731px) {
		width: 571px !important;
	}
	@media only screen and (max-width: 695px) {
		width: 535px !important;
	}
	@media only screen and (max-width: 690px) {
		width: 530px !important;
	}
	@media only screen and (max-width: 667px) {
		width: 547px !important;
	}
	@media only screen and (max-width: 640px) {
		width: 520px !important;
	}
	@media only screen and (max-width: 604px) {
		width: 484px !important;
	}
	@media only screen and (max-width: 600px) {
		width: 480px !important;
	}
	@media only screen and (max-width: 598px) {
		width: 478px !important;
	}
	@media only screen and (max-width: 568px) {
		width: 448px !important;
	}
	@media only screen and (max-width: 533px) {
		width: 413px !important;
	}
	@media only screen and (max-width: 504px) {
		width: 384px !important;
	}
	@media only screen and (max-width: 480px) {
		width: 100% !important;
	}
`;

export const StyledAlert = styled(Alert)`
	font-family: DIN-Bold;
	font-size: 17px;
	text-align: center;

	&.alert {
		border: none;
		border-radius: 0;
		margin-bottom: 0px;
	}
	&.alert:empty {
		display: none;
	}
	&.alert-danger {
		color: #002326;
		background-color: #E93D59;
	}
	&.alert-success {
		color: #002326;
		background-color: #1CC1CC;
	}
	&.alert-info {
		color: #002326;
		background-color: #F27550;
	}
	& > .close {
		text-shadow: none;
	}

	@media only screen and (max-width: 812px) {
		&.alert {
			font-size: 12px;
		}
		& > .close {
			font-size: 15px;
		}
	}
	@media only screen and (max-width: 568px) {
		&.alert {
			font-size: 12px;
		}
		& > .close {
			font-size: 15px;
		}
	}
`;
