import { useCallback } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Gamepad2 } from 'lucide-react';
import type { TVersion } from 'constants/types';
import { GAME_VERSIONS } from 'constants/versions';
import VERSIONS_DE from 'locale/de/versions.json';
import VERSIONS_EN from 'locale/en/versions.json';
import VERSIONS_ES from 'locale/es/versions.json';
import useStore from 'store';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = 'all';

// The menu's strings ship with its chunk (see Options), not with i18n.ts's bundles
i18n.addResourceBundle('de', 'versions', VERSIONS_DE);
i18n.addResourceBundle('en', 'versions', VERSIONS_EN);
i18n.addResourceBundle('es', 'versions', VERSIONS_ES);

// The run's version, on the toolbar of a game with several (Red, Blue and Yellow; Sword and Shield;
// GAME_VERSIONS lists them). Picking one narrows each location's Pokémon selector to that
// version's encounters; "All versions" (the default) keeps every table whole. Other games render
// nothing.
function Version(): React.JSX.Element | null {
  const { t } = useTranslation('versions');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const version = useStore(
    useCallback((state) => state.games[state.selectedGame?.value]?.version, [])
  );
  const setVersion = useStore(useCallback((state) => state.setVersion, []));
  const versions = GAME_VERSIONS[selectedGame?.value];

  if (!versions) return null;

  return (
    <Select
      align="end"
      aria-label={t('version')}
      data-testid="version"
      icon={<span aria-hidden />}
      leading={<Gamepad2 aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />}
      look="row"
      onChange={(value) => setVersion(value === ALL ? undefined : (value as TVersion))}
      options={[{ text: t('all'), value: ALL }, ...versions.map((v) => ({ text: t(v), value: v }))]}
      triggerClassName={cn(
        'h-[2.571rem] w-auto shrink-0',
        // Phones keep the search field wide: "All versions" shows as the icon alone, named by the
        // trigger's text for screen readers; a chosen version shows its name
        !version &&
          'max-sm:w-[2.571rem] max-sm:justify-center max-sm:px-0 max-sm:[&>[data-select-text]]:sr-only'
      )}
      value={version ?? ALL}
    />
  );
}

export default Version;
