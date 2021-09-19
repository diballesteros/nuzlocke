import React, { LegacyRef, useCallback, useMemo } from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import useStore from 'store';
import shallow from 'zustand/shallow';
import POKEMON from 'constants/pokemon';
import { TYPE_COUNT } from 'constants/constant';
import { Type } from 'constants/types';
import { TYPE_COLOR } from 'constants/colors';
import { Moves, PokeInfo } from 'components';
import { RuleContent } from 'components/Rules/elements';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as ShinySVG } from 'assets/svg/shiny.svg';
import styles from './Image.module.scss';

const CALC = 140 * Math.PI;

interface ImageProps {
  forwardedRef?: LegacyRef<HTMLDivElement>;
  responsive?: boolean;
}

const Image: React.FC<ImageProps> = ({ forwardedRef, responsive = false }) => {
  const badges = useStore(useCallback((state) => state.badges, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const games = useStore(useCallback((state) => state.games, []));

  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const summary = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.summary[state?.selectedGame?.value] : null),
      []
    )
  );

  const completion = useMemo(() => {
    const encountered = games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc.pokemon && enc.status;
    });
    return !!encountered ? encountered?.length / games[selectedGame?.value]?.encounters?.length : 0;
  }, [games, selectedGame]);

  const types = useMemo(() => {
    const TEMP = { ...TYPE_COUNT };

    games[selectedGame?.value]?.encounters?.forEach((enc) => {
      const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
      if (!!foundPokemon) {
        TEMP[foundPokemon.type] += 1;
        if (foundPokemon.dualtype) {
          TEMP[foundPokemon.dualtype] += 1;
        }
      }
    });

    return Object.entries(TEMP).map((entry) => {
      return { title: entry[0] as Type, value: entry[1], color: TYPE_COLOR[entry[0] as Type] };
    });
  }, [games, selectedGame]);

  const getStatus = () => {
    switch (summary?.status) {
      case 0:
        return (
          <b style={{ color: '#FBD200' }}>
            ONGOING <Icon name="refresh" />
          </b>
        );
      case 1:
        return (
          <b style={{ color: 'green' }}>
            COMPLETE <Icon name="check" />
          </b>
        );
      case 2:
        return (
          <b style={{ color: 'red' }}>
            FAILED <Icon name="x" />
          </b>
        );
      default:
        return null;
    }
  };

  const teamPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 7;
    });
  }, [games, selectedGame]);

  const boxedPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return (
        enc?.status?.value === 1 ||
        enc?.status?.value === 3 ||
        enc?.status?.value === 4 ||
        enc?.status?.value === 6
      );
    });
  }, [games, selectedGame]);

  const caughtPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return (
        enc?.status?.value === 1 ||
        enc?.status?.value === 3 ||
        enc?.status?.value === 4 ||
        enc?.status?.value === 6 ||
        enc?.status?.value === 7
      );
    });
  }, [games, selectedGame]);

  const faintedPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 2;
    });
  }, [games, selectedGame]);

  const failedPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 5;
    });
  }, [games, selectedGame]);

  const shinyPokemon = useMemo(() => {
    return games[selectedGame?.value]?.encounters?.filter((enc) => {
      return enc?.status?.value === 6;
    });
  }, [games, selectedGame]);

  return (
    <div className={`${styles.summary} ${responsive ? styles.responsive : ''}`} ref={forwardedRef}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{summary?.title}</span>
        {getStatus()}
        <div className={styles.badges}>
          {!!selectedGame &&
            badges[selectedGame?.value]?.map((badge, index) => {
              return (
                <img
                  alt={badge.name}
                  className={`${styles.badge} ${
                    index <= games[selectedGame?.value]?.badge ? styles.active : ''
                  }`}
                  key={`${badge.name}-${badge.id}`}
                  src={badge.src}
                />
              );
            })}
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.title}>TEAM</span>
        <div className={styles.team}>
          {teamPokemon?.map((enc) => {
            const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
            return (
              <div className={styles.pokemon} key={`team-${enc.id}`}>
                <img src={foundPokemon?.image} alt={foundPokemon?.text} />
                <PokeInfo encounter={enc} pokemon={foundPokemon} />
                <Moves moves={enc?.details?.moves} />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.row}>
        {summary?.encounters && (
          <div className={`${styles.card} ${styles.large}`}>
            <span className={styles.title}>ENCOUNTERS</span>
            <div className={styles.encounters}>
              <div className={styles.completion}>
                <svg className={styles.circle} width="150" height="150" viewBox="0 0 150 150">
                  <circle className={styles.circlebg} cx={75} cy={75} r="70" strokeWidth="10px" />
                  <circle
                    className={styles.progress}
                    cx={75}
                    cy={75}
                    r="70"
                    strokeWidth="10px"
                    style={{
                      strokeDasharray: CALC,
                      strokeDashoffset: CALC - CALC * completion,
                    }}
                    transform="rotate(-90 75 75)"
                  />
                  <text className={styles.text} x="50%" y="50%" dy=".3em" textAnchor="middle">
                    {completion ? (completion * 100)?.toFixed(0) : 0}%
                  </text>
                </svg>
                <b>COMPLETION</b>
              </div>
              <div className={styles.byType}>
                <b>All Encounters by Type</b>
                <div className={styles.byTypeContainer}>
                  {types.map((type) => {
                    return (
                      <div
                        className={styles.type}
                        key={`type-${type.title}`}
                        style={{ backgroundColor: type.color }}
                      >
                        {type.title} {type.value}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {summary?.stats && (
          <div className={`${styles.card} ${styles.small}`}>
            <span className={styles.title}>STATS</span>
            <div className={styles.stat}>
              <CaughtSVG className={styles.team} />
              <b>Caught</b>
              <Label>{caughtPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FailedSVG className={styles.team} />
              <b>Failed</b>
              <Label>{failedPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FaintedSVG className={styles.team} />
              <b>Fainted</b>
              <Label>{faintedPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <ShinySVG className={styles.team} />
              <b>Shiny</b>
              <Label>{shinyPokemon?.length || 0}</Label>
            </div>
          </div>
        )}
      </div>
      {boxedPokemon?.length > 0 && summary?.boxed && (
        <div className={styles.row}>
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>BOXED</span>
            <div className={styles.box}>
              {boxedPokemon.map((box, i) => {
                const foundPokemon = POKEMON.find((poke) => poke.value === box.pokemon);
                return (
                  <img
                    alt={foundPokemon?.text}
                    className={styles.pokeImg}
                    data-testid={`image-box-${i}-${responsive}`}
                    key={`boxed-${i + 1}`}
                    src={foundPokemon?.image}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      {faintedPokemon?.length > 0 && summary?.fainted && (
        <div className={styles.row}>
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>FAINTED</span>
            <div className={styles.box}>
              {faintedPokemon.map((faint, i) => {
                const foundPokemon = POKEMON.find((poke) => poke.value === faint.pokemon);
                return (
                  <img
                    alt={foundPokemon?.text}
                    className={styles.pokeImg}
                    data-testid={`image-fainted-${i}-${responsive}`}
                    key={`fainted-${i + 1}`}
                    src={foundPokemon?.image}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className={styles.row}>
        {summary?.rules && (
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>RULES</span>
            <div className={styles.rules}>
              {rules[selectedRuleset].map((rule, i) => {
                return <RuleContent hideSmart key={`sumrule-${i + 1}`} i={i} rule={rule} />;
              })}
            </div>
          </div>
        )}
        {summary?.showDescription && (
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>DESCRIPTION</span>
            <p>{summary?.description || ''}</p>
          </div>
        )}
      </div>
      <span className={styles.credit}>https://nuzlocke.netlify.app</span>
    </div>
  );
};

Image.propTypes = {};

export default Image;
