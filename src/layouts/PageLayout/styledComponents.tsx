import styled from 'styled-components';

export const LeftContainer = styled.div`
	float: left;
	width: 213px;

	@media only screen and (max-width: 480px) {
		width: 100%;
	}
`;

export const RightContainer = styled.div`
	float: left;
	width: -webkit-calc(100% - 213px) !important;
	width:    -moz-calc(100% - 213px) !important;
	width:         calc(100% - 213px) !important;

	@media only screen and (max-width: 480px) {
		width: 100% !important;
	}
`;
