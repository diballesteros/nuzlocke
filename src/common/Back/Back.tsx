import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

// Below the sm and xxs breakpoints the label and icon shrink, as with Semantic UI
const SHRINK = 'max-sm:text-(length:--font-size-2) max-xxs:text-(length:--font-size-1)';

function Back(): React.JSX.Element {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button className="h-fit min-w-fit" onClick={handleBack} type="button">
      {/* Lucide draws in a padded 24px box, so the box is larger than Semantic's 1em icon and the
          negative margins keep the glyph, the label and the button height where they were */}
      <ArrowLeft
        aria-hidden
        className={`-my-[0.215em] mr-[0.33em] ml-[-0.37em] size-[1.43em] align-[-0.15em] opacity-80 ${SHRINK}`}
        strokeWidth={3}
      />
      <span className={SHRINK}>{t('back')}</span>
    </Button>
  );
}

export default Back;
