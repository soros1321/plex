import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './router/router';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/index.css';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reducers } from './reducers';
import reduxThunk from 'redux-thunk';

let store = createStore(
	reducers,
	applyMiddleware(reduxThunk)
);

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
