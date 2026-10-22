import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, type IconNode } from 'lucide-react';
import { Page } from 'common';
import CHANGELOG from 'constants/changelog';
import type { TReleaseGroup } from 'constants/types';
import useStore from 'store';
import { Button } from '@/components/ui/button';

// Lucide's plus is two paths, and the button's translucent text colour painted their crossing twice.
// One path paints it once, and square caps match the old FontAwesome glyph.
const PLUS: IconNode = [['path', { d: 'M5 12h14M12 5v14', key: 'plus' }]];

function Changelog(): React.JSX.Element {
  const { t, i18n } = useTranslation('common');
  const [logs, setLogs] = useState(3);
  const removeNew = useStore((state) => state.removeNew);

  useEffect(() => {
    removeNew();
  });

  const getClass = (type: TReleaseGroup) => {
    switch (type) {
      case 'FEATURE':
        return 'bg-note-feature text-note-feature-foreground';
      case 'FIX':
        return 'bg-note-fix text-note-fix-foreground';
      default:
        return 'bg-note-update text-note-update-foreground';
    }
  };

  const onSeeMore = () => {
    setLogs(CHANGELOG.length);
  };

  return (
    <Page header="Changelog">
      <div
        className="flex flex-1 flex-col flex-nowrap overflow-auto pr-(--spacing-2) text-foreground"
        data-testid="changelog-list"
      >
        {CHANGELOG.slice(0, logs).map((release, i) => {
          return (
            <React.Fragment key={`release-${i + 1}`}>
              <h4 className="text-(length:--font-size-7)!">
                {release.name}{' '}
                <time className="text-(length:--font-size-3)">
                  {new Date(release.date).toLocaleDateString(i18n.language, {
                    weekday: 'short',
                    month: 'short',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </time>
              </h4>
              <ul className="[&>li]:mb-(--spacing-2) [&>li]:text-(length:--font-size-3)">
                {release.notes.map((note) => {
                  return (
                    <li key={note.description}>
                      <span
                        className={`mr-(--spacing-3) inline-block rounded-[999px] px-(--spacing-2) py-(--spacing-1) text-(length:--font-size-1) font-bold tracking-[0.054rem] ${getClass(note.type)}`}
                      >
                        {note.type}
                      </span>
                      {note.description}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          );
        })}
        {logs < CHANGELOG.length && (
          <Button
            className="h-[3.429rem] min-h-[3.429rem] w-fit self-center"
            data-testid="see-more"
            onClick={onSeeMore}
            type="button"
          >
            <Icon
              aria-hidden
              className="-my-[0.08em] mr-[0.395em] ml-[-0.165em] size-[1.16em] -translate-y-[0.05em] align-[-0.15em] opacity-80"
              iconNode={PLUS}
              strokeLinecap="square"
              strokeWidth={4.5}
            />
            {t('see_more')}
          </Button>
        )}
      </div>
    </Page>
  );
}

export default Changelog;
