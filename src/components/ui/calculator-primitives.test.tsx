import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { HoverPopover } from './popover';
import { Select } from './select';
import { Switch } from './switch';

// Radix measures the anchor; jsdom has no ResizeObserver
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.useRealTimers();
});

const OPTIONS = [
  { text: 'Brock', value: '0' },
  { text: 'Misty', value: '1' },
];

describe('HoverPopover', () => {
  const setup = () => {
    render(
      <HoverPopover content="Some help">
        <button type="button">help</button>
      </HoverPopover>
    );
    return screen.getByRole('button', { name: 'help' });
  };
  const hover = (trigger: HTMLElement, type: 'pointerEnter' | 'pointerLeave') =>
    fireEvent[type](trigger, { pointerType: 'mouse' });

  test('opens 50 ms after the mouse enters and closes 70 ms after it leaves, like Semantic', () => {
    vi.useFakeTimers();
    const trigger = setup();
    hover(trigger, 'pointerEnter');
    act(() => vi.advanceTimersByTime(49));
    expect(screen.queryByText('Some help')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('Some help')).toBeTruthy();
    // Focus stays on the page, not in the bubble
    expect(document.activeElement).not.toBe(screen.getByText('Some help').parentElement);
    hover(trigger, 'pointerLeave');
    act(() => vi.advanceTimersByTime(69));
    expect(screen.getByText('Some help')).toBeTruthy();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText('Some help')).toBeNull();
  });

  test('a touch never opens it on hover, and a click toggles it', async () => {
    const trigger = setup();
    fireEvent.pointerEnter(trigger, { pointerType: 'touch' });
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    expect(screen.queryByText('Some help')).toBeNull();
    const user = userEvent.setup();
    await user.click(trigger);
    expect(screen.getByText('Some help')).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('Select', () => {
  test('a clearable select swaps its caret for a clear icon once it has a value', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Select clearable onChange={onChange} options={OPTIONS} placeholder="Select a gym" value="" />
    );
    expect(screen.queryByRole('button', { name: 'clear' })).toBeNull();
    rerender(
      <Select
        clearable
        onChange={onChange}
        options={OPTIONS}
        placeholder="Select a gym"
        value="1"
      />
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: 'clear' }));
    expect(onChange).toHaveBeenCalledWith('');
    // Clearing doesn't open the menu
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
  });

  test('shows fixed text in place of the value, and dims when disabled', () => {
    render(<Select disabled onChange={vi.fn()} options={OPTIONS} text="Generation" value="1" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toBe('Generation');
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('Switch', () => {
  test('toggles like Semantic’s toggle checkbox', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Show all" checked onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('switch', { name: 'Show all' }));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
