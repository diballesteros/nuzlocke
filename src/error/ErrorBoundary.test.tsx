import * as Sentry from '@sentry/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalcErrorboundary from './CalcErrorBoundary';
import ErrorBoundary from './ErrorBoundary';
import '@testing-library/jest-dom';

describe('Error Boundary', () => {
  test('Error Boundary', () => {
    const ThrowError = () => {
      throw new Error('Test');
    };
    render(
      <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
        <ThrowError />
      </Sentry.ErrorBoundary>
    );

    expect(screen.getByTestId('errorboundary')).toBeVisible();
  });

  test('Calc Error Boundary', () => {
    const ThrowError = () => {
      throw new Error('Test');
    };

    render(
      <Sentry.ErrorBoundary fallback={<CalcErrorboundary />}>
        <ThrowError />
      </Sentry.ErrorBoundary>
    );

    expect(screen.getByTestId('calc-errorboundary')).toBeVisible();
    userEvent.click(screen.getByTestId('calc-error-reset'));
  });
});
