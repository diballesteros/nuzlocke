import * as Sentry from '@sentry/react';
import { render, screen } from '@testing-library/react';
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
});
