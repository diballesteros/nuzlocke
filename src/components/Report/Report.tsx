import { useTranslation } from 'react-i18next';
import { Page } from 'common';

function Report(): React.JSX.Element {
  const { t } = useTranslation('report');

  return (
    <Page header={t('report_a_bug')}>
      <form
        className="flex flex-col flex-nowrap gap-(--spacing-1) text-foreground"
        name="contact"
        method="post"
      >
        <input type="hidden" name="form-name" value="contact" />
        <label className="flex flex-col flex-nowrap">
          {t('type')}:
          <select name="type" data-testid="report-type">
            <option value="bug">Bug</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </label>
        <label className="flex flex-col flex-nowrap">
          {t('device')}:
          <select name="device" data-testid="report-device">
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </label>
        <label className="flex flex-col flex-nowrap">
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
        <label className="flex flex-col flex-nowrap">
          {t('browser')}:
          <select name="browser" data-testid="report-browser">
            <option value="googlechrome">Google Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="edge">Edge</option>
            <option value="safari">Safari</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="flex flex-col flex-nowrap">
          {t('selected_game')}:
          <input
            maxLength={100}
            name="selectedgame"
            data-testid="report-selectedgame"
            type="text"
          />
        </label>
        <label className="flex flex-col flex-nowrap">
          {t('description')}:
          <textarea maxLength={1000} name="description" data-testid="report-description" />
        </label>
        <button className="w-[5.714rem]" type="submit">
          {t('send')}
        </button>
      </form>
    </Page>
  );
}

export default Report;
