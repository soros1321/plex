import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './router/router';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/index.css';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { reducers } from './reducers';
import reduxThunk from 'redux-thunk';

const devToolsKey: string = 'devToolsExtension';
let store = createStore(
	reducers,
	compose(
		applyMiddleware(reduxThunk),
		window[devToolsKey] ? window[devToolsKey]() : (f: any) => f
	)
);

ReactDOM.render(
	<Provider store={store}>
		<AppRouter store={store} />
	</Provider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
