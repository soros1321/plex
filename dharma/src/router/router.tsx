import * as React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from '../App';
import {
	Welcome,
	RequestLoanSuccess,
	FillLoanEmpty,
	FillLoanEntered,
	DefaultContent,
	Dashboard,
	JSONSchemaForm
} from '../modules';
import { ParentContainer } from '../layouts';

export const AppRouter: React.StatelessComponent<{}> = () => {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={App} >
				<IndexRoute component={Welcome} />
				<Route path="/bazaar" component={DefaultContent} />
				<Route path="/whitepaper" component={DefaultContent} />
				<Route path="/blog" component={DefaultContent} />
				<Route path="/github" component={DefaultContent} />
				<Route path="/chat" component={DefaultContent} />
				<Route path="/twitter" component={DefaultContent} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/request" component={ParentContainer}>
					<IndexRoute component={JSONSchemaForm} />
					<Route path="success" component={RequestLoanSuccess} />
				</Route>
				<Route path="/fill" component={ParentContainer}>
					<IndexRoute component={FillLoanEmpty} />
					<Route path="entered" component={FillLoanEntered} />
				</Route>
			</Route>
		</Router>
	);
};
