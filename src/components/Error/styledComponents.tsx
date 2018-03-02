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
	& > .close {
		text-shadow: none;
	}

	@media only screen and (max-width: 480px) {
		&.alert {
			font-size: 13px;
		}
		& > .close {
			font-size: 17px;
		}
	}
`;
