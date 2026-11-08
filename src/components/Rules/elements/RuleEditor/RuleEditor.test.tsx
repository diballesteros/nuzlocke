import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import RuleEditor from './RuleEditor';

// The page opens the editor keyed per opening, as Rules does
function Harness() {
  const [opening, setOpening] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpening((n) => n + 1);
          setOpen(true);
        }}
        type="button"
      >
        Edit rule 1
      </button>
      <RuleEditor
        content="No items"
        index={0}
        key={opening}
        onClose={() => setOpen(false)}
        open={open}
        type="TEXT"
      />
    </>
  );
}

describe('RuleEditor', () => {
  // The Semantic modal had an onClose, so Escape closed it; it must still discard the edit
  test('Escape closes the dialog and discards the edit', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Edit rule 1' }));
    const input = screen.getByTestId('edit-rule-input');
    await user.type(input, ' in battle');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Edit rule 1' }));
    expect((screen.getByTestId('edit-rule-input') as HTMLInputElement).value).toBe('No items');
  });
});
