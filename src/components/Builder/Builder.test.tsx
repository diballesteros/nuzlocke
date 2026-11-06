import { render, screen } from '@testing-library/react';
import type { AppState } from 'constants/types';
import useStore from 'store';
import Builder from './Builder';

const INITIAL = useStore.getState();
const store = () => useStore.getState();

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  store().selectGame(store().gamesList.find((game) => game.value === '1'));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Builder', () => {
  // A member's id is its species (1 is Bulbasaur), so the same species twice used to share a key
  test('renders a species added twice without a duplicate key', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    store().addTeamMember(1);
    store().addTeamMember(4);
    store().addTeamMember(1);
    render(<Builder />);

    expect(screen.getAllByTestId('expand-Bulbasaur')).toHaveLength(2);
    expect(screen.getAllByTestId('expand-Charmander')).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
  });
});
