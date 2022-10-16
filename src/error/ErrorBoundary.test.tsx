import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalcErrorboundary from './CalcErrorBoundary';
import ErrorBoundary from './ErrorBoundary';
import '@testing-library/jest-dom';

describe('Error Boundary', () => {
  test('Calc Error Boundary', () => {
    render(<CalcErrorboundary />);

    expect(screen.getByTestId('calc-errorboundary')).toBeVisible();
    userEvent.click(screen.getByTestId('calc-error-reset'));
  });

  test('Error Boundary', () => {
    render(<ErrorBoundary />);

    expect(screen.getByTestId('errorboundary')).toBeVisible();
  });
});
