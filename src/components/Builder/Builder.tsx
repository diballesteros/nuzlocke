import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PokemonSelector } from 'common';
import { Member } from 'components';
import Coverage from 'components/Builder/elements/Coverage/Coverage';
import useStore from 'store';
import PokeballSVG from 'assets/svg/pokeball.svg?react';
import { Button } from '@/components/ui/button';
import { BUTTON_ICON, PlusIcon } from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

function Builder(): React.JSX.Element {
  const { t } = useTranslation('builder');
  const team = useStore(
    useCallback(
      (state) => (state?.selectedGame?.value ? state.team[state?.selectedGame?.value] : null),
      []
    )
  );
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addTeamMember = useStore(useCallback((state) => state.addTeamMember, []));
  const [tab, setTab] = useState('builder');
  const noTeam = !team?.length;
  const handlePokemon = (id: number) => {
    addTeamMember(id);
  };

  const placeholder = (
    <div className="flex h-full flex-1 flex-col flex-nowrap items-center justify-center gap-(--spacing-5) text-(length:--font-size-5) text-foreground [&>svg]:w-1/2 [&>svg]:max-w-[20rem] [&>svg_path]:fill-foreground">
      <PokeballSVG />
      <span>{selectedGame ? t('press_plus') : t('please_select', { ns: 'common' })}</span>
    </div>
  );

  return (
    <Tabs
      className="flex h-full w-full flex-col flex-nowrap"
      // Semantic's disabled Coverage item ignored clicks; it isn't disabled for the browser, so
      // the click lands and does nothing, as before
      onValueChange={(value) => {
        if (value !== 'coverage' || !noTeam) setTab(value);
      }}
      value={tab}
      variant="secondary"
    >
      <TabsList>
        <TabsTrigger value="builder">Builder</TabsTrigger>
        <TabsTrigger data-disabled={noTeam ? '' : undefined} value="coverage">
          {t('coverage')}
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex-1" value="builder">
        <div className="relative flex h-full p-0">
          {team?.length > 0 ? (
            <div className="flex flex-1 flex-col flex-nowrap overflow-auto">
              {team?.map((poke, i) => {
                return <Member index={i} key={`team-${poke.id}`} pokemonDetail={poke} />;
              })}
            </div>
          ) : (
            placeholder
          )}
          {selectedGame && (
            <PokemonSelector handlePokemon={handlePokemon}>
              <Button
                aria-label={t('add', { ns: 'common' })}
                className="absolute right-(--spacing-2) bottom-(--spacing-3) size-[4rem] rounded-[10em] bg-badge p-[0.78571429em] text-white transition-all duration-500 hover:bg-badge hover:text-white"
                data-testid="builder-add"
                disabled={team?.length === 6}
                type="button"
                variant="secondary"
              >
                <PlusIcon
                  className={cn(BUTTON_ICON, '-translate-y-[0.06em] text-(length:--font-size-8)')}
                />
              </Button>
            </PokemonSelector>
          )}
        </div>
      </TabsContent>
      <TabsContent className="flex-1" value="coverage">
        {team?.length > 0 ? (
          <Coverage />
        ) : (
          <div className="relative flex h-full p-0">{placeholder}</div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default Builder;
