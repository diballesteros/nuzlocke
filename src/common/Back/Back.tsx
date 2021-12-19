import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import styles from './Back.module.scss';

function Back(): JSX.Element {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const darkMode = useStore(useCallback((state) => state.darkMode, []));

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      className={styles.button}
      onClick={handleBack}
      // style={{ height: 36 }}
      inverted={darkMode}
      type="button"
    >
      <Icon className={styles.icon} name="arrow left" />
      <span className={styles.text}>{t('back')}</span>
    </Button>
  );
}

export default Back;
