import { useTranslation } from 'react-i18next';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { Page } from 'common';
import amazon from 'assets/img/amazon-appstore-badge-english-white.png';
import google from 'assets/img/google-play-badge.png';
import kofi from 'assets/img/kofi2.png';
import apple from 'assets/svg/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import { ReactComponent as MicrosoftSVG } from 'assets/svg/English_get.svg';
import styles from './About.module.scss';

function About(): JSX.Element {
  const { t } = useTranslation('about');
  return (
    <Page header={t('about')}>
      <div className={styles.about}>
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
        <h3>{t('credits')}:</h3>
        <ul className={styles.credits}>
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
        <div className={styles.stores}>
          <a
            className={styles.microsoft}
            href="//www.microsoft.com/store/apps/9PCM3Z3K0FTG?cid=storebadge&ocid=badge"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MicrosoftSVG />
          </a>
          <a
            className={styles.playstore}
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
          <a
            href="https://apps.apple.com/us/app/nuzlocke-tracker/id1595977751"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt="Get it on App Store" src={apple} />
          </a>
        </div>
        <div className={styles.socials}>
          <a
            className={styles.socialButton}
            data-show-count="false"
            href="https://twitter.com/relatablecoder?ref_src=twsrc%5Etfw"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="twitter square" />
            <span>{t('follow')}</span>
          </a>
          <a
            className={styles.socialButton}
            href="https://github.com/diballesteros/nuzlocke/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="github" />
            <span>{t('source')}</span>
          </a>
        </div>
      </div>
    </Page>
  );
}

export default About;
