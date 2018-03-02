import * as React from 'react';
import { Wrapper, StyledAlert } from './styledComponents';

interface Props {
	errorMessage: string;
	handleSetError: (errorMessage: string) => void;
}

interface State {
	visible: boolean;
}

class Error extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			visible: true
		};
		this.onDismiss = this.onDismiss.bind(this);
	}

	componentWillReceiveProps(nextProps: Props) {
		if (this.props.errorMessage !== nextProps.errorMessage && nextProps.errorMessage) {
			this.setState({ visible: true });
		}
	}

	onDismiss() {
		this.props.handleSetError('');
		this.setState({ visible: false });
	}

	render() {
		return (
			<Wrapper>
				{this.props.errorMessage && (
					<StyledAlert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
						{this.props.errorMessage}
					</StyledAlert>
				)}
			</Wrapper>
		);
	}
}

export { Error };
