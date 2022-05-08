import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { supabase } from 'supabaseClient';
import modalStyles from 'assets/styles/Modal.module.scss';
import styles from './Auth.module.scss';

export default function Auth() {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(false);
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
          .from('profiles')
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
        toast.error('Unable to get profile');
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  const updateProfile = async () => {
    try {
      setSaving(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, { returning: 'minimal' });
      if (error) throw Error(error.message);
    } catch (err) {
      toast.error('Unable to update profile');
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
        } else {
          toast.error('No Nuzlocke data found');
        }
      } catch (error) {
        toast.error('Unable to sync profile');
      } finally {
        setSyncing(false);
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
      toast.success('Check your email for the login link');
    } catch (err) {
      toast.error('Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || saving || syncing;

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
        {session ? (
          <section className={styles.account}>
            <p>You are currently logged in with:</p>
            <span>Email: {session.user.email}</span>
            <Input
              label="Username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p>
              The following option will obtain Nuzlocke data from the server and replace your
              current Nuzlocke Data:
            </p>
            <Button
              color="facebook"
              className={styles.refresh}
              disabled={isLoading}
              icon
              onClick={syncNuzlockeData}
            >
              {syncing ? 'Syncing' : 'Obtain and Sync Nuzlocke Data'}
              <Icon name="cloud download" />
            </Button>
            <p>The following option will save your Nuzlocke Data remotely:</p>
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
          <Button disabled={isLoading} primary>
            Logout
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
