import { useTranslation } from 'react-i18next';
import { getRuleContent } from 'constants/constant';
import type { TRuleEntry } from 'constants/types';
import styles from './RuleContent.module.scss';

interface RuleContentProps {
  hideSmart?: boolean;
  i: number;
  rule: TRuleEntry;
}

function RuleContent({ hideSmart, i, rule }: RuleContentProps): React.JSX.Element {
  const { t } = useTranslation('rules');
  return (
    <div className={styles.content}>
      {rule.type !== 'TEXT' && !hideSmart && (
        <span className={styles.smart}>
          <b>SMART RULE</b>
          {' - '}
          <em>
            {t('if_broken')} <b>Tracker</b>
          </em>
        </span>
      )}
      <div className={styles.description}>
        <span className={styles.number}>{`${i + 1}.`}</span>
        <p>{getRuleContent(rule.content, rule.type)}</p>
      </div>
    </div>
  );
}

export default RuleContent;
