import styled from 'styled-components';
import { StyledButton } from '../StyledComponents';

export const TradingPermissionsContainer = styled.div`
	width: inherit;
	&.left {
		position: fixed;
		bottom: 10px;
		padding-left: 25px;
	}
	@media only screen and (max-width: 480px) {
		width: 100%;
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
  padding: 5px 0px;
  text-transform: uppercase;
`;

export const TokenSymbol = styled.div`
	display: inline-block;
	width: 32px;
	opacity: 0.5;
`;

export const TokenBalance = styled.div`
	display: inline-block;
	opacity: 0.5;
`;

export const FaucetButton = StyledButton.extend`
	margin-left: 5px;
	display: inline-block;
	font-size: 10px !important;
	padding: 10px 15px !important;
	min-width: auto !important;
	line-height: 4px !important;
`;
