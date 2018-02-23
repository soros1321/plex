import * as React from 'react';
import { Wrapper, StyledAlert } from './styledComponents';

interface Props {
	errorMessage: string;
}

class Error extends React.Component<Props> {
	render() {
		return (
			<Wrapper>
				{this.props.errorMessage && (
					<StyledAlert color="danger">
						{this.props.errorMessage}
					</StyledAlert>
				)}
			</Wrapper>
		);
	}
}

export { Error };
