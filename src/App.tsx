import * as React from 'react';
import { PageLayout } from './layouts';

class App extends React.Component {
	render() {
		return (
			<div>
				<PageLayout>
					{this.props.children}
				</PageLayout>
			</div>
		);
	}
}

export default App;
