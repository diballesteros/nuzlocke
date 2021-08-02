import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import { UpdateSW } from 'components';
import App from './App';

ReactDOM.render(
  <>
    <App />
    <UpdateSW />
  </>,
  document.getElementById('root')
);

serviceWorkerRegistration.register({
  onInit: (registration) => window.setServiceWorker(registration),
  onUpdate: (registration) => window.setServiceWorker(registration),
});
