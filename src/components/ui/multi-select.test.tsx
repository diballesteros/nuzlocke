import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { MultiSelect } from './multi-select';

const OPTIONS = ['FIRE', 'WATER', 'GRASS'].map((text) => ({ text, value: text }));

// Keeps the chosen values in state, as the Rules dialogs do
function Harness({
  initial = [],
  onChange,
}: {
  initial?: string[];
  onChange: (v: string[]) => void;
}) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <>
      <MultiSelect
        aria-label="types"
        data-testid="types"
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
        options={OPTIONS}
        placeholder="Please select a type..."
        value={value}
      />
      <button type="button">outside</button>
    </>
  );
}

const setup = (initial?: string[]) => {
  const onChange = vi.fn();
  render(<Harness initial={initial} onChange={onChange} />);
  return {
    onChange,
    user: userEvent.setup(),
    field: screen.getByRole('combobox', { name: 'types' }),
  };
};

const shown = () => screen.queryAllByRole('option').map((option) => option.textContent);

describe('MultiSelect', () => {
  test('shows the placeholder, and its menu inside the test id element', async () => {
    const { field, user } = setup();
    expect(field.textContent).toContain('Please select a type...');
    expect(field.getAttribute('aria-expanded')).toBe('false');
    await user.click(field);
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByTestId('types').querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  test('a click adds a value, leaves the menu open and lists only the rest', async () => {
    const { field, onChange, user } = setup();
    await user.click(field);
    await user.click(screen.getByRole('option', { name: 'WATER' }));
    expect(onChange).toHaveBeenLastCalledWith(['WATER']);
    expect(shown()).toEqual(['FIRE', 'GRASS']);
    expect(field.textContent).not.toContain('Please select');
  });

  test('the label’s x removes its value without opening the menu', async () => {
    const { field, onChange, user } = setup(['FIRE', 'GRASS']);
    await user.click(field.querySelector('svg') as SVGElement);
    expect(onChange).toHaveBeenLastCalledWith(['GRASS']);
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });

  test('keyboard: arrows move the highlight, Enter adds, Backspace removes, Escape closes', async () => {
    const { field, onChange, user } = setup();
    field.focus();
    await user.keyboard('{ArrowDown}');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowUp}');
    expect(field.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'WATER' }).id
    );
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['WATER']);
    // The highlight stays on the same row, now the next value
    expect(field.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'GRASS' }).id
    );
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(['WATER', 'GRASS']);
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(['WATER']);
    await user.keyboard('{Escape}');
    expect(field.getAttribute('aria-expanded')).toBe('false');
    await user.keyboard('{Enter}');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Tab}');
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });

  test('a click outside closes the menu', async () => {
    const { field, user } = setup();
    await user.click(field);
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });
});
