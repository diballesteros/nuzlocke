import { toBlob, toPng } from 'html-to-image';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { DisplaySettings, Image } from 'components/Pokestats/elements';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ShareIcon, TRAILING_ICON } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// On narrower screens the buttons lose their icons and get square padding
const OPTION = 'max-md:p-(--spacing-3)';
const OPTION_ICON = cn(TRAILING_ICON, 'max-md:[display:none]!');

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
    <div className="relative flex flex-col flex-nowrap items-center gap-(--spacing-3) overflow-hidden px-(--spacing-1)">
      {!!selectedGame && (
        <div className="relative flex w-[calc(100%-var(--spacing-3))] px-(--spacing-1)">
          <Button
            className={OPTION}
            data-testid="download-image"
            onClick={handleDownload}
            variant="solid-green"
          >
            {t('download')} <DownloadIcon className={OPTION_ICON} />
          </Button>
          {'share' in navigator && 'canShare' in navigator && (
            <Button
              className={OPTION}
              data-testid="share-image"
              onClick={handleShare}
              variant="primary"
            >
              {t('share')} <ShareIcon className={OPTION_ICON} />
            </Button>
          )}
          <DisplaySettings />
        </div>
      )}
      <div className="flex w-full flex-row flex-nowrap gap-(--spacing-1) overflow-auto">
        <Image responsive />
      </div>
      {/* Rendered off screen at desktop width, so the downloaded image is the same on every device */}
      <div className="absolute -right-[100000px] -bottom-[100000px] w-[85.714rem] max-w-[85.714rem]">
        <Image forwardedRef={summaryRef} />
      </div>
    </div>
  );
}

export default Summary;
