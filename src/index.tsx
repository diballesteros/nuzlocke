import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import { UpdateSW } from 'components';
import reportWebVitals from 'reportWebVitals';
import { ReportHandler } from 'web-vitals';
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

function sendToAnalytics({ id, name, value }: { id: number; name: string; value: number }) {
  ReactGA.ga('send', 'event', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventValue: Math.round(name === 'CLS' ? value * 1000 : value),
    eventLabel: id,
    nonInteraction: true,
  });
}

reportWebVitals(sendToAnalytics as unknown as ReportHandler);
