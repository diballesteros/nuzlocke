import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Combobox } from './combobox';

// Radix measures the anchor and cmdk scrolls the highlighted item; jsdom has neither
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ??= () => {};
});

const OPTIONS = ['Dragon Scale', 'Leaf Stone', 'Leftovers', 'Level Ball', 'Charcoal'].map(
  (text) => ({ text, value: text })
);

const setup = (value = '', clearable = false) => {
  const onChange = vi.fn();
  render(
    <Combobox
      aria-label="item"
      clearable={clearable}
      data-testid="item"
      onChange={onChange}
      options={OPTIONS}
      placeholder="Select an item..."
      value={value}
    />
  );
  return {
    onChange,
    user: userEvent.setup(),
    input: screen.getByRole('combobox', { name: 'item' }),
  };
};

const shown = () => screen.queryAllByRole('option').map((option) => option.textContent);

describe('Combobox', () => {
  test('shows the placeholder, then every option when opened', async () => {
    const { input, user } = setup();
    expect(screen.getByTestId('item').textContent).toContain('Select an item...');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    await user.click(screen.getByTestId('item'));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(shown()).toEqual(OPTIONS.map((option) => option.text));
  });

  test('filters by substring in the original order, and Enter picks the first match', async () => {
    const { input, onChange, user } = setup();
    await user.type(input, 'le');
    expect(shown()).toEqual(['Dragon Scale', 'Leaf Stone', 'Leftovers', 'Level Ball']);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('Dragon Scale');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect((input as HTMLInputElement).value).toBe('');
  });

  test('moves through the matches with the arrow keys', async () => {
    const { input, onChange, user } = setup();
    await user.type(input, 'le');
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('Leftovers');
  });

  test('opens on the current value, which is bold', async () => {
    const { user } = setup('Leftovers');
    expect(screen.getByTestId('item').textContent).toContain('Leftovers');
    await user.click(screen.getByTestId('item'));
    const current = screen.getByRole('option', { name: 'Leftovers' });
    expect(current.getAttribute('data-selected')).toBe('true');
    expect(current.classList).toContain('font-bold');
  });

  test('opens from the keyboard and closes on Escape without picking', async () => {
    const { input, onChange, user } = setup();
    input.focus();
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('picks an option on click', async () => {
    const { onChange, user } = setup();
    await user.click(screen.getByTestId('item'));
    await user.click(screen.getByRole('option', { name: 'Charcoal' }));
    expect(onChange).toHaveBeenCalledWith('Charcoal');
  });

  test('says when nothing matches', async () => {
    const { input, user } = setup();
    await user.type(input, 'zzz');
    expect(shown()).toEqual([]);
    expect(screen.getByTestId('item-options').textContent).toContain('no_results');
  });

  test('clears the value without opening when clearable', async () => {
    const { input, onChange, user } = setup('Leftovers', true);
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(onChange).toHaveBeenCalledWith('');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });
});
