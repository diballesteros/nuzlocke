import React, { useCallback, useState } from 'react';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import useStore from 'store';
import NICKNAMES from 'constants/nicknames';
import styles from './Nickname.module.scss';

interface NicknameProps {
  encounterId: number;
  nickname?: string;
}

const Nickname: React.FC<NicknameProps> = ({ encounterId, nickname }) => {
  const changeNickname = useStore((state) => state.changeNickname);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [nick, setNick] = useState(nickname ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNick(e.target.value);
  };

  const handleBlur = () => {
    changeNickname(encounterId, nick);
  };

  const handleRandomize = () => {
    changeNickname(encounterId, NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]);
  };

  return (
    <label className={styles.label}>
      <span className={styles.innerLabel}>Nickname:</span>
      <Input
        aria-label="nickname"
        className={styles.nicknameInput}
        data-testid={`nickname-${encounterId}`}
        fluid
        id={`nickname-${encounterId}`}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter..."
        value={nick}
      >
        <input />
        <Button
          aria-label="randomize"
          icon="random"
          inverted={darkMode}
          onClick={handleRandomize}
          title="Randomize"
          type="button"
        />
      </Input>
    </label>
  );
};

export default Nickname;
