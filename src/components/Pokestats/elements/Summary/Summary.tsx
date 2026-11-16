import { toBlob, toPng } from 'html-to-image';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { DisplaySettings, Image } from 'components/Pokestats/elements';
import { TOOLBAR_BUTTON } from 'components/Tracker/elements/buttons';
import useStore from 'store';
import { DownloadIcon, ShareIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// On narrower screens the buttons lose their icons and get square padding
// The toolbar (5v): Download in the primary colour (the darker blue, as the Edit custom statuses
// button, for contrast), Share and Settings outlined, as on the tracker
const DOWNLOAD = cn(
  TOOLBAR_BUTTON,
  'border-primary-hover bg-primary-hover text-white hover:bg-primary-hover hover:brightness-110'
);

function Summary(): React.JSX.Element {
  const { t } = useTranslation('stats');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const newFile = await toast.promise(toPng(summaryRef.current, { cacheBust: true }), {
      pending: t('generating_image'),
      success: t('image_downloaded'),
      error: t('unable_download'),
    });
    if (newFile) {
      const link = document.createElement('a');
      link.download = 'nuzlocke.png';
      link.href = newFile;
      link.click();
    }
  };

  const handleShare = async () => {
    const newFile = await toast.promise(toBlob(summaryRef.current), {
      pending: t('generating_image'),
      success: t('image_generated'),
      error: t('unable_generate'),
    });
    const data = {
      files: [
        new File([newFile], 'nuzlocke.png', {
          type: newFile?.type,
        }),
      ],
      title: 'Nuzlocke',
      text: 'Nuzlocke',
    };

    try {
      if (!navigator.canShare(data)) {
        throw Error("Can't share");
      }
      toast.promise(navigator.share(data), {
        pending: t('validating_share'),
        success: t('share_image'),
        error: t('unable_share'),
      });
    } catch {
      toast.error(t('unable_share'));
    }
  };

  return (
    <div className="relative flex flex-col flex-nowrap items-center gap-(--spacing-3) overflow-hidden">
      {!!selectedGame && (
        <div className="relative flex w-full flex-wrap gap-(--spacing-2)">
          <button
            className={DOWNLOAD}
            data-testid="download-image"
            onClick={handleDownload}
            type="button"
          >
            <DownloadIcon aria-hidden />
            <span>{t('download')}</span>
          </button>
          {'share' in navigator && 'canShare' in navigator && (
            <button
              className={cn(TOOLBAR_BUTTON, 'bg-card')}
              data-testid="share-image"
              onClick={handleShare}
              type="button"
            >
              <ShareIcon aria-hidden />
              <span>{t('share')}</span>
            </button>
          )}
          <DisplaySettings />
        </div>
      )}
      <div className="flex w-full flex-row flex-nowrap gap-(--spacing-1) overflow-auto">
        <Image responsive />
      </div>
      {/* Rendered off screen at desktop width, so the downloaded image is the same on every device */}
      <div className="absolute -right-[100000px] -bottom-[100000px] w-[85.714rem] max-w-[85.714rem]">
        <Image ref={summaryRef} />
      </div>
    </div>
  );
}

export default Summary;
