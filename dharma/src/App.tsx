import * as React from 'react';
import PageLayout from './layouts/PageLayout/PageLayout';
import RequestLoan from './modules/RequestLoan/RequestLoan';

class App extends React.Component {
	render() {
		return (
			<div>
				<PageLayout>
					<RequestLoan />
				</PageLayout>
			</div>
		);
	}
}

export default App;
