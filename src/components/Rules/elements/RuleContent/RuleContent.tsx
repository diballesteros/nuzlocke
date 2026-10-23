import { useTranslation } from 'react-i18next';
import { getRuleContent } from 'constants/constant';
import type { TRuleEntry } from 'constants/types';

interface RuleContentProps {
  hideSmart?: boolean;
  i: number;
  rule: TRuleEntry;
}

function RuleContent({ hideSmart, i, rule }: RuleContentProps): React.JSX.Element {
  const { t } = useTranslation('rules');
  return (
    <div className="flex flex-col flex-nowrap gap-(--spacing-2)">
      {rule.type !== 'TEXT' && !hideSmart && (
        <span className="text-(length:--font-size-4)">
          <b className="text-badge">SMART RULE</b>
          {' - '}
          <em className="text-(length:--font-size-2)">
            {t('if_broken')} <b>Tracker</b>
          </em>
        </span>
      )}
      <div className="flex flex-row flex-nowrap gap-(--spacing-3)">
        <span className="text-(length:--font-size-6) font-bold">{`${i + 1}.`}</span>
        <p>{getRuleContent(rule.content, rule.type)}</p>
      </div>
    </div>
  );
}

export default RuleContent;
