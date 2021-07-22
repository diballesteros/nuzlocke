import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import useStore from 'store';
import styles from './Nickname.module.scss';

interface NicknameProps {
  encounterId: number;
  nickname?: string;
}

const Nickname: React.FC<NicknameProps> = ({ encounterId, nickname }) => {
  const changeStatus = useStore((state) => state.changeNickname);
  const [nick, setNick] = useState(nickname ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNick(e.target.value);
  };

  const handleBlur = () => {
    changeStatus(encounterId, nick);
  };

  return (
    <label className={styles.label}>
      Nickname:{' '}
      <Input
        aria-label="nickname"
        className={styles.nicknameInput}
        fluid
        id={`nickname-${encounterId}`}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter a nickname..."
        value={nick}
      />
    </label>
  );
};

export default Nickname;
