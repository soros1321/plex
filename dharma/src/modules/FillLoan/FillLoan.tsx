import * as React from 'react';

class FillLoan extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export { FillLoan };
