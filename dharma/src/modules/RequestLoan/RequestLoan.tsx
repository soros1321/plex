import * as React from 'react';

class RequestLoan extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export { RequestLoan };
