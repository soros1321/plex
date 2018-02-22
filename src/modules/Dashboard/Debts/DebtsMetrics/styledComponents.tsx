import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'reactstrap';

interface Props {
	className?: string;
}

export const Wrapper = styled(Row)`
	width: 800px !important;
	@media only screen and (max-width: 480px) {
		width: 100% !important;
	}
}
`;

class UglyHalfCol extends React.Component<Props, {}> {
	render() {
		return (
			<Col className={this.props.className} xs="12" md="6">
				{this.props.children}
			</Col>
		);
	}
}
export const HalfCol = styled(UglyHalfCol)`
	margin-bottom: 10px;
`;

export const Value = styled.div`
	color: #002326;
	font-family: DIN-Bold;
	font-size: 17px;
	line-height: 25px;
`;

export const Label = Value.extend`
	opacity: 0.5;
`;

export const Divider = Value.extend`
	margin: 0 10px;
	opacity: 0.3;
	display: inline-block;
`;
