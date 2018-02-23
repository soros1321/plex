import * as React from 'react';
import { PaperLayout } from '../../layouts';
import { MainWrapper } from '../../components';

class Welcome extends React.Component<{}, {}> {
	render() {
		return (
			<PaperLayout>
				<MainWrapper>
					<h1>Meet Dharma</h1>
					<p>
						The open protocol for tokenized debt.
					</p>
				</MainWrapper>
			</PaperLayout>
		);
	}
}

export { Welcome };
