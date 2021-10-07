import React from 'react';
import { Page } from 'common';
import amazon from 'assets/img/amazon-appstore-badge-english-white.png';
import google from 'assets/img/google-play-badge.png';
import kofi from 'assets/img/kofi2.png';
import { ReactComponent as MicrosoftSVG } from 'assets/svg/English_get.svg';
import styles from './About.module.scss';

function About(): JSX.Element {
  return (
    <Page header="About">
      <div className={styles.about}>
        <p>
          Thank you for using Nuzlocke Tracker! Me and fellow contributors are actively improving
          this app in our free time. If you like the app please rate it in the Microsoft Store,
          Google Play or the Amazon Appstore. Also, check out ways to <b>optionally</b> support the
          app below.
        </p>
        <h3>Credits:</h3>
        <ul className={styles.credits}>
          <li>Google Play and the Google Play logo are trademarks of Google LLC.</li>
          <li>
            Images provided by{' '}
            <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" title="Bulbapedia">
              Bulbapedia
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="http://www.dariusdan.com" title="Darius Dan">
              Darius Dan
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="http://www.roundicons.com" title="Roundicons Freebies">
              Roundicons Freebies
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">
              Nikita Golubev
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.freepik.com" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">
              Vectors Market
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Nickname list provided by{' '}
            <a href="https://www.findnicknames.com/pokemon-nicknames/" title="findnicknames">
              Find Nicknames
            </a>
          </li>
          <li>
            Favicon provided by{' '}
            <a
              href="https://icon-icons.com/users/b1kqPGvWi4JzKkAi8Q0MR/icon-sets/"
              title="findnicknames"
            >
              Mohammad Ali
            </a>{' '}
            from
            <a href="https://icon-icons.com/" title="icon-icons">
              Icon-icons{' '}
            </a>{' '}
            under the{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" title="creative commons">
              Creative Commons License
            </a>
          </li>
        </ul>
        <div className={styles.support}>
          <a href="https://ko-fi.com/X8X05XBDC" rel="noreferrer" target="_blank">
            <img style={{ border: 0, height: 36 }} src={kofi} alt="Buy Me a Coffee at ko-fi.com" />
          </a>
          <a
            className={styles.patron}
            href="https://www.patreon.com/bePatron?u=60585540"
            rel="noopener noreferrer"
            target="_blank"
          >
            Become a Patron!
          </a>
        </div>
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
        </div>
      </div>
    </Page>
  );
}

export default About;
