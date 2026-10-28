import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPE_COLOR } from 'constants/colors';
import { GENERATIONS, TYPES } from 'constants/constant';
import { TFilter } from 'hooks/useFilter';
import { Button, TOGGLE_BUTTON } from '@/components/ui/button';
import { BUTTON_ICON, FilterIcon, QuestionCircleIcon, SearchIcon } from '@/components/ui/icons';
import { HoverPopover } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Semantic's exact 4px radius (`rounded-md` is 3.9998px)
const RADIUS = 'rounded-[0.28571429rem]';

interface FilterProps {
  darkMode?: boolean;
  hideGen?: boolean;
  values: TFilter;
}

// Semantic's `fluid left icon` Input with a `right corner` label holding a help icon. The input
// keeps the white field in both themes; a search turns its border into a thick badge-coloured one.
// Semantic's reset styles every <input> and <button>, so font, size, line height and margin need !
const INPUT =
  'm-0! w-0 max-w-full flex-[1_0_auto] rounded-[0.28571429rem] border border-solid border-field-border bg-white py-[0.67857143em] pr-[3.25em] pl-[2.67142857em] text-left font-control! text-[1em]! leading-[1.21428571em]! text-field-foreground outline-none transition-[box-shadow,border-color] duration-100 placeholder:text-filter-placeholder focus:border-ring focus:text-[rgba(0,0,0,0.8)]';

function Filter({ darkMode = false, hideGen = false, values }: FilterProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const filtered = values.gens?.length > 0 || values?.types?.length > 0;
  return (
    <div className="relative flex w-full flex-row flex-nowrap gap-(--spacing-2)">
      <div
        className="relative flex w-full flex-1 text-[1rem] text-field-foreground"
        data-testid="filter"
      >
        <input
          aria-label="search"
          className={cn(INPUT, values.search && 'border-[3px] border-badge focus:border-badge')}
          maxLength={50}
          onChange={(e) => values.setSearch(e.target.value)}
          placeholder={`${t('search')}...`}
          type="search"
          value={values.search}
        />
        {/* The corner label comes before the search icon, so the help icon is the field's first
            svg (the specs' helpIcon) */}
        <div className="absolute top-px right-px size-[2.57142857em] overflow-hidden rounded-tr-[0.28571429rem] after:absolute after:top-0 after:right-0 after:size-0 after:border-0 after:border-r-[2.57142857em] after:border-b-[2.57142857em] after:border-solid after:border-r-field-label after:border-b-transparent after:content-['']">
          <HoverPopover content={<b>{t('search_help')}</b>} inverted={darkMode}>
            <button
              aria-label={t('help', { ns: 'calculator' })}
              className="absolute top-[0.47214286em] left-[1.49571429em] z-1 m-0! flex size-[0.73469388em] cursor-help items-center border-0 bg-transparent p-0 text-field-label-foreground"
              type="button"
            >
              <QuestionCircleIcon className="-m-[0.1em] size-[calc(100%+0.2em)] max-w-none" />
            </button>
          </HoverPopover>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-px flex h-full w-[2.67142857em] items-center justify-center opacity-50"
        >
          <SearchIcon className="size-[1.15em]" />
        </span>
      </div>
      {/* Semantic's `toggle icon` button, `inverted` only where the page passes darkMode, and blue
          while a filter is set */}
      <Button
        aria-label="search-filter"
        aria-pressed={show}
        className={cn(RADIUS, TOGGLE_BUTTON)}
        data-testid="filter-button"
        onClick={() => setShow((prevState) => !prevState)}
        size="icon"
        type="button"
        variant={filtered ? (darkMode ? 'blue' : 'primary') : darkMode ? 'default' : 'secondary'}
      >
        <FilterIcon className={BUTTON_ICON} />
      </Button>
      {show && (
        <div className="absolute top-[2.857rem] right-0 z-1 flex h-fit w-fit flex-col flex-nowrap gap-(--spacing-2) bg-white p-(--spacing-3) text-center shadow-[1px_0_14px_1px_var(--color-panel-glow)]">
          {!hideGen && (
            <>
              <b>{t('generations')}:</b>
              <div className="flex flex-row flex-wrap gap-(--spacing-2)">
                {GENERATIONS.map((gen) => {
                  return (
                    <Button
                      aria-pressed={values.gens.includes(gen)}
                      className={TOGGLE_BUTTON}
                      data-testid={`filter-gen-${gen}`}
                      key={`filter-gen-${gen}`}
                      onClick={() => values.setGens(gen)}
                      variant="secondary"
                    >
                      {gen}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
          <b>{t('types')}:</b>
          <div className="flex flex-row flex-wrap gap-(--spacing-2)">
            {TYPES.map((type) => {
              return (
                <Button
                  data-testid={`filter-type-${type}`}
                  key={`filter-type-${type}`}
                  onClick={() => values.setTypes(type)}
                  style={{
                    backgroundColor: values.types.includes(type) ? TYPE_COLOR[type] : undefined,
                  }}
                  variant="secondary"
                >
                  {type}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
