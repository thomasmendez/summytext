import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';

import { Provider } from 'react-redux';
import store from './store';

import App from './App';

ReactGA.initialize([
  {
    trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  },
]);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
