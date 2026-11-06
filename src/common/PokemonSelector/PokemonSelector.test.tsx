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
