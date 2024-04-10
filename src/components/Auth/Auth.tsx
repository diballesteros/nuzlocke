import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { supabase } from 'supabaseClient';
import { DELETION_CONFIRMATION } from 'constants/constant';
import { AppState, TProfile } from 'constants/types';
import { selectExport } from 'selectors';
import useStore from 'store';
import modalStyles from 'assets/styles/Modal.module.scss';
import styles from './Auth.module.scss';

export default function Auth() {
  const { t, i18n } = useTranslation('common');
  const importState = useStore(useCallback((state) => state.importState, []));
  const exportString = useStore(selectExport);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(false);
  const [logging, setLogging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      setSession(sessionData);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, supaSession) => {
      setSession(supaSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfile = useCallback(async () => {
    if (session) {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, updated_at`)
          .eq('id', user.id)
          .single();

        const typedData = data as TProfile;
        if (error && status !== 406) {
          throw Error(error.message);
        }

        if (typedData) {
          setUsername(typedData.username);
          setUpdatedAt(typedData.updated_at);
        }
      } catch (error) {
        toast.error(t('get_profile_error'));
      } finally {
        setLoading(false);
      }
    }
  }, [session, t]);

  const updateProfile = async () => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updates: TProfile = {
        id: user.id,
        username,
        updated_at: new Date(),
        nuzlocke: exportString,
      };

      const { error, status } = await supabase.from('profiles').upsert(updates);

      if (error) throw Error(error.message);
      if (status === 200 || status === 201) {
        toast.success(t('data_success'));
      }
    } catch (err) {
      toast.error(t('data_error'));
    } finally {
      setSaving(false);
    }
  };

  const syncNuzlockeData = async () => {
    if (session) {
      try {
        setSyncing(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, updated_at, nuzlocke`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          throw Error(error.message);
        }

        if (data.nuzlocke) {
          setUsername(data.username);
          setUpdatedAt(data.updated_at);
          const partialState: Partial<AppState> = JSON.parse(data.nuzlocke);
          if (!!partialState?.games && !!partialState?.selectedGame && !!partialState?.gamesList) {
            importState(partialState);
            toast.success(t('sync_success'));
          } else {
            throw Error(t('no_nuzlocke'));
          }
        } else {
          toast.error(t('no_nuzlocke'));
        }
      } catch (error) {
        toast.error(t('sync_error'));
      } finally {
        setSyncing(false);
      }
    }
  };

  const handleLogOut = async () => {
    if (session) {
      setLogging(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw Error(error.message);
      } catch {
        toast.error(t('logout_error'));
      } finally {
        setLogging(false);
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, [getProfile, session]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw Error(error.message);
      toast.success(t('check_email'));
    } catch (err) {
      toast.error(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleShowDelete = () => {
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const { error } = await supabase.functions.invoke('user-self-deletion');
      if (error) throw Error(error.message);
      setOpen(false);
      toast.success(t('delete_data_success'));
      setSession(null);
    } catch (err) {
      toast.error(t('delete_data_error'));
    } finally {
      setDeleting(false);
    }
  };

  const isLoading = loading || saving || syncing || logging || deleting;

  return (
    <Modal
      open={open}
      trigger={
        <Button
          aria-label="Login"
          className={styles.button}
          data-testid="authentication"
          icon
          onClick={() => setOpen(true)}
        >
          <Icon name="user" />
        </Button>
      }
    >
      <Modal.Content className={modalStyles.modal}>
        <span className={styles.beta}>BETA</span>
        {session ? (
          <section className={styles.account}>
            <p>{t('currently_logged_in')}</p>
            <span>Email: {session.user.email}</span>
            <Input
              label={t('username  ')}
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>{t('replace_nuzlocke_data')}</p>
            <Button
              color="facebook"
              className={styles.refresh}
              disabled={isLoading}
              icon
              onClick={syncNuzlockeData}
            >
              {syncing ? t('syncing') : t('obtain_nuzlocke_data')}
              <Icon name="cloud download" />
            </Button>
            <p>{t('save_nuzlocke_remotely')}</p>
            <div className={styles.refreshContainer}>
              <Button className={styles.refresh} disabled={isLoading} icon onClick={updateProfile}>
                {saving ? t('saving') : t('save_nuzlocke_data')}
                <Icon name="cloud upload" />
              </Button>
              {updatedAt && (
                <span>
                  {t('last_updated') + ' '}
                  {new Date(updatedAt).toLocaleDateString(i18n.language, {
                    weekday: 'short',
                    month: 'short',
                    year: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <p>{t('delete_nuzlocke')}</p>
            {showDelete ? (
              <div className={styles.confirmContainer}>
                <p>{t('delete_type_confirmation', { text: DELETION_CONFIRMATION })}</p>
                <Input
                  label={t('confirm_delete')}
                  type="text"
                  value={confirmText || ''}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
                <Button
                  className={styles.delete}
                  color="red"
                  disabled={isLoading || confirmText !== DELETION_CONFIRMATION}
                  icon
                  onClick={handleDelete}
                >
                  {t('delete')}
                </Button>
              </div>
            ) : (
              <Button
                className={styles.delete}
                color="red"
                disabled={isLoading}
                icon
                onClick={handleShowDelete}
              >
                {t('delete')}
              </Button>
            )}
          </section>
        ) : (
          <>
            <p>{t('login_with_email')}</p>
            <Input
              aria-label="custom-game-text"
              data-testid="add-game-input"
              label="Email"
              maxLength={50}
              onChange={(e, data) => setEmail(data.value)}
              type="email"
              value={email}
            />
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        {session ? (
          <Button disabled={isLoading} onClick={handleLogOut} primary>
            {logging ? t('logging_out') : t('logout')}
          </Button>
        ) : (
          <Button onClick={handleLogin} disabled={isLoading} primary>
            {loading ? t('sending_magic_link') : t('send_magic_link')}
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
