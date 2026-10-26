import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';
import { PkmImage } from 'common';
import { PokeInfo } from 'components';
import { Summary, Tip } from 'components/Pokestats/elements';
import { Detail } from 'components/Tracker/elements';
import { POKEMAP } from 'constants/pokemon';
import type { TEncounter } from 'constants/types';
import { selectCaught, selectFailed, selectFainted, selectTeam } from 'selectors';
import useStore from 'store';
import crag from 'assets/img/boxes/Crag.JPG?url';
import grass from 'assets/img/boxes/Grass.JPG?url';
import sky from 'assets/img/boxes/Sky.JPG?url';
import CaughtSVG from 'assets/svg/caught.svg?react';
import FailedSVG from 'assets/svg/failed.svg?react';
import FaintedSVG from 'assets/svg/fainted.svg?react';
import SummarySVG from 'assets/svg/summary.svg?react';
import TeamSVG from 'assets/svg/team.svg?react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// The tab icons: the failed and fainted ones are a little larger
const ICON = 'mr-(--spacing-1) size-[1.571rem]';
const LARGE_ICON = 'mr-(--spacing-1) size-[1.857rem]';

// A count in a tab, as Semantic drew a label inside a menu item
const COUNT = 'ml-[1em] bg-label-strong px-[0.78571429em] py-[0.3em] text-white';

// A status tab's panel
const BOX = 'm-0 p-[1em] object-cover';

// Semantic's reset styles every <button>, so font, size, line height and margin need !
const UNSTYLED_BUTTON =
  'm-0! cursor-pointer appearance-none border-0 bg-transparent p-0 [font-family:inherit]! text-[length:inherit]! leading-[inherit]! text-inherit';

// A boxed Pokémon: hovering outlines it, a click opens its details above it
function BoxedPokemon({ encounter, testId }: { encounter: TEncounter; testId: string }) {
  const foundPokemon = POKEMAP.get(encounter.pokemon);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={foundPokemon?.text}
          className={cn(
            UNSTYLED_BUTTON,
            'relative m-(--spacing-3)! inline-flex size-[5.143rem] items-center justify-center hover:rounded-[3px] hover:border hover:border-solid hover:border-black'
          )}
          data-testid={testId}
          type="button"
        >
          <PkmImage name={foundPokemon?.text} shiny={encounter?.details?.shiny} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <PokeInfo encounter={encounter} pokemon={foundPokemon} />
      </PopoverContent>
    </Popover>
  );
}

function Pokestats(): React.JSX.Element {
  const { t } = useTranslation('stats');
  const teamPokemon = useStore(useShallow(selectTeam));
  const faintedPokemon = useStore(useShallow(selectFainted));
  const caughtPokemon = useStore(useShallow(selectCaught));
  const failedPokemon = useStore(useShallow(selectFailed));
  const [tab, setTab] = useState('overview');

  // The status tabs: a tiled box wallpaper behind the Pokémon
  const boxes = [
    {
      key: 'Caught',
      wallpaper: grass,
      list: caughtPokemon,
      missing: t('multi_status'),
      prefix: 'caught',
    },
    {
      key: 'failed',
      wallpaper: sky,
      list: failedPokemon,
      missing: t('Failed'),
      prefix: 'failed',
    },
    {
      key: 'fainted',
      wallpaper: crag,
      list: faintedPokemon,
      missing: t('Fainted'),
      prefix: 'fainted',
    },
  ];

  return (
    <div className="flex h-full max-w-[100vw] flex-col flex-nowrap overflow-auto">
      <Tabs
        className="flex h-full w-[calc(100%-var(--spacing-2))] flex-col flex-nowrap"
        onValueChange={setTab}
        value={tab}
        variant="secondary"
      >
        <TabsList>
          <TabsTrigger value="overview">
            <SummarySVG className={ICON} />
            {t('summary')}
          </TabsTrigger>
          <TabsTrigger value="Team">
            <TeamSVG className={ICON} />
            {t('Team')}
            <Badge className={COUNT}>{teamPokemon?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Caught">
            <CaughtSVG className={ICON} />
            {t('Caught')}
            <Badge className={COUNT}>{caughtPokemon?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="failed">
            <FailedSVG className={LARGE_ICON} />
            {t('Failed')}
            <Badge className={COUNT}>{failedPokemon?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger value="fainted">
            <FaintedSVG className={LARGE_ICON} />
            {t('Fainted')}
            <Badge className={COUNT}>{faintedPokemon?.length || 0}</Badge>
          </TabsTrigger>
        </TabsList>
        {/* Semantic attached the summary's pane under the menu: no shadow, flush sides */}
        <TabsContent className="-mx-px flex-1 rounded-t-none p-[1em] shadow-none" value="overview">
          <Summary />
        </TabsContent>
        <TabsContent
          className={cn(
            BOX,
            'relative flex w-full flex-1 flex-col flex-nowrap gap-(--spacing-4) bg-team-box'
          )}
          value="Team"
        >
          {teamPokemon?.length > 0 ? (
            teamPokemon?.map((enc, i) => {
              const foundPokemon = POKEMAP.get(enc.pokemon);
              return (
                <div
                  className="relative flex h-[6.286rem] items-center gap-(--spacing-4) rounded-l-[37px] bg-team-member text-white"
                  key={`team-${enc.id}-${Number(i) + 1}`}
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      {/* A pokéball: red over white, split by a dark band */}
                      <button
                        aria-label={foundPokemon?.text}
                        className={cn(
                          UNSTYLED_BUTTON,
                          'relative z-1 -ml-(--spacing-0)! rounded-full border-[5px] border-solid border-pokeball-ring bg-[linear-gradient(var(--color-pokeball-top)_5%,var(--color-pokeball-top)_49%,black_5%,white_49%,var(--color-pokeball-bottom))]'
                        )}
                        data-testid={`team-${enc.id}`}
                        type="button"
                      >
                        <div className="z-2 flex h-[4.5rem] w-[4.5rem] items-center justify-center [&>div]:z-2">
                          <PkmImage name={foundPokemon?.text} shiny={enc?.details?.shiny} />
                        </div>
                        <div className="absolute top-[48%] z-1 h-[0.714rem] w-full bg-pokeball-ring" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PokeInfo encounter={enc} pokemon={foundPokemon} />
                    </PopoverContent>
                  </Popover>
                  <div className="relative z-1 flex w-full justify-evenly font-bold">
                    <span>{enc.nickname || foundPokemon?.text}</span>
                    {!!enc?.details?.level && <span>Lv. {enc.details.level}</span>}
                  </div>
                  <div className="absolute top-[70%] ml-[0.357rem] h-[0.286rem] w-[calc(100%-0.357rem)] bg-team-rail" />
                  <div className="absolute top-[80%] ml-[1.429rem] h-[0.929rem] w-[calc(100%-1.429rem)] bg-team-rail" />
                  <div className="absolute top-(--spacing-2) right-(--spacing-1)">
                    <Detail encounter={enc} />
                  </div>
                </div>
              );
            })
          ) : (
            <Tip missing={t('Team')} />
          )}
        </TabsContent>
        {boxes.map((box) => (
          <TabsContent
            className={cn(BOX, 'flex-1')}
            key={box.key}
            style={{ background: `url(${box.wallpaper}) repeat` }}
            value={box.key}
          >
            {box.list?.length > 0 ? (
              box.list.map((enc, i) => (
                <BoxedPokemon
                  encounter={enc}
                  key={`${box.prefix}-${enc.id}-${Number(i) + 1}`}
                  testId={`${box.prefix}-${enc.id}`}
                />
              ))
            ) : (
              <Tip missing={box.missing} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default Pokestats;
