import { toBlob, toPng } from 'html-to-image';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import shallow from 'zustand/shallow';
import { DisplaySettings, Image } from 'components/Pokestats/elements';
import useStore from 'store';
import styles from './Summary.module.scss';

function Summary(): JSX.Element {
  const { t } = useTranslation('stats');
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
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
    } catch (err) {
      toast.error(t('unable_share'));
    }
  };

  return (
    <div className={styles.container}>
      {!!selectedGame && (
        <div className={styles.options}>
          <Button color="green" data-testid="download-image" onClick={handleDownload}>
            {t('download')} <Icon name="download" />
          </Button>
          {'share' in navigator && 'canShare' in navigator && (
            <Button color="blue" data-testid="share-image" onClick={handleShare}>
              {t('share')} <Icon name="share" />
            </Button>
          )}
          <DisplaySettings />
        </div>
      )}
      <div className={styles.inner}>
        <Image responsive />
      </div>
      <div className={styles.offscreen}>
        <Image forwardedRef={summaryRef} />
      </div>
    </div>
  );
}

export default Summary;
