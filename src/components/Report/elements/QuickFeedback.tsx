import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import type { FeedbackTexts } from '@/lib/feedback';

// A second way to report a problem: Sentry's feedback form, loaded on the first click
function QuickFeedback(): React.JSX.Element {
  const { t } = useTranslation('report');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const game = useStore(useCallback((state) => state.selectedGame?.text, []));
  const [loading, setLoading] = useState(false);

  const handleOpen = async (): Promise<void> => {
    setLoading(true);
    const texts: FeedbackTexts = {
      formTitle: t('feedback_title'),
      messageLabel: t('feedback_message'),
      messagePlaceholder: t('feedback_placeholder'),
      isRequiredLabel: t('feedback_required'),
      submitButtonLabel: t('feedback_submit'),
      cancelButtonLabel: t('feedback_cancel'),
      successMessageText: t('feedback_success'),
      errorEmptyMessageText: t('feedback_error_empty'),
      errorNoClientText: t('feedback_error'),
      errorTimeoutText: t('feedback_error'),
      errorForbiddenText: t('feedback_error'),
      errorGenericText: t('feedback_error'),
    };
    try {
      const { openFeedbackForm } = await import('@/lib/feedback');
      await openFeedbackForm({ texts, darkMode, game });
    } catch (error) {
      // Offline before the form's code was ever fetched, most likely
      console.error(error);
      toast.error(t('feedback_unavailable'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-nowrap items-start gap-(--spacing-1) text-foreground">
      <p className="m-0!">{t('feedback_intro')}</p>
      <Button
        aria-busy={loading || undefined}
        data-testid="report-feedback"
        disabled={loading}
        onClick={handleOpen}
        type="button"
        variant="basic"
      >
        {t('feedback_open')}
      </Button>
      <p className="m-0! text-(length:--font-size-2)">{t('feedback_privacy')}</p>
    </div>
  );
}

export default QuickFeedback;
