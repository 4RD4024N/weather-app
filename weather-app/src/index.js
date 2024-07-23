import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// src/index.js veya src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux';
import store from './app/store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
