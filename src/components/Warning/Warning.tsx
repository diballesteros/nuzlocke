import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import styles from './Warning.module.scss';

function Warning(): JSX.Element {
  const { t } = useTranslation('common');
  const toggleWarning = useStore(useCallback((state) => state.toggleWarning, []));

  return (
    <div className={styles.warning}>
      <strong>
        {t('app_browser')}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
          rel="noreferrer nofollow"
          title="localStorage"
        >
          localStorage{' '}
        </a>
        {t('to_save_game')}
      </strong>
      <Button aria-label="close warning" data-testid="close-warning" onClick={toggleWarning}>
        OK
      </Button>
    </div>
  );
}

export default Warning;
