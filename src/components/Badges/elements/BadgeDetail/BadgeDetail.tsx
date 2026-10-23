import { Pokemon } from '@smogon/calc';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PkmImage } from 'common';
import { Moves, PokemonType } from 'components';
import { getGenderIcon } from 'components/PokeInfo/PokeInfo';
import { TYPE_COLOR } from 'constants/colors';
import {
  D_STAT_COLOR,
  GAME_GENERATION,
  getSmogonItemName,
  PHYS_SPEC_SPLIT,
  STAT_COLOR,
} from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import type { TDetail } from 'constants/types';
import { getSmogonName } from 'hooks/useCalculate';
import useStore from 'store';
import { RadioGroup, RadioGroupOption } from '@/components/ui/radio-group';

// An ability or item: a caption over its value
const LABEL = 'flex flex-col flex-nowrap items-center gap-(--spacing-1) text-foreground';

interface BadgeDetailProps {
  selectedDetail: TDetail;
}

function BadgeDetail({ selectedDetail }: BadgeDetailProps): React.JSX.Element {
  const { t } = useTranslation('badges');
  const [view, setView] = useState(0);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const isSplit = !PHYS_SPEC_SPLIT.includes(selectedGame?.value);
  const colors = darkMode ? D_STAT_COLOR : STAT_COLOR;

  const getContent = () => {
    if (!!selectedDetail?.rematch && view === 1) {
      return selectedDetail.rematch;
    }
    return selectedDetail?.content;
  };
  return (
    <>
      <div className="text-(length:--font-size-6) font-bold text-foreground">
        {selectedDetail?.name}
      </div>
      {selectedDetail?.type === 'REMATCH' && (
        <RadioGroup
          aria-label={selectedDetail?.name}
          className="mb-(--spacing-1) flex gap-(--spacing-3)"
          onValueChange={(value) => setView(Number(value))}
          value={String(view)}
        >
          <RadioGroupOption label={t('original')} labelClassName="text-foreground" value="0" />
          <RadioGroupOption label={t('rematch')} labelClassName="text-foreground" value="1" />
        </RadioGroup>
      )}
      <div>
        <span className="text-foreground">{t('detail_reminder')}</span>
      </div>
      <div className="flex flex-col flex-nowrap gap-(--spacing-3) overflow-auto">
        {getContent()?.map((pokemon, ind) => {
          const poke = POKEMAP.get(pokemon.id);
          let stats = undefined;
          try {
            stats = new Pokemon(GAME_GENERATION[selectedGame?.value], getSmogonName(poke.text), {
              level: pokemon?.level,
            });
          } catch {
            // do nothing
          }

          return (
            <div
              className="flex flex-col flex-nowrap gap-(--spacing-2) rounded-[4px] p-(--spacing-2)"
              key={`pokemon-${pokemon.id}-${ind + 1}`}
              style={{ border: `2px solid ${TYPE_COLOR[poke?.type]}` }}
            >
              <div className="flex items-center justify-evenly gap-(--spacing-7)">
                <div className="flex flex-col flex-nowrap items-center gap-(--spacing-2) text-foreground [&>span]:text-(length:--font-size-4)">
                  {selectedDetail?.type === 'TRIAL' && ind === 0 && (
                    <span className="font-bold underline">TOTEM</span>
                  )}
                  {selectedDetail?.type === 'DYNAMAX' &&
                    ind === (selectedDetail?.content?.length ?? 0) - 1 && (
                      <span className="font-bold underline">DYNAMAX</span>
                    )}
                  <div className="flex h-[3.5rem] w-[4.5rem] items-center justify-center">
                    <PkmImage name={poke?.text} />
                  </div>
                  <span>
                    {poke?.text} <span>{getGenderIcon(pokemon.gender)}</span>
                  </span>
                  <span>Lv. {pokemon?.level}</span>
                </div>
                <div className="flex flex-col flex-nowrap gap-(--spacing-2)">
                  <PokemonType pokemon={poke} />
                  {!!pokemon?.ability && (
                    <div className={LABEL}>
                      <span className="text-(length:--font-size-2)">{t('ability')}:</span>
                      <span className="text-(length:--font-size-3)">{pokemon?.ability}</span>
                    </div>
                  )}
                  {!!pokemon?.item && (
                    <div className={LABEL}>
                      <span className="text-(length:--font-size-2)">{t('item')}:</span>
                      <div className="flex items-center pl-(--spacing-2)">
                        <span className="text-(length:--font-size-3)">{pokemon?.item}</span>
                        <div className="pkitem-wrapper">
                          <div className={`pkitem pkitem-${getSmogonItemName(pokemon?.item)}`} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-(--spacing-2) max-sm:flex-col max-sm:flex-nowrap [&>div]:flex-1">
                {stats?.stats && (
                  <div className="grid grid-cols-[var(--spacing-6)_var(--spacing-6)_minmax(0,1fr)] gap-(--spacing-2) text-(length:--font-size-3) font-bold">
                    {Object.entries(stats.stats).map(([key, value]) => (
                      <React.Fragment key={`${key}-${value}`}>
                        <span className="text-foreground">{t(key)}:</span>
                        <span style={{ color: colors[key][0] }}>{value}</span>
                        <div
                          className="h-(--spacing-4)"
                          style={{
                            width: `${(value / 450) * 100}%`,
                            backgroundColor: colors[key][0],
                            border: `1px solid ${colors[key][1]}`,
                          }}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <Moves moves={pokemon?.moves} showStatus={isSplit} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default BadgeDetail;
