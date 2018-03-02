import styled from 'styled-components';

export const TradingPermissionsContainer = styled.div`
	width: 100%;
	&.left {
		position: fixed;
		bottom: 10px;
	}
	@media only screen and (max-width: 480px) {
		&.left {
			display: none;
		}
	}
`;

export const TradingPermissionsTitle = styled.div`
  color: #FFFFFF;
  font-size: 13px;
  font-weight: bold;
  line-height: 25px;
  opacity: 0.5;
  padding: 5px 25px;
  text-transform: uppercase;

	@media only screen and (max-width: 480px) {
		padding: 5px 0px;
	}
`;

export const TokenSymbol = styled.div`
	display: inline-block;
	width: 32px;
`;

export const TokenBalance = styled.div`
	display: inline-block;
`;
