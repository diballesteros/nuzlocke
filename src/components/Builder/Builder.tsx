import React from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Builder.module.scss';

const Builder: React.FC = () => {
  return (
    <div className={styles.builder}>
      <div className={styles.placeholder}>
        <PokeballSVG />
        <span>Tap + to begin building a team</span>
      </div>
      <Button className={styles.button} circular icon="plus" type="button" />
    </div>
  );
};

export default Builder;
