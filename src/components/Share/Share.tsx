import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import styles from 'assets/styles/Button.module.scss';
import modalStyles from 'assets/styles/Modal.module.scss';

interface ShareProps {
  disabled: boolean;
  icon?: boolean;
  text: string;
}

function Share({ disabled, icon = false, text }: ShareProps): JSX.Element {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const shareRef = useRef<HTMLTextAreaElement>(null);
  const appState = useStore((state) => state);

  const handleCopy = () => {
    shareRef.current.select();
    document.execCommand('copy');
  };

  const handleShare = async (data: ShareData) => {
    try {
      await navigator.share(data);
      toast.promise(navigator.share(data), {
        pending: t('validating_share', { ns: 'stats' }),
        success: t('share_success'),
        error: t('unable_share', { ns: 'stats' }),
      });
    } catch (err) {
      toast.error(t('unable_share', { ns: 'stats' }));
    }
  };

  const handleClick = () => {
    const data = { title: 'Nuzlocke', text };
    if ('share' in navigator && 'canShare' in navigator && navigator.canShare(data)) {
      handleShare(data).catch(() => {
        toast.error(t('unable_share', { ns: 'stats' }));
      });
    } else {
      setShow(true);
    }
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setShow(false)}
      open={show}
      trigger={
        icon ? (
          <Button
            circular
            className={styles.iconButton}
            color="blue"
            data-testid="share-encounters"
            disabled={disabled}
            icon="share"
            onClick={handleClick}
          />
        ) : (
          <Button
            color="blue"
            data-testid="share-encounters"
            disabled={disabled}
            inverted={appState.darkMode}
            onClick={handleClick}
          >
            {t('share', { ns: 'stats' })}
            <Icon name="share" />
          </Button>
        )
      }
    >
      <Modal.Content className={modalStyles.modalMax}>
        <textarea data-testid="share-textarea" defaultValue={text} ref={shareRef} rows={5} />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShow(false)}>{t('cancel', { ns: 'common' })}</Button>
        <Button onClick={handleCopy} primary>
          {t('copy')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default Share;
