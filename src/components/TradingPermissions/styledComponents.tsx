import styled from 'styled-components';

export const TradingPermissionsContainer = styled.div`
  position: fixed;
  bottom: 10px;

	@media only screen and (max-width: 480px) {
		display: none;
	}
`;

export const TradingPermissionsTitle = styled.div`
  color: #FFFFFF;
  font-size: 13px;
  font-weight: bold;
  line-height: 25px;
  opacity: 0.5;
  padding: 10px 25px;
  text-transform: uppercase;
`;

export const TokenSymbol = styled.div`
	display: inline-block;
	width: 32px;
`;

export const TokenBalance = styled.div`
	display: inline-block;
`;
