import * as React from 'react';

class Welcome extends React.Component<{}, {}> {
	render() {
		return (
			<div className="main-wrapper">
				<h1>Meet Dharma</h1>
				<p>
					The open protocol for tokenized debt.
				</p>
			</div>
		);
	}
}

export { Welcome };
