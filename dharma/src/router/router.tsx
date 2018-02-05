import * as React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from '../App';
import { Welcome, RequestLoan } from '../modules';

export const AppRouter: React.StatelessComponent<{}> = () => {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App} >
				<IndexRoute component={Welcome} />
				<Route path="/" component={Welcome} />
				<Route path="/request" component={RequestLoan} />
			</Route>
		</Router>
	);
};
