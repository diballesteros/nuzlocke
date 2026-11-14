import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonSelector from './PokemonSelector';

// The trigger: the tracker's rows pass `button` for a real <button>; the editor, Calculator and
// Builder keep the role="button" wrapper, which opens from the keyboard itself
describe('PokemonSelector trigger', () => {
  test.each(['{Enter}', ' '])('the wrapper opens the selector on %s', async (key) => {
    const user = userEvent.setup();
    render(
      <PokemonSelector handlePokemon={() => {}}>
        <span>Pick</span>
      </PokemonSelector>
    );
    const trigger = screen.getByTestId('pokemon-selector');
    expect(trigger.tagName).toBe('DIV');
    trigger.focus();
    await user.keyboard(key);
    expect(await screen.findByRole('dialog')).toBeTruthy();
  });

  test('the button trigger carries its name and opens the selector', async () => {
    const user = userEvent.setup();
    render(
      <PokemonSelector
        button={{ 'aria-label': 'Caterpie, Change Pokémon' }}
        handlePokemon={() => {}}
      >
        <span>Caterpie</span>
      </PokemonSelector>
    );
    const trigger = screen.getByRole('button', { name: 'Caterpie, Change Pokémon' });
    expect(trigger.tagName).toBe('BUTTON');
    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeTruthy();
  });
});

// How each Pokémon is met (the tracker passes constants/methods for the row's location): a label on
// the tagged ones only. Without i18n set up, the label shows its keys
describe('PokemonSelector methods', () => {
  test('labels the Pokémon met other than in the wild', async () => {
    const user = userEvent.setup();
    render(
      <PokemonSelector
        filter={[1, 4, 7]}
        handlePokemon={() => {}}
        methods={{ Bulbasaur: ['gift'], Squirtle: ['gift', 'trade'] }}
      >
        <span>Pick</span>
      </PokemonSelector>
    );
    await user.click(screen.getByTestId('pokemon-selector'));
    expect((await screen.findByTestId('method-Bulbasaur')).textContent).toBe('methods.gift');
    expect(screen.getByTestId('method-Squirtle').textContent).toBe('methods.gift · methods.trade');
    expect(screen.getByTestId('poke-Charmander')).toBeTruthy();
    expect(screen.queryByTestId('method-Charmander')).toBeNull();
  });
});
