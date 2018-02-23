import * as React from 'react';
import { PageLayout } from './layouts';
import { ErrorContainer } from './components';

class App extends React.Component {
	render() {
		return (
			<div>
				<PageLayout>
					<ErrorContainer />
					{this.props.children}
				</PageLayout>
			</div>
		);
	}
}

export default App;
