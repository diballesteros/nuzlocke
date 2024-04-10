import { useTranslation } from 'react-i18next';
import styles from './Tip.module.scss';

interface TipProps {
  missing: string;
}

function Tip({ missing }: TipProps): React.JSX.Element {
  const { t } = useTranslation('stats');
  return (
    <div className={styles.container} data-testid="status-tip">
      <p className={styles.missing}>
        {t('tip_1')} <strong>{missing}</strong> {t('tip_2')}
      </p>
    </div>
  );
}

export default Tip;
