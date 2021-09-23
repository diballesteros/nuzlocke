import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PokemonSelector from './PokemonSelector';
import '@testing-library/jest-dom';

describe('Pokemon selector', () => {
  test('Loads Pokemon selector', () => {
    const handlePokemon = jest.fn();
    const utils = render(
      <PokemonSelector handlePokemon={handlePokemon} filter={false}>
        <div>Test</div>
      </PokemonSelector>
    );
    fireEvent.click(utils.getByText('Test'));
    const pokemon = screen.getByTestId('poke-Bulbasaur');
    expect(pokemon).toBeVisible();
    fireEvent.click(pokemon);
    expect(handlePokemon).toHaveBeenCalledTimes(1);
  });
});
