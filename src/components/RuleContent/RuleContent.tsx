import React from 'react';
import { TRule, TRuleContent, TRuleEntry } from 'constants/types';
import styles from './RuleContent.module.scss';

interface RuleContentProps {
  hideSmart?: boolean;
  rule: TRuleEntry;
  i: number;
}

const getRuleContent = (content: TRuleContent, type: TRule) => {
  switch (type) {
    case 'TYPE':
      return `Allowed types: ${(content as string[])?.join(', ')}`;
    case 'GENERATION':
      return `Allowed generations: ${(content as string[])?.join(', ')}`;
    case 'LEVEL':
      return `Max level ${content}`;
    default:
      return content;
  }
};

const RuleContent: React.FC<RuleContentProps> = ({ hideSmart, i, rule }) => {
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
};

export default RuleContent;
