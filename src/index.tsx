import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/components/accordion.min.css';
import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/container.min.css';
import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/menu.min.css';
import 'semantic-ui-css/components/popup.min.css';
import 'semantic-ui-css/components/tab.min.css';
import 'semantic-ui-css/components/input.min.css';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/segment.min.css';
import 'semantic-ui-css/components/search.min.css';
import 'semantic-ui-css/components/label.min.css';
import 'semantic-ui-css/components/item.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/sidebar.min.css';
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import { UpdateSW } from 'components';
import ErrorBoundary from 'error/ErrorBoundary';
import App from './App';

ReactDOM.render(
  <>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <UpdateSW />
  </>,
  document.getElementById('root')
);

serviceWorkerRegistration.register({
  onInit: (registration) => window.setServiceWorker(registration),
  onUpdate: (registration) => window.setServiceWorker(registration),
});
