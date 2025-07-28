/* eslint-disable @typescript-eslint/no-unused-expressions */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalcErrorboundary from './CalcErrorBoundary';
import ErrorBoundary from './ErrorBoundary';

describe('Error Boundary', () => {
  test('Calc Error Boundary', async () => {
    const user = userEvent.setup();
    render(<CalcErrorboundary />);

    expect(screen.getByTestId('calc-errorboundary')).to.exist;
    await user.click(screen.getByTestId('calc-error-reset'));
  });

  test('Error Boundary', () => {
    render(<ErrorBoundary />);

    expect(screen.getByTestId('errorboundary')).to.exist;
  });
});
