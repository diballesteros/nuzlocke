import { SPECIAL_NAMES } from 'constants/constant';

interface PkmImageProps {
  name: string;
}

const getParsedName = (name: string) => {
  if (SPECIAL_NAMES[name]) {
    return SPECIAL_NAMES[name];
  }
  return name.toLowerCase();
};

function PkmImage({ name }: PkmImageProps): JSX.Element {
  return (
    <div
      className={`pkm pkm-${getParsedName(name)}`}
      role="img"
      style={{ transform: 'scale(1.25)' }}
    />
  );
}

export default PkmImage;
