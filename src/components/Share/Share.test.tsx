import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Share from './Share';

vi.mock('react-toastify', () => ({
  toast: Object.assign(vi.fn(), { error: vi.fn(), promise: vi.fn(), success: vi.fn() }),
}));

const TEXT = 'Route 1: Pikachu';

beforeEach(() => {
  vi.mocked(toast.error).mockClear();
  vi.mocked(toast.promise).mockClear();
  vi.mocked(toast.success).mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// After userEvent.setup(), which puts its own clipboard on the navigator
function stubNavigator(value: Partial<Navigator>) {
  vi.stubGlobal('navigator', { ...navigator, ...value });
}

describe('Share', () => {
  test('without the Web Share API, it opens a dialog that copies the text', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigator({ clipboard: { writeText } as unknown as Clipboard });
    render(<Share disabled={false} text={TEXT} />);

    await user.click(screen.getByTestId('share-encounters'));
    expect((screen.getByTestId('share-textarea') as HTMLTextAreaElement).value).toBe(TEXT);
    await user.click(screen.getByRole('button', { name: 'copy' }));
    expect(writeText).toHaveBeenCalledWith(TEXT);
    expect(toast.success).toHaveBeenCalledWith('copied');
  });

  test('copying fails without a clipboard, or when the clipboard refuses', async () => {
    const user = userEvent.setup();
    stubNavigator({ clipboard: undefined });
    const { unmount } = render(<Share disabled={false} text={TEXT} />);
    await user.click(screen.getByTestId('share-encounters'));
    await user.click(screen.getByRole('button', { name: 'copy' }));
    expect(toast.error).toHaveBeenCalledWith('unable_share');
    unmount();

    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    stubNavigator({ clipboard: { writeText } as unknown as Clipboard });
    render(<Share disabled={false} text={TEXT} />);
    await user.click(screen.getByTestId('share-encounters'));
    await user.click(screen.getByRole('button', { name: 'copy' }));
    expect(writeText).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('cancel closes the dialog', async () => {
    const user = userEvent.setup();
    render(<Share disabled={false} text={TEXT} />);
    await user.click(screen.getByTestId('share-encounters'));
    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('with the Web Share API, it shares without a dialog', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    stubNavigator({ canShare, share });
    const user = userEvent.setup();
    render(<Share disabled={false} icon text={TEXT} />);

    await user.click(screen.getByRole('button', { name: 'share' }));
    const data = { title: 'Nuzlocke', text: TEXT };
    expect(canShare).toHaveBeenCalledWith(data);
    // Pinned as it is: a successful share opens the share sheet a second time for the toast
    expect(share).toHaveBeenCalledTimes(2);
    expect(share).toHaveBeenCalledWith(data);
    expect(toast.promise).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('a cancelled or failed share shows an error', async () => {
    stubNavigator({
      canShare: () => true,
      share: vi.fn().mockRejectedValue(new Error('AbortError')),
    });
    const user = userEvent.setup();
    render(<Share disabled={false} icon text={TEXT} />);
    await user.click(screen.getByRole('button', { name: 'share' }));
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('unable_share'));
    expect(toast.promise).not.toHaveBeenCalled();
  });

  test('when the text cannot be shared, it falls back to the dialog', async () => {
    stubNavigator({ canShare: () => false, share: vi.fn() });
    const user = userEvent.setup();
    render(<Share disabled={false} icon text={TEXT} />);
    await user.click(screen.getByRole('button', { name: 'share' }));
    expect(navigator.share).not.toHaveBeenCalled();
    expect(screen.getByTestId('share-textarea')).toBeTruthy();
  });
});
