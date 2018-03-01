import * as React from 'react';
import { PageLayout } from './layouts';
import { ErrorContainer } from './components';

class App extends React.Component {
	render() {
		return (
			<PageLayout>
				<ErrorContainer />
				{this.props.children}
			</PageLayout>
		);
	}
}

export default App;
