import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { AppRouter } from './router/router';
import reduxThunk from 'redux-thunk';
import reducers from './reducers/index';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/index.css';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
   </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
