import * as React from 'react';
import { PressEnterButton } from './styledComponents';

interface Props {
	id?: string;
	value?: any;
}

interface State {
	clicked: boolean;
}

class PressEnter extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			clicked: false
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({ clicked: true });
		console.log(this.props);
		const selectGoToNext = new CustomEvent('selectGoToNext', {detail: {name: this.props.id}});
		window.dispatchEvent(selectGoToNext);
	}

	render() {
		console.log(this.props);
		return (
			<PressEnterButton id={'press-enter-' + this.props.id} className={'press-enter ' + (this.props.value ? 'active' : '')} onClick={this.handleClick}>OK, Press ENTER</PressEnterButton>
		);
	}
}

export { PressEnter };
