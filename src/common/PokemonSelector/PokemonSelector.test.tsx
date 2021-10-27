import { fireEvent, render, screen } from '@testing-library/react';
import PokemonSelector from './PokemonSelector';
import '@testing-library/jest-dom';

describe('Pokemon selector', () => {
  test('Loads Pokemon selector', () => {
    const handlePokemon = jest.fn();
    render(
      <PokemonSelector handlePokemon={handlePokemon} filter={false}>
        <div>Test</div>
      </PokemonSelector>
    );
    fireEvent.click(screen.getByText('Test'));
    const pokemon = screen.getByTestId('poke-Bulbasaur');
    expect(pokemon).toBeVisible();
    fireEvent.click(pokemon);
    expect(handlePokemon).toHaveBeenCalledTimes(1);
  });
});
