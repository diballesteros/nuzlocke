import React, { useState } from 'react';
import Radio from 'semantic-ui-react/dist/commonjs/addons/Radio';
import { Moves, PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import POKEMON from 'constants/pokemon';
import { TDetail } from 'constants/types';
import styles from './BadgeDetail.module.scss';

interface BadgeDetailProps {
  selectedDetail: TDetail;
}

function BadgeDetail({ selectedDetail }: BadgeDetailProps): JSX.Element {
  const [view, setView] = useState(0);

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
            label="Original"
            onChange={(e, data) => setView(data.value as number)}
            value={0}
          />
          <Radio
            checked={view === 1}
            label="Rematch"
            onChange={(e, data) => setView(data.value as number)}
            value={1}
          />
        </div>
      )}
      <div className={styles.gymPokemon}>
        {getContent()?.map((pokemon, ind) => {
          const poke = POKEMON.find((item) => item.value === pokemon.id);
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
                    ind === selectedDetail?.content?.length - 1 && (
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
                      <span>Ability:</span>
                      <span className={styles.value}>{pokemon?.ability}</span>
                    </div>
                  )}
                  {!!pokemon?.item && (
                    <div className={styles.pokemonLabel}>
                      <span>Item:</span>
                      <span className={styles.value}>{pokemon?.item}</span>
                    </div>
                  )}
                </div>
              </div>
              <Moves moves={pokemon?.moves} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default BadgeDetail;
