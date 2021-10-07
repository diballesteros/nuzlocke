import React from 'react';
import { getRuleContent } from 'constants/constant';
import { TRuleEntry } from 'constants/types';
import styles from './RuleContent.module.scss';

interface RuleContentProps {
  hideSmart?: boolean;
  i: number;
  rule: TRuleEntry;
}

function RuleContent({ hideSmart, i, rule }: RuleContentProps): JSX.Element {
  return (
    <div className={styles.content}>
      {rule.type !== 'TEXT' && !hideSmart && (
        <span className={styles.smart}>
          <b>SMART RULE</b>
          {' - '}
          <em>
            if broken an alert will appear in the <b>Tracker</b>
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
