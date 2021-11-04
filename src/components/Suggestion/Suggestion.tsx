import { useMemo } from 'react';
import { selectSuggestion } from 'selectors';
import { TPokemon } from 'constants/types';
import useStore from 'store';

interface SuggestionProps {
  pokemonList: TPokemon[];
}

function Suggestion({ pokemonList }: SuggestionProps): JSX.Element {
  const suggestions = useStore(selectSuggestion);

  const suggested = useMemo(() => {
    if (!pokemonList) return null;
    return pokemonList.filter((pokemon) => {
      return suggestions.includes(pokemon.type) || suggestions.includes(pokemon.dualtype);
    });
  }, [pokemonList, suggestions]);

  return (
    <div>
      <span>{suggested}</span>
    </div>
  );
}

export default Suggestion;
