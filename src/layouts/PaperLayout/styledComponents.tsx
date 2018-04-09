import styled from 'styled-components';

export const Background = styled.div`
	background-color: #DCDCDC;
	padding: 55px 0 100px;
	height: 100%;

	@media only screen and (max-width: 812px) {
		padding: 50px 0 70px;
	}
	@media only screen and (max-width: 568px) {
		padding: 40px 0 60px;
	}
	@media only screen and (max-width: 480px) {
		padding: 0;
		background-color: #FFFFFF;
		height: auto;
	}
`;

export const InnerContainer = styled.div`
	width: 620px;
	margin: 0px auto;
	background-color: #FFFFFF;
	box-shadow: 0 12px 24px 0 rgba(0,0,0,0.12);

	@media only screen and (max-width: 812px) {
		width: 560px;
	}
	@media only screen and (max-width: 568px) {
		width: 360px;
	}
	@media only screen and (max-width: 480px) {
		margin: 0px;
		width: 100%;
		box-shadow: none;
	}
`;
