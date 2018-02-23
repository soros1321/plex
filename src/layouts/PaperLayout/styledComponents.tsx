import styled from 'styled-components';

export const Background = styled.div`
	background-color: #082C30;
	padding: 50px 0;

	@media only screen and (max-width: 480px) {
		padding: 0;
	}
`;

export const InnerContainer = styled.div`
	width: 620px;
	margin: 0px auto;
	background-color: #FFFFFF;
	box-shadow: 0 12px 24px 0 rgba(0,0,0,0.12);

	@media only screen and (max-width: 480px) {
		margin: 0px;
		width: 100%;
		box-shadow: none;
	}
`;
