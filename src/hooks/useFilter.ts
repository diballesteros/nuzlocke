import { useState } from 'react';
import { Type } from 'constants/types';

export type TFilter = {
  reset?: () => void;
  search: string;
  setSearch: (e: string) => void;
  gens: number[];
  setGens: (gen: number) => void;
  types: Type[];
  setTypes: (type: Type) => void;
};

function useFilter(): TFilter {
  const [search, setUpperSearch] = useState('');
  const [gens, handleGens] = useState<number[]>([]);
  const [types, handleTypes] = useState<Type[]>([]);

  const setSearch = (e: string) => {
    setUpperSearch(e.toUpperCase());
  };

  const setGens = (gen: number) => {
    if (gens.includes(gen)) {
      handleGens(gens.filter((current) => current !== gen));
    } else {
      handleGens([...gens, gen]);
    }
  };

  const setTypes = (type: Type) => {
    if (types.includes(type)) {
      handleTypes(types.filter((current) => current !== type));
    } else {
      handleTypes([...types, type]);
    }
  };

  const reset = () => {
    setSearch('');
    handleGens([]);
    handleTypes([]);
  };

  return { reset, search, setSearch, gens, setGens, types, setTypes };
}

export default useFilter;
