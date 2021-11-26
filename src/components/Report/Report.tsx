import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import modalStyles from 'assets/styles/Modal.module.scss';

function Report(): JSX.Element {
  const { t } = useTranslation('report');

  return (
    <Page header={t('report_a_bug')}>
      <form className={modalStyles.modalColor} name="contact" method="post">
        <input type="hidden" name="form-name" value="contact" />
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('type')}:
          <select name="type" data-testid="report-type">
            <option value="bug">Bug</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('device')}:
          <select name="device" data-testid="report-device">
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('os')}:
          <select name="os" data-testid="report-os">
            <option value="windows">Windows</option>
            <option value="mac">MAC</option>
            <option value="linux">Linux</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('browser')}:
          <select name="browser" data-testid="report-browser">
            <option value="googlechrome">Google Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="edge">Edge</option>
            <option value="safari">Safari</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('selected_game')}:
          <input name="selectedgame" data-testid="report-selectedgame" type="text" />
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {t('description')}:
          <textarea name="description" data-testid="report-description" />
        </label>
        <button style={{ width: '5.714rem' }} type="submit">
          {t('send')}
        </button>
      </form>
    </Page>
  );
}

export default Report;
