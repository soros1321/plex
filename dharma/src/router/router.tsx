import * as React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from '../App';
import { Welcome, RequestLoan, DefaultContent } from '../modules';

export const AppRouter: React.StatelessComponent<{}> = () => {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App} >
				<IndexRoute component={Welcome} />
				<Route path="/" component={Welcome} />
				<Route path="/bazaar" component={DefaultContent} />
				<Route path="/whitepaper" component={DefaultContent} />
				<Route path="/blog" component={DefaultContent} />
				<Route path="/github" component={DefaultContent} />
				<Route path="/chat" component={DefaultContent} />
				<Route path="/twitter" component={DefaultContent} />
				<Route path="/dashboard" component={DefaultContent} />
				<Route path="/request" component={RequestLoan} />
				<Route path="/fill" component={DefaultContent} />
			</Route>
		</Router>
	);
};
