import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import RuleEditor from './RuleEditor';

describe('RuleEditor', () => {
  // The Semantic modal had an onClose, so Escape closed it; it must still discard the edit
  test('Escape closes the dialog and discards the edit', async () => {
    const user = userEvent.setup();
    render(<RuleEditor content="No items" index={0} type="TEXT" />);
    await user.click(screen.getByRole('button', { name: 'edit rule' }));
    const input = screen.getByTestId('edit-rule-input');
    await user.type(input, ' in battle');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'edit rule' }));
    expect((screen.getByTestId('edit-rule-input') as HTMLInputElement).value).toBe('No items');
  });
});
