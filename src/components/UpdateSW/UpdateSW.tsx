import { useCallback, useLayoutEffect, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import styles from './UpdateSW.module.scss';

declare global {
  interface Window {
    setServiceWorker: (sw: ServiceWorkerRegistration) => void;
  }
}

function UpdateSW(): JSX.Element {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState(null);

  const setServiceWorker = useCallback(
    (registration: ServiceWorkerRegistration) => {
      setWaitingServiceWorker(registration.waiting);
    },
    [setWaitingServiceWorker]
  );

  useLayoutEffect(() => {
    window.setServiceWorker = setServiceWorker;
  }, [setServiceWorker]);

  const updateServiceWorker = () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      waitingServiceWorker.addEventListener('statechange', (e: any) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  return !!waitingServiceWorker ? (
    <div className={styles.alert}>
      <span>New version available</span>
      <Button color="grey" onClick={updateServiceWorker} type="button">
        Update
      </Button>
    </div>
  ) : null;
}

export default UpdateSW;
