import { LegacyRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import { shallow } from 'zustand/shallow';
import { PkmImage } from 'common';
import { Moves, PokeInfo } from 'components';
import { Tip } from 'components/Pokestats/elements';
import { RuleContent } from 'components/Rules/elements';
import { BADGE_IMAGES } from 'constants/badges';
import { TYPE_COLOR } from 'constants/colors';
import { TYPE_COUNT } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import type { Type } from 'constants/types';
import {
  selectBoxed,
  selectCaught,
  selectCompletion,
  selectFailed,
  selectFainted,
  selectShiny,
  selectTeam,
} from 'selectors';
import useStore from 'store';
import { ReactComponent as CaughtSVG } from 'assets/svg/caught.svg';
import { ReactComponent as FailedSVG } from 'assets/svg/failed.svg';
import { ReactComponent as FaintedSVG } from 'assets/svg/fainted.svg';
import { ReactComponent as ShinySVG } from 'assets/svg/shiny.svg';
import styles from './Image.module.scss';

const CALC = 140 * Math.PI;

interface ImageProps {
  forwardedRef?: LegacyRef<HTMLDivElement>;
  responsive?: boolean;
}

function Image({ forwardedRef, responsive = false }: ImageProps): JSX.Element {
  const { t } = useTranslation('stats');
  const badges = useStore(useCallback((state) => state.badges, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const games = useStore(useCallback((state) => state.games, []));
  const teamPokemon = useStore(selectTeam);
  const boxedPokemon = useStore(selectBoxed);
  const faintedPokemon = useStore(selectFainted);
  const caughtPokemon = useStore(selectCaught);
  const completion = useStore(selectCompletion);
  const failedPokemon = useStore(selectFailed);
  const shinyPokemon = useStore(selectShiny);
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
  const setDefaultSummary = useStore(useCallback((state) => state.setDefaultSummary, []));

  useEffect(() => {
    if (!!selectedGame && responsive && !summary) {
      setDefaultSummary();
    }
  }, [responsive, selectedGame, setDefaultSummary, summary]);

  const types = useMemo(() => {
    const TEMP = { ...TYPE_COUNT };

    games[selectedGame?.value]?.encounters?.forEach((enc) => {
      const foundPokemon = POKEMAP.get(enc.pokemon);
      if (foundPokemon) {
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
            {t('ongoing')} <Icon name="refresh" />
          </b>
        );
      case 1:
        return (
          <b style={{ color: 'green' }}>
            {t('complete')} <Icon name="check" />
          </b>
        );
      case 2:
      default:
        return (
          <b style={{ color: 'red' }}>
            {t('Failed')} <Icon name="x" />
          </b>
        );
    }
  };

  return (
    <div className={`${styles.summary} ${responsive ? styles.responsive : ''}`} ref={forwardedRef}>
      <div className={styles.header} data-testid={`image-header-${responsive}`}>
        <span className={styles.headerTitle}>{summary?.title}</span>
        {getStatus()}
        <div className={styles.badges}>
          {!!selectedGame &&
            badges[selectedGame?.value]?.map((badge, index) => {
              const badgeArr = games[selectedGame?.value]?.badge;
              return (
                <img
                  alt={badge.name}
                  className={`${styles.badge} ${
                    Array.isArray(badgeArr) && badgeArr?.includes(index) ? styles.active : ''
                  }`}
                  key={`${badge.name}-${badge.id}`}
                  src={BADGE_IMAGES[selectedGame?.value][index].src}
                />
              );
            })}
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.title}>{t('Team')}</span>
        {teamPokemon?.length > 0 ? (
          <div className={styles.team}>
            {teamPokemon?.map((enc) => {
              const foundPokemon = POKEMAP.get(enc.pokemon);
              return (
                <div className={styles.pokemon} key={`team-${enc.id}`}>
                  <div className={styles.image}>
                    <PkmImage name={foundPokemon?.text} shiny={enc?.details?.shiny} />
                  </div>
                  <PokeInfo encounter={enc} pokemon={foundPokemon} />
                  <Moves moves={enc?.details?.moves} />
                </div>
              );
            })}
          </div>
        ) : (
          <Tip missing={t('Team')} />
        )}
      </div>
      <div className={styles.row}>
        {summary?.encounters && (
          <div className={`${styles.card} ${styles.large}`}>
            <span className={styles.title}>{t('encounters')}</span>
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
                <b>{t('completion')}</b>
              </div>
              <div className={styles.byType}>
                <b>{t('all_encounters_by')}</b>
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
            <span className={styles.title}>{t('stats')}</span>
            <div className={styles.stat}>
              <CaughtSVG className={styles.team} />
              <b>{t('Caught')}</b>
              <Label>{caughtPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FailedSVG className={styles.team} />
              <b>{t('Failed')}</b>
              <Label>{failedPokemon?.length || 0}</Label>
            </div>
            <div className={styles.stat}>
              <FaintedSVG className={styles.team} />
              <b>{t('Fainted')}</b>
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
            <span className={styles.title}>{t('boxed')}</span>
            <div className={styles.box}>
              {boxedPokemon.map((box, i) => {
                const foundPokemon = POKEMAP.get(box.pokemon);
                return (
                  <div
                    data-testid={`image-box-${i}-${responsive}`}
                    className={styles.pokeImg}
                    key={`boxed-${Number(i) + 1}`}
                  >
                    <PkmImage name={foundPokemon?.text} shiny={box?.details?.shiny} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {faintedPokemon?.length > 0 && summary?.fainted && (
        <div className={styles.row}>
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>{t('Fainted')}</span>
            <div className={styles.box}>
              {faintedPokemon.map((faint, i) => {
                const foundPokemon = POKEMAP.get(faint.pokemon);
                return (
                  <div
                    data-testid={`image-fainted-${i}-${responsive}`}
                    className={styles.pokeImg}
                    key={`fainted-${Number(i) + 1}`}
                  >
                    <PkmImage name={foundPokemon?.text} shiny={faint?.details?.shiny} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className={styles.row}>
        {summary?.rules && rules[selectedRuleset] && (
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>{t('rules')}</span>
            <div className={styles.rules}>
              {rules[selectedRuleset]?.map((rule, i) => {
                return <RuleContent hideSmart key={`sumrule-${Number(i) + 1}`} i={i} rule={rule} />;
              })}
            </div>
          </div>
        )}
        {summary?.showDescription && (
          <div className={`${styles.card} ${styles.medium}`}>
            <span className={styles.title}>{t('description')}</span>
            <p>{summary?.description || ''}</p>
          </div>
        )}
      </div>
      <span className={styles.credit}>https://nuzlocke.netlify.app</span>
    </div>
  );
}

Image.propTypes = {};

export default Image;
