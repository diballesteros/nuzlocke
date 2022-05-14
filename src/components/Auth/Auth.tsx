import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { supabase } from 'supabaseClient';
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

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, supaSession) => {
      setSession(supaSession);
    });
  }, []);

  const getProfile = useCallback(async () => {
    if (session) {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        const { data, error, status } = await supabase
          .from<TProfile>('profiles')
          .select(`username, updated_at`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          throw Error(error.message);
        }

        if (data) {
          setUsername(data.username);
          setUpdatedAt(data.updated_at);
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
      const user = supabase.auth.user();

      const updates: TProfile = {
        id: user.id,
        username,
        updated_at: new Date(),
        nuzlocke: exportString,
      };

      const { error, status } = await supabase
        .from<TProfile>('profiles')
        .upsert(updates, { returning: 'minimal' });

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
        const user = supabase.auth.user();

        const { data, error, status } = await supabase
          .from<TProfile>('profiles')
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

  const onLogOut = async () => {
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
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw Error(error.message);
      toast.success(t('check_email'));
    } catch (err) {
      toast.error(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || saving || syncing || logging;

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
        <span className={styles.beta}>ALPHA</span>
        <u className={styles.warning}>
          This feature is in <b>alpha</b> and will be undergoing heavy changes in the coming weeks.
          Please take that into consideration when using it!
        </u>
        {session ? (
          <section className={styles.account}>
            <p>{t('currently_logged_in')}</p>
            <span>Email: {session.user.email}</span>
            <Input
              label="Username"
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
            <p>
              The following option will save your Nuzlocke Data remotely (This does not happen
              automatically):
            </p>
            <div className={styles.refreshContainer}>
              <Button className={styles.refresh} disabled={isLoading} icon onClick={updateProfile}>
                {saving ? 'Saving' : 'Save Nuzlocke Data and Username'}
                <Icon name="cloud upload" />
              </Button>
              <span>
                Last updated:{' '}
                {new Date(updatedAt).toLocaleDateString(i18n.language, {
                  weekday: 'short',
                  month: 'short',
                  year: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </section>
        ) : (
          <>
            <p>
              Login with an email. You can upload your nuzlocke data to access it from a different
              device.
            </p>
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
          <Button disabled={isLoading} onClick={onLogOut} primary>
            {logging ? 'Logging out' : 'Logout'}
          </Button>
        ) : (
          <Button onClick={handleLogin} disabled={isLoading} primary>
            {loading ? 'Sending magic link...' : 'Send magic link'}
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
