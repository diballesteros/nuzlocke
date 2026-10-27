import { Badges } from 'components';
import { Encounters, FAB, Options } from 'components/Tracker/elements';

// Semantic's reset makes a <section> a block, so its grid needs !
function Tracker(): React.JSX.Element {
  return (
    <section className="relative grid! h-full min-h-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-items-center">
      <div className="flex h-[calc(100%-var(--spacing-3))] min-h-0 w-[calc(100%-var(--spacing-3))] flex-col flex-nowrap gap-(--spacing-2) rounded-[4px] p-(--spacing-1) transition-all duration-500">
        <Badges />
        <Options />
        <Encounters />
      </div>
      <FAB />
    </section>
  );
}

export default Tracker;
