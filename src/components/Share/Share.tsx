import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { FAB_ICON, FabButton } from '@/components/ui/fab-button';
import { ShareIcon, TOOLBAR_ICON } from '@/components/ui/icons';
import { NATIVE_FIELD } from '@/components/ui/input';

interface ShareProps {
  disabled: boolean;
  icon?: boolean;
  text: string;
}

function Share({ disabled, icon = false, text }: ShareProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);

  const handleCopy = async () => {
    if (!navigator?.clipboard) {
      toast.error(t('unable_share', { ns: 'stats' }));
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'));
    } catch {
      toast.error(t('unable_share', { ns: 'stats' }));
    }
  };

  const handleShare = async (data: ShareData) => {
    try {
      await navigator.share(data);
      toast.promise(navigator.share(data), {
        pending: t('validating_share', { ns: 'stats' }),
        success: t('share_success'),
        error: t('unable_share', { ns: 'stats' }),
      });
    } catch {
      toast.error(t('unable_share', { ns: 'stats' }));
    }
  };

  const handleClick = () => {
    const data = { title: 'Nuzlocke', text };
    if ('share' in navigator && 'canShare' in navigator && navigator.canShare(data)) {
      handleShare(data);
    } else {
      setShow(true);
    }
  };

  return (
    <>
      {icon ? (
        <FabButton
          aria-label={t('share', { ns: 'tracker' })}
          colour="blue"
          data-testid="share-encounters"
          disabled={disabled}
          onClick={handleClick}
        >
          <ShareIcon className={FAB_ICON} />
        </FabButton>
      ) : (
        // Semantic's exact 4px radius: rounded-md's 3.9998px shows on the dark-mode ring's corners
        <Button
          className="rounded-[0.28571429rem]"
          data-testid="share-encounters"
          disabled={disabled}
          onClick={handleClick}
          variant="blue"
        >
          {t('share', { ns: 'stats' })}
          <ShareIcon className={TOOLBAR_ICON} />
        </Button>
      )}
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogTitle className="sr-only">{t('share', { ns: 'tracker' })}</DialogTitle>
          <DialogBody className="flex flex-col flex-nowrap gap-(--spacing-1)" scrolling>
            <textarea
              className={`${NATIVE_FIELD} [resize:revert]`}
              data-testid="share-textarea"
              defaultValue={text}
              rows={5}
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setShow(false)} variant="secondary">
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleCopy} variant="primary">
              {t('copy')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Share;
