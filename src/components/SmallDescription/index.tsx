import * as React from 'react';
import './SmallDescription.css';

interface Props {
	description: string;
}

class SmallDescription extends React.Component<Props, {}> {
	render() {
		return (
			<div className="small-description">
				{this.props.description}
			</div>
		);
	}
}

export {SmallDescription};
