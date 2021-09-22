import React, { useCallback, useRef } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { toPng, toBlob } from 'html-to-image';
import useStore from 'store';
import shallow from 'zustand/shallow';
import { DisplaySettings, Image } from 'components/Pokestats/elements';
import styles from './Summary.module.scss';

const Summary: React.FC = () => {
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const newFile = await toPng(summaryRef.current, { cacheBust: true });
    if (newFile) {
      const link = document.createElement('a');
      link.download = 'nuzlocke.png';
      link.href = newFile;
      link.click();
    }
  };

  const handleShare = async () => {
    const newFile = await toBlob(summaryRef.current);
    const data = {
      files: [
        new File([newFile], 'nuzlocke.png', {
          type: newFile.type,
        }),
      ],
      title: 'Nuzlocke',
      text: 'Nuzlocke',
    };

    try {
      if (!navigator.canShare(data)) {
        console.error("Can't share");
      }
      await navigator.share(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {!!selectedGame && (
        <div className={styles.options}>
          <Button color="green" data-testid="download-image" onClick={handleDownload}>
            DOWNLOAD <Icon name="download" />
          </Button>
          {'share' in navigator && 'canShare' in navigator && (
            <Button color="blue" data-testid="share-image" onClick={handleShare}>
              SHARE <Icon name="share" />
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
};

export default Summary;
