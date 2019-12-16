import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter } from "react-router-dom";

import App from './components/App.js';
import reducers from './redux/reducers.js';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}><App /></Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
