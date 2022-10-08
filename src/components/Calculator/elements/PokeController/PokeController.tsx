import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import { DetailSelector, EncounterSelector, PokemonSelector } from 'common';
import { PokemonSlot } from 'components/Calculator/elements';
import { DEFAULT_POKEMON_1, DEFAULT_POKEMON_2 } from 'constants/calculator';
import DETAILS from 'constants/details';
import { POKEMAP } from 'constants/pokemon';
import type { PokemonDetail, TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import styles from './PokeController.module.scss';

interface PokeControllerProps {
  encounters?: TEncounter[];
  name: 'pokemon1' | 'pokemon2';
}

function PokeController({ encounters, name }: PokeControllerProps): JSX.Element {
  const { t } = useTranslation('calculator');
  const [showAll, setShowAll] = useState(true);
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [selectedDetail, setSelectedDetail] = useState(undefined);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const foundPokemon = POKEMAP.get(form[name]);

  const handleEncounter = (enc: TEncounter) => {
    const partialCalc: Partial<TCalculatorForm> = {
      ...(enc.details?.ability && { ability1: enc.details?.ability }),
      ...(enc.details?.gender && { gender1: enc.details?.gender }),
      ...(enc.details?.item && { item1: enc.details?.item }),
      ...(enc.details?.level && { level1: enc.details?.level }),
      ...(enc.details?.nature && { nature1: enc.details?.nature }),
      ...(enc.details?.moves && { move1_1: enc.details?.moves[0] }),
      ...(enc.details?.moves && { move2_1: enc.details?.moves[1] }),
      ...(enc.details?.moves && { move3_1: enc.details?.moves[2] }),
      ...(enc.details?.moves && { move4_1: enc.details?.moves[3] }),
      evhp1: enc.details?.evhp ?? 0,
      evatk1: enc.details?.evatk ?? 0,
      evdef1: enc.details?.evdef ?? 0,
      evspatk1: enc.details?.evspatk ?? 0,
      evspdef1: enc.details?.evspdef ?? 0,
      evspeed1: enc.details?.evspeed ?? 0,
      ivhp1: enc.details?.ivhp ?? 0,
      ivatk1: enc.details?.ivatk ?? 0,
      ivdef1: enc.details?.ivdef ?? 0,
      ivspatk1: enc.details?.ivspatk ?? 0,
      ivspdef1: enc.details?.ivspdef ?? 0,
      ivspeed1: enc.details?.ivspeed ?? 0,
      pokemon1: enc.pokemon,
    };
    update({ ...DEFAULT_POKEMON_1, ...partialCalc });
  };

  const handlePokemon = (pokemonId: number) => {
    const partialCalc: Partial<TCalculatorForm> = {
      [name]: pokemonId,
    };
    const DEFAULT = name === 'pokemon1' ? DEFAULT_POKEMON_1 : DEFAULT_POKEMON_2;
    update({ ...DEFAULT, ...partialCalc });
  };

  const handleDetail = (detail: PokemonDetail) => {
    const partialCalc: Partial<TCalculatorForm> = {
      ...(detail?.ability && { ability2: detail?.ability }),
      ...(detail?.gender && { gender2: detail?.gender }),
      ...(detail?.item && { item2: detail?.item }),
      ...(detail?.level && { level2: detail?.level }),
      ...(detail?.nature && { nature2: detail?.nature }),
      ...(detail?.moves && { move1_2: detail?.moves[0] }),
      ...(detail?.moves && { move2_2: detail?.moves[1] }),
      ...(detail?.moves && { move3_2: detail?.moves[2] }),
      ...(detail?.moves && { move4_2: detail?.moves[3] }),
      ...(detail?.evhp && { evhp2: detail?.evhp }),
      ...(detail?.evatk && { evatk2: detail?.evatk }),
      ...(detail?.evdef && { evdef2: detail?.evdef }),
      ...(detail?.evspatk && { evspatk2: detail?.evspatk }),
      ...(detail?.evspdef && { evspdef2: detail?.evspdef }),
      ...(detail?.evspeed && { evspeed2: detail?.evspeed }),
      ...(detail?.ivhp && { ivhp2: detail?.ivhp }),
      ...(detail?.ivatk && { ivatk2: detail?.ivatk }),
      ...(detail?.ivdef && { ivdef2: detail?.ivdef }),
      ...(detail?.ivspatk && { ivspatk2: detail?.ivspatk }),
      ...(detail?.ivspdef && { ivspdef2: detail?.ivspdef }),
      ...(detail?.ivspeed && { ivspeed2: detail?.ivspeed }),
      pokemon2: detail.id,
    };
    update({ ...DEFAULT_POKEMON_2, ...partialCalc });
  };

  const detailsToOptions = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value]?.flat().map((gym, i) => {
        return {
          value: i,
          text: `${gym.name}${gym.name !== gym.game ? ` - ${gym.game}` : ''}`,
        };
      });
    }
    return [];
  }, [selectedGame]);

  const details = useMemo(() => {
    if (selectedGame && DETAILS[selectedGame?.value]) {
      return DETAILS[selectedGame.value]?.flat();
    }
    return [];
  }, [selectedGame]);
  const derivedShow = name === 'pokemon1' ? !showAll : showAll;
  const showGymDetails = name === 'pokemon2' && detailsToOptions?.length > 0;

  return (
    <div className={styles.wrapper} data-testid={`pokecontroller-${name}`}>
      {derivedShow ? (
        <PokemonSelector handlePokemon={handlePokemon} limitGen={form.calculatorGen}>
          <PokemonSlot pokemon={foundPokemon} />
        </PokemonSelector>
      ) : name === 'pokemon1' ? (
        <EncounterSelector
          encounters={encounters}
          handleEncounter={handleEncounter}
          limitGen={form.calculatorGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </EncounterSelector>
      ) : (
        <DetailSelector
          details={details[selectedDetail]?.content}
          handleDetail={handleDetail}
          limitGen={form.calculatorGen}
        >
          <PokemonSlot pokemon={foundPokemon} />
        </DetailSelector>
      )}
      {(showGymDetails || name === 'pokemon1') && (
        <div className={styles.showAll}>
          {showGymDetails && (
            <Dropdown
              aria-label="gym-filter"
              className={styles.dropdown}
              clearable
              data-testid="gym-filter"
              disabled={derivedShow}
              inline
              labeled
              onChange={(e, data) => setSelectedDetail(data.value)}
              options={detailsToOptions}
              placeholder={t('select_gym')}
              selection
              value={selectedDetail ?? ''}
            />
          )}
          <Checkbox
            checked={showAll}
            className={styles.checkbox}
            data-testid={`show-all-${name}`}
            onChange={(e, data) => setShowAll(data.checked)}
            toggle
          />
          {name === 'pokemon1' ? <span>{t('show_my')}</span> : <span>{t('show_all')}</span>}
          {name === 'pokemon1' && (
            <Popup
              content={<b>{t('show_help')}</b>}
              inverted={darkMode}
              trigger={<Icon className={styles.help} name="question circle" />}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PokeController;
