import React from 'react';
import { SPECIAL_NAMES } from 'constants/constant';

interface PkmImageProps {
  name: string;
  shiny?: boolean;
}

const getParsedName = (name: string) => {
  if (SPECIAL_NAMES[name]) {
    return SPECIAL_NAMES[name];
  }
  return name.toLowerCase();
};

const PkmImage = React.memo(function PkmImage({ name, shiny = false }: PkmImageProps) {
  return (
    <div
      className={`pkm ${shiny ? 'shiny' : ''} pkm-${getParsedName(name)}`}
      role="img"
      style={{ transform: 'scale(1.25)' }}
    />
  );
});

export default PkmImage;
