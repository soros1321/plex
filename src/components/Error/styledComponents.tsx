import styled from 'styled-components';
import { UncontrolledAlert } from 'reactstrap';

export const Wrapper = styled.div`
	&:empty {
		display: none;
	}
`;

export const StyledAlert = styled(UncontrolledAlert)`
	font-family: DIN-Bold;
	font-size: 17px;
	text-align: center;

	&.alert {
		border: none;
		border-radius: 0;
	}
	&.alert-danger {
		color: #002326;
		background-color: #E93D59;
	}
	& > .close {
		text-shadow: none;
	}
`;
