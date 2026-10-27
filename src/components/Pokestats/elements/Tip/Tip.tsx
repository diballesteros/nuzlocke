import { useTranslation } from 'react-i18next';

interface TipProps {
  missing: string;
}

function Tip({ missing }: TipProps): React.JSX.Element {
  const { t } = useTranslation('stats');
  return (
    <div className="w-full rounded-[4px] bg-secondary p-(--spacing-2)" data-testid="status-tip">
      <p className="text-foreground">
        {t('tip_1')} <strong>{missing}</strong> {t('tip_2')}
      </p>
    </div>
  );
}

export default Tip;
