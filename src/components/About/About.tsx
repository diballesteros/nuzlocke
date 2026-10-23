import { useTranslation } from 'react-i18next';
import { Page } from 'common';
import amazon from 'assets/img/amazon-appstore-badge-english-white.png';
import google from 'assets/img/google-play-badge.png';
import kofi from 'assets/img/kofi2.png';

// GitHub's mark (Octicons, MIT). Lucide no longer ships brand logos.
function GitHubMark(): React.JSX.Element {
  return (
    <svg
      aria-hidden
      className="mr-1 inline-block h-[1em] w-[1.18em]"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function About(): React.JSX.Element {
  const { t } = useTranslation('about');
  return (
    <Page header={t('about')}>
      <div className="flex flex-1 flex-col flex-nowrap gap-(--spacing-3) overflow-auto text-(length:--font-size-3)! text-foreground">
        <p>
          {t('thank_you_1')}
          <b>{t('optionally')}</b> {t('thank_you_2')}
          <em>{t('coffee')}</em> {t('below')}
        </p>
        <p>
          {t('warning_message')}{' '}
          <a
            href="https://github.com/diballesteros/nuzlocke/wiki/How-data-storage-works"
            rel="noopener noreferrer"
            target="_blank"
          >
            How data storage works
          </a>
        </p>
        <h3 className="m-0! text-(length:--font-size-6)!">{t('credits')}:</h3>
        <ul className="m-0 flex max-h-[45%] flex-col flex-nowrap gap-(--spacing-2) overflow-auto">
          <li>Google Play and the Google Play logo are trademarks of Google LLC.</li>
          <li>
            {t('images_provided')}
            <a
              href="https://bulbapedia.bulbagarden.net/wiki/Main_Page"
              title="Bulbapedia"
              rel="noopener noreferrer"
              target="_blank"
            >
              Bulbapedia
            </a>
          </li>
          <li>
            {t('icons_made')}
            <a
              href="http://www.dariusdan.com"
              title="Darius Dan"
              rel="noopener noreferrer"
              target="_blank"
            >
              Darius Dan
            </a>{' '}
            {t('from')}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.flaticon.com
            </a>
          </li>
          <li>
            {t('icons_made')}
            <a
              href="http://www.roundicons.com"
              title="Roundicons Freebies"
              rel="noopener noreferrer"
              target="_blank"
            >
              Roundicons Freebies
            </a>{' '}
            {t('from')}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.flaticon.com
            </a>
          </li>
          <li>
            {t('icons_made')}
            <a
              href="https://www.flaticon.com/authors/nikita-golubev"
              title="Nikita Golubev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Nikita Golubev
            </a>{' '}
            {t('from')}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.flaticon.com
            </a>
          </li>
          <li>
            {t('icons_made')}
            <a
              href="https://www.freepik.com"
              title="Freepik"
              rel="noopener noreferrer"
              target="_blank"
            >
              Freepik
            </a>{' '}
            {t('from')}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.flaticon.com
            </a>
          </li>
          <li>
            {t('icons_made')}
            <a
              href="https://www.flaticon.com/authors/vectors-market"
              title="Vectors Market"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vectors Market
            </a>{' '}
            {t('from')}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.flaticon.com
            </a>
          </li>
          <li>
            {t('nickname_list')}
            <a
              href="https://www.findnicknames.com/pokemon-nicknames/"
              title="findnicknames"
              rel="noopener noreferrer"
              target="_blank"
            >
              Find Nicknames
            </a>
          </li>
          <li>
            {t('favicon_provided')}
            <a
              href="https://icon-icons.com/users/b1kqPGvWi4JzKkAi8Q0MR/icon-sets/"
              title="findnicknames"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mohammad Ali
            </a>{' '}
            {t('from')}
            <a
              href="https://icon-icons.com/"
              title="icon-icons"
              rel="noopener noreferrer"
              target="_blank"
            >
              Icon-icons{' '}
            </a>{' '}
            {t('under_the')}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              title="creative commons"
              rel="noopener noreferrer"
              target="_blank"
            >
              Creative Commons License
            </a>
          </li>
        </ul>
        <a href="https://ko-fi.com/X8X05XBDC" rel="noreferrer" target="_blank">
          <img style={{ border: 0, height: 36 }} src={kofi} alt="Buy Me a Coffee at ko-fi.com" />
        </a>
        <div className="flex flex-row flex-wrap items-center gap-(--spacing-3)">
          <a
            className="h-[6.071rem] [&>img]:h-full"
            href="https://play.google.com/store/apps/details?id=app.netlify.nuzlocke.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt="Get it on Google Play" src={google} />
          </a>
          <a
            href="https://www.amazon.com/dp/B09GFF7VCB/ref=apps_sf_sta"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt="Get it on Amazon appstore" src={amazon} />
          </a>
          {/* <a
            href="https://apps.apple.com/us/app/nuzlocke-tracker/id1595977751"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt="Get it on App Store" src={apple} />
          </a> */}
        </div>
        <div className="flex flex-row flex-wrap gap-(--spacing-2)">
          <a
            className="relative flex h-[3.429rem] items-center justify-center rounded-[4px] border-2 border-solid border-white p-(--spacing-2) text-(length:--font-size-7) text-white! hover:bg-white hover:text-black!"
            href="https://github.com/diballesteros/nuzlocke/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubMark />
            <span className="text-(length:--font-size-2)">{t('source')}</span>
          </a>
        </div>
      </div>
    </Page>
  );
}

export default About;
