import * as React from 'react';
import { MainWrapper } from '../../components';

class Welcome extends React.Component<{}, {}> {
	render() {
		return (
			<MainWrapper>
				<h1>Meet Dharma</h1>
				<p>
					The open protocol for tokenized debt.
				</p>
			</MainWrapper>
		);
	}
}

export { Welcome };
