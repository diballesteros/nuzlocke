import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { Button } from './button';
import { Dialog, DialogBody, DialogContent, DialogHeader } from './dialog';
import { FabButton } from './fab-button';
import { Select } from './select';

// Radix measures the anchor; jsdom has no ResizeObserver or pointer capture
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

describe('Button', () => {
  test('forwards its ref, so it can be a Radix trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Go' }));
  });
});

describe('FabButton', () => {
  test('the toggle reports whether it is pressed; the coloured ones do not', () => {
    const { rerender } = render(<FabButton aria-label="options" colour="toggle" />);
    expect(screen.getByRole('button', { name: 'options' }).getAttribute('aria-pressed')).toBe(
      'false'
    );
    rerender(<FabButton active aria-label="options" colour="toggle" />);
    expect(screen.getByRole('button', { name: 'options' }).getAttribute('aria-pressed')).toBe(
      'true'
    );
    rerender(<FabButton aria-label="share" colour="blue" />);
    expect(screen.getByRole('button', { name: 'share' }).hasAttribute('aria-pressed')).toBe(false);
  });
});

describe('DialogHeader', () => {
  test('is the dialog title, as a div rather than a heading', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>Evolution Chain</DialogHeader>
          <DialogBody>Body</DialogBody>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog', { name: 'Evolution Chain' })).toBeTruthy();
    expect(screen.queryByRole('heading')).toBeNull();
  });
});

describe('Select', () => {
  const OPTIONS = [
    { icon: <svg data-testid="box-icon" />, text: 'Captured', value: '1' },
    { text: 'Fainted', value: '2' },
  ];

  test('draws option icons in the menu only, and a custom icon in place of the caret', async () => {
    const onChange = vi.fn();
    render(
      <Select
        contained
        data-testid="status"
        icon={<svg data-testid="leaf" />}
        onChange={onChange}
        options={OPTIONS}
        scrolling
        value="1"
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toBe('Captured');
    expect(screen.getByTestId('leaf')).toBeTruthy();
    expect(screen.queryByTestId('box-icon')).toBeNull();
    await userEvent.setup().click(trigger);
    expect(screen.getByTestId('box-icon')).toBeTruthy();
    // The contained menu renders inside the element carrying the test id
    expect(screen.getByTestId('status').contains(screen.getByRole('listbox'))).toBe(true);
    await userEvent.setup().click(screen.getByRole('option', { name: 'Fainted' }));
    expect(onChange).toHaveBeenCalledWith('2');
  });
});

describe('Select inert', () => {
  test('makes the rest of the page inert while the menu is open, and only what it changed', async () => {
    render(
      <>
        <Select
          aria-label="status"
          onChange={vi.fn()}
          options={[{ text: 'Fainted', value: '2' }]}
          value=""
        />
        <button type="button">outside</button>
        <div aria-live="polite" data-testid="live">
          <span data-testid="announcement" />
        </div>
        <div data-testid="already" inert />
      </>
    );
    const user = userEvent.setup();
    const trigger = screen.getByRole('combobox', { name: 'status' });
    const outside = screen.getByText('outside');
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(trigger.hasAttribute('inert')).toBe(true);
    expect(outside.hasAttribute('inert')).toBe(true);
    // Live regions keep announcing, as with Radix's aria-hidden
    expect(screen.getByTestId('live').hasAttribute('inert')).toBe(false);
    expect(screen.getByTestId('announcement').hasAttribute('inert')).toBe(false);
    expect(screen.getByRole('listbox').closest('[inert]')).toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger.hasAttribute('inert')).toBe(false);
    expect(outside.hasAttribute('inert')).toBe(false);
    // An element that was inert before stays inert
    expect(screen.getByTestId('already').hasAttribute('inert')).toBe(true);
  });
});
