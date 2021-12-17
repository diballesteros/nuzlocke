import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { Moves, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import { PHYS_SPEC_SPLIT } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import type { TDetail } from 'constants/types';
import useStore from 'store';
import styles from './BadgeDetail.module.scss';

interface BadgeDetailProps {
  selectedDetail: TDetail;
}

function BadgeDetail({ selectedDetail }: BadgeDetailProps): JSX.Element {
  const { t } = useTranslation('badges');
  const [view, setView] = useState(0);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const isSplit = !PHYS_SPEC_SPLIT.includes(selectedGame?.value);

  const getContent = () => {
    if (!!selectedDetail?.rematch && view === 1) {
      return selectedDetail.rematch;
    }
    return selectedDetail?.content;
  };
  return (
    <>
      <div className={styles.title}>{selectedDetail?.name}</div>
      {selectedDetail?.type === 'REMATCH' && (
        <div className={styles.rematch}>
          <Radio
            checked={view === 0}
            label={t('original')}
            onChange={(e, data) => setView(data.value as number)}
            value={0}
          />
          <Radio
            checked={view === 1}
            label={t('rematch')}
            onChange={(e, data) => setView(data.value as number)}
            value={1}
          />
        </div>
      )}
      <div className={styles.gymPokemon}>
        {getContent()?.map((pokemon, ind) => {
          const poke = POKEMAP.get(pokemon.id);
          return (
            <div
              className={styles.pokemon}
              key={`pokemon-${pokemon.id}-${ind + 1}`}
              style={{ border: `2px solid ${TYPE_COLOR[poke?.type]}` }}
            >
              <div className={styles.pokemonHeader}>
                <div className={styles.pokemonName}>
                  {selectedDetail?.type === 'TRIAL' && ind === 0 && (
                    <span className={styles.totem}>TOTEM</span>
                  )}
                  {selectedDetail?.type === 'DYNAMAX' &&
                    ind === (selectedDetail?.content?.length ?? 0) - 1 && (
                      <span className={styles.totem}>DYNAMAX</span>
                    )}
                  <img src={poke?.image} alt={poke?.text} />
                  <span>{poke?.text}</span>
                  <span>Lv. {pokemon?.level}</span>
                </div>
                <div className={styles.pokemonDetails}>
                  <PokemonType pokemon={poke} />
                  {!!pokemon?.ability && (
                    <div className={styles.pokemonLabel}>
                      <span>{t('ability')}:</span>
                      <span className={styles.value}>{pokemon?.ability}</span>
                    </div>
                  )}
                  {!!pokemon?.item && (
                    <div className={styles.pokemonLabel}>
                      <span>{t('item')}:</span>
                      <span className={styles.value}>{pokemon?.item}</span>
                    </div>
                  )}
                </div>
              </div>
              <Moves moves={pokemon?.moves} showStatus={isSplit} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default BadgeDetail;
