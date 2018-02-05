import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter } from './router/router';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
