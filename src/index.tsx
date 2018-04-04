import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './router/router';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/index.css';
import { loadState, saveState } from './models';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { reducers } from './reducers';
import reduxThunk from 'redux-thunk';
const throttle = require('lodash/throttle');

const devToolsKey: string = 'devToolsExtension';

const persistedState = loadState();

let store = createStore(
	reducers,
	persistedState,
	compose(
		applyMiddleware(reduxThunk),
		window[devToolsKey] ? window[devToolsKey]() : (f: any) => f
	),
);

store.subscribe(throttle(() => {
	saveState({
		debtOrderReducer: store.getState().debtOrderReducer,
		plexReducer: store.getState().plexReducer
	});
}, 1000));

ReactDOM.render(
	<Provider store={store}>
		<AppRouter store={store} />
	</Provider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
