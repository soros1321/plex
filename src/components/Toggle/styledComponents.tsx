import styled from 'styled-components';

export const ToggleLabel = styled.label`
	display: inline-block;
	vertical-align: middle;
	padding: 5px 0px;
	opacity: 1;
	width: 152px;

	@media only screen and (max-width: 812px) {
		width: 120px;
		padding: 2px 0px;
		margin-top: -6px;
	}
	@media only screen and (max-width: 667px) {
		width: 79px;
		padding: 2px 0px;
	}
	@media only screen and (max-width: 568px) {
		width: 79px;
		padding: 2px 0px;
	}
	@media only screen and (max-width: 480px) {
		padding: 2px 0px;
		width: auto;
	}
`;

export const ToggleName = styled.div`
	color: #FFFFFF;
	display: inline-block;
	font-family: DIN;
	font-size: 13px;
	line-height: 25px;
	margin-left: 10px;
	opacity: 1;

	@media only screen and (max-width: 812px) {
		font-size: 8px;
		line-height: 12px;
		margin-left: 5px;
	}
	@media only screen and (max-width: 667px) {
		font-size: 8px;
		line-height: 12px;
		margin-left: 5px;
	}
	@media only screen and (max-width: 568px) {
		font-size: 8px;
		line-height: 12px;
		margin-left: 5px;
	}
	@media only screen and (max-width: 480px) {
		font-size: 10px;
		line-height: 14px;
		margin-left: 10px;
	}
`;
