import { Ref, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';
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
import CaughtSVG from 'assets/svg/caught.svg?react';
import FailedSVG from 'assets/svg/failed.svg?react';
import FaintedSVG from 'assets/svg/fainted.svg?react';
import ShinySVG from 'assets/svg/shiny.svg?react';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, RefreshIcon, XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const CALC = 140 * Math.PI;

// The summary's cards, in rows: a large card takes three quarters of a row, the others a quarter
const CARD =
  'flex flex-1 flex-col flex-nowrap rounded-[4px] bg-card px-(--spacing-6) py-(--spacing-4) text-foreground shadow-[0_0_10px_-2px_rgba(0,0,0,0.075)]';
const SMALL = 'basis-[calc(25%-1.786rem)]';
const LARGE = 'basis-[calc(75%-1.786rem)]';
const TITLE = 'mb-(--spacing-2) text-(length:--font-size-5) uppercase';
const STAT =
  'mb-(--spacing-3) flex flex-row flex-nowrap items-center justify-center gap-(--spacing-3) rounded-[4px] border-2 border-solid border-foreground p-(--spacing-1) text-(length:--font-size-4) [&>b]:mr-auto [&>svg]:size-[1.571rem]';
const STAT_COUNT = 'bg-label-strong text-white';
const BOX = 'flex flex-row flex-wrap gap-(--spacing-5)';
const BOXED = 'size-[3.429rem]';
// The run's status icon, in Semantic's icon slot after the text
const STATUS_ICON = 'mr-[0.25rem] inline-block h-[1em] w-[1.18em] align-top';

interface ImageProps {
  forwardedRef?: Ref<HTMLDivElement>;
  // The copy shown on the page: rows, the header and narrow-screen layouts wrap. The other copy is
  // rendered off screen at desktop width for the downloaded image.
  responsive?: boolean;
}

function Image({ forwardedRef, responsive = false }: ImageProps): React.JSX.Element {
  const { t } = useTranslation('stats');
  const badges = useStore(useCallback((state) => state.badges, []));
  const rules = useStore(useCallback((state) => state.rules, []));
  const selectedRuleset = useStore(useCallback((state) => state.selectedRuleset, []));
  const games = useStore(useCallback((state) => state.games, []));
  const teamPokemon = useStore(useShallow(selectTeam));
  const boxedPokemon = useStore(useShallow(selectBoxed));
  const faintedPokemon = useStore(useShallow(selectFainted));
  const caughtPokemon = useStore(useShallow(selectCaught));
  const completion = useStore(selectCompletion);
  const failedPokemon = useStore(useShallow(selectFailed));
  const shinyPokemon = useStore(useShallow(selectShiny));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const summary = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.summary[state?.selectedGame?.value] : null),
      []
    )
  );
  const setDefaultSummary = useStore(useCallback((state) => state.setDefaultSummary, []));
  const row = cn('flex flex-row flex-nowrap gap-(--spacing-7)', responsive && 'flex-wrap');

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
            {t('ongoing')} <RefreshIcon className={STATUS_ICON} />
          </b>
        );
      case 1:
        return (
          <b style={{ color: 'green' }}>
            {t('complete')} <CheckIcon className={STATUS_ICON} />
          </b>
        );
      case 2:
      default:
        return (
          <b style={{ color: 'red' }}>
            {t('Failed')} <XIcon className={STATUS_ICON} />
          </b>
        );
    }
  };

  return (
    <div
      className={cn(
        'flex flex-1 flex-col flex-nowrap gap-(--spacing-3) bg-secondary p-(--spacing-2)',
        responsive && 'w-full'
      )}
      ref={forwardedRef}
    >
      <div
        className={cn(
          'flex items-center justify-between bg-header! px-(--spacing-6) py-(--spacing-4) text-(length:--font-size-7) text-foreground',
          responsive && 'flex-wrap gap-(--spacing-1) [&>b]:uppercase'
        )}
        data-testid={`image-header-${responsive}`}
      >
        <span className="max-w-[16.071rem]">{summary?.title}</span>
        {getStatus()}
        <div className="flex max-w-[21.249rem] flex-row flex-wrap gap-(--spacing-1)">
          {!!selectedGame &&
            badges[selectedGame?.value]?.map((badge, index) => {
              const badgeArr = games[selectedGame?.value]?.badge;
              return (
                <img
                  alt={badge.name}
                  className={cn(
                    'size-[2rem] [filter:brightness(0.2)]',
                    Array.isArray(badgeArr) && badgeArr?.includes(index) && '[filter:brightness(1)]'
                  )}
                  key={`${badge.name}-${badge.id}`}
                  src={BADGE_IMAGES[selectedGame?.value][index].src}
                />
              );
            })}
        </div>
      </div>
      <div className={CARD}>
        <span className={TITLE}>{t('Team')}</span>
        {teamPokemon?.length > 0 ? (
          <div
            className={cn(
              'grid min-w-0 grid-cols-[repeat(auto-fit,minmax(30.357rem,1fr))] gap-x-(--spacing-2)',
              responsive && 'max-xs:flex max-xs:flex-col max-xs:flex-nowrap'
            )}
          >
            {teamPokemon?.map((enc) => {
              const foundPokemon = POKEMAP.get(enc.pokemon);
              return (
                <div
                  className={cn(
                    'mb-(--spacing-2) grid grid-cols-[5.714rem_minmax(auto,11.429rem)_minmax(0,1fr)] gap-x-(--spacing-3) border-0 border-b border-solid border-foreground px-0 py-(--spacing-1)',
                    // On a phone the moves go under the Pokémon
                    responsive &&
                      'max-xs:w-full max-xs:min-w-0 max-xs:grid-cols-[5.714rem_minmax(0,1fr)] max-xs:[&>div:last-child]:col-[1/-1]'
                  )}
                  key={`team-${enc.id}`}
                >
                  <div className="flex size-[5.714rem] items-center justify-center self-center">
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
      <div className={row}>
        {summary?.encounters && (
          <div className={cn(CARD, LARGE)}>
            <span className={TITLE}>{t('encounters')}</span>
            <div
              className={cn(
                'flex flex-row flex-nowrap justify-evenly gap-(--spacing-3)',
                responsive && 'flex-wrap'
              )}
            >
              <div className="mt-(--spacing-3) flex flex-col flex-nowrap items-center justify-center gap-(--spacing-3) [&>b]:text-(length:--font-size-4) [&>b]:text-badge">
                {/* html-to-image inlines the computed style of the <svg> but not of its children,
                    so the children take their paint and font from it, by inheritance or currentColor */}
                <svg
                  className="fill-none stroke-completion-track text-badge text-(length:--font-size-9) font-bold"
                  data-testid={`image-completion-${responsive}`}
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                >
                  <circle cx={75} cy={75} r="70" strokeWidth="10px" />
                  <circle
                    cx={75}
                    cy={75}
                    r="70"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="10px"
                    strokeDasharray={CALC}
                    strokeDashoffset={CALC - CALC * completion}
                    transform="rotate(-90 75 75)"
                  />
                  <text
                    fill="currentColor"
                    stroke="none"
                    x="50%"
                    y="50%"
                    dy=".3em"
                    textAnchor="middle"
                  >
                    {completion ? (completion * 100)?.toFixed(0) : 0}%
                  </text>
                </svg>
                <b>{t('completion')}</b>
              </div>
              <div className="flex flex-col flex-nowrap justify-evenly">
                <b>{t('all_encounters_by')}</b>
                <div
                  className={cn(
                    'grid grid-cols-[repeat(4,minmax(0,6.429rem))] gap-x-(--spacing-2) gap-y-(--spacing-2)',
                    responsive && 'max-xs:grid-cols-[repeat(3,minmax(0,6.429rem))]'
                  )}
                >
                  {types.map((type) => {
                    return (
                      <div
                        className="h-[1.714rem] min-w-[6.429rem] rounded-[8px] p-(--spacing-1) text-center font-bold text-black"
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
          <div className={cn(CARD, SMALL)}>
            <span className={TITLE}>{t('stats')}</span>
            <div className={STAT}>
              <CaughtSVG />
              <b>{t('Caught')}</b>
              <Badge className={STAT_COUNT}>{caughtPokemon?.length || 0}</Badge>
            </div>
            <div className={STAT}>
              <FailedSVG />
              <b>{t('Failed')}</b>
              <Badge className={STAT_COUNT}>{failedPokemon?.length || 0}</Badge>
            </div>
            <div className={STAT}>
              <FaintedSVG />
              <b>{t('Fainted')}</b>
              <Badge className={STAT_COUNT}>{faintedPokemon?.length || 0}</Badge>
            </div>
            <div className={STAT}>
              <ShinySVG />
              <b>Shiny</b>
              <Badge className={STAT_COUNT}>{shinyPokemon?.length || 0}</Badge>
            </div>
          </div>
        )}
      </div>
      {boxedPokemon?.length > 0 && summary?.boxed && (
        <div className={row}>
          <div className={cn(CARD, SMALL)}>
            <span className={TITLE}>{t('boxed')}</span>
            <div className={BOX}>
              {boxedPokemon.map((box, i) => {
                const foundPokemon = POKEMAP.get(box.pokemon);
                return (
                  <div
                    data-testid={`image-box-${i}-${responsive}`}
                    className={BOXED}
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
        <div className={row}>
          <div className={cn(CARD, SMALL)}>
            <span className={TITLE}>{t('Fainted')}</span>
            <div className={BOX}>
              {faintedPokemon.map((faint, i) => {
                const foundPokemon = POKEMAP.get(faint.pokemon);
                return (
                  <div
                    data-testid={`image-fainted-${i}-${responsive}`}
                    className={BOXED}
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
      <div className={row}>
        {summary?.rules && rules[selectedRuleset] && (
          <div className={cn(CARD, SMALL)}>
            <span className={TITLE}>{t('rules')}</span>
            {/* Smaller text than on the Rules page: these win over RuleContent's own sizes */}
            <div
              className={cn(
                'flex flex-col flex-nowrap gap-(--spacing-1) [&_p]:text-(length:--font-size-2) [&_span]:text-(length:--font-size-4)',
                responsive && 'min-w-[14.286rem]'
              )}
            >
              {rules[selectedRuleset]?.map((rule, i) => {
                return <RuleContent hideSmart key={`sumrule-${Number(i) + 1}`} i={i} rule={rule} />;
              })}
            </div>
          </div>
        )}
        {summary?.showDescription && (
          <div className={cn(CARD, SMALL)}>
            <span className={TITLE}>{t('description')}</span>
            <p>{summary?.description || ''}</p>
          </div>
        )}
      </div>
      <span className="ml-auto text-foreground">https://nuzlocke.netlify.app</span>
    </div>
  );
}

export default Image;
