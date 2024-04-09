import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { PokemonSelector } from 'common';
import { Member } from 'components';
import Coverage from 'components/Builder/elements/Coverage/Coverage';
import useStore from 'store';
import { ReactComponent as PokeballSVG } from 'assets/svg/pokeball.svg';
import styles from './Builder.module.scss';

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
  const handlePokemon = (id: number) => {
    addTeamMember(id);
  };

  const panes = [
    {
      menuItem: 'Builder',
      render: () => (
        <Tab.Pane attached={false}>
          <div className={styles.builder}>
            {team?.length > 0 ? (
              <div className={styles.team}>
                {team?.map((poke, i) => {
                  return <Member index={i} key={`team-${poke.id}`} pokemonDetail={poke} />;
                })}
              </div>
            ) : (
              <div className={styles.placeholder}>
                <PokeballSVG />
                <span>{selectedGame ? t('press_plus') : t('please_select', { ns: 'common' })}</span>
              </div>
            )}
            {selectedGame && (
              <PokemonSelector handlePokemon={handlePokemon}>
                <Button
                  circular
                  className={styles.button}
                  data-testid="builder-add"
                  disabled={team?.length === 6}
                  icon="plus"
                  type="button"
                />
              </PokemonSelector>
            )}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('coverage'),
      disabled: !team?.length,
      render: () => (
        <Tab.Pane attached={false}>
          {team?.length > 0 ? (
            <Coverage />
          ) : (
            <div className={styles.builder}>
              <div className={styles.placeholder}>
                <PokeballSVG />
                <span>{selectedGame ? t('press_plus') : t('please_select', { ns: 'common' })}</span>
              </div>
            </div>
          )}
        </Tab.Pane>
      ),
    },
  ];

  return <Tab className={styles.tabs} menu={{ secondary: true }} panes={panes} />;
}

export default Builder;
