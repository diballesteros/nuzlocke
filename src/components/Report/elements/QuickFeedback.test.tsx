import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import useStore from 'store';
import { openFeedbackForm } from '@/lib/feedback';
import '@/i18n';
import QuickFeedback from './QuickFeedback';

vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));
vi.mock('@/lib/feedback', () => ({ openFeedbackForm: vi.fn() }));

const INITIAL = useStore.getState();

beforeEach(() => {
  useStore.setState(INITIAL, true);
  vi.mocked(openFeedbackForm).mockReset();
  vi.mocked(toast.error).mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('QuickFeedback', () => {
  test("opens the form with translated strings, the theme and the selected game's name", async () => {
    useStore.setState({ darkMode: true, selectedGame: { value: '3', text: 'Emerald', key: '3' } });
    render(<QuickFeedback />);
    expect(screen.getByText(/No name, email or screenshot/)).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Send quick feedback' }));

    expect(openFeedbackForm).toHaveBeenCalledTimes(1);
    const [options] = vi.mocked(openFeedbackForm).mock.calls[0];
    expect(options).toMatchObject({ darkMode: true, game: 'Emerald' });
    expect(options.texts).toMatchObject({
      formTitle: 'Send feedback',
      submitButtonLabel: 'Send',
      cancelButtonLabel: 'Cancel',
    });
    // Every string is translated: none falls back to its key
    Object.values(options.texts).forEach((text) => expect(text).not.toMatch(/^feedback_/));
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Send quick feedback' }).disabled
    ).toBe(false);
  });

  test("says so when the form can't load", async () => {
    vi.mocked(openFeedbackForm).mockRejectedValue(new Error('offline'));
    render(<QuickFeedback />);
    await userEvent.click(screen.getByRole('button', { name: 'Send quick feedback' }));

    expect(toast.error).toHaveBeenCalledWith(
      "The feedback form couldn't load. Check your connection, or use the form below."
    );
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Send quick feedback' }).disabled
    ).toBe(false);
  });
});
