import * as React from 'react';

class ParentContainer extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export { ParentContainer };
