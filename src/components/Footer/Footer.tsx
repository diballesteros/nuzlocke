import React from 'react';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import styles from './Footer.module.scss';

const Footer: React.FC = React.memo(() => {
  return (
    <footer className={styles.footer}>
      <b className={styles.name}>Nuzlocke Tracker</b>
      <span className={styles.pokemon}>
        Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and
        Pokémon character names are trademarks of Nintendo.
      </span>
      <div className={styles.socials}>
        <a
          className={styles.github}
          data-show-count="false"
          href="https://twitter.com/relatablecoder?ref_src=twsrc%5Etfw"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="twitter square" />
          <span>Follow</span>
        </a>
        <a
          className={styles.github}
          href="https://github.com/diballesteros/nuzlocke/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon name="github" />
          <span>Source</span>
        </a>
      </div>
    </footer>
  );
});

export default Footer;
