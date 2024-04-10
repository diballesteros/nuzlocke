import { useCallback } from 'react';
import { DEFAULT_VALUES } from 'constants/calculator';
import useStore from 'store';

function ErrorBoundary(): React.JSX.Element {
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  return (
    <main
      data-testid="calc-errorboundary"
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '0.857rem',
        textAlign: 'center',
      }}
    >
      <h1>Nuzlocke Tracker</h1>
      <span style={{ color: 'red' }}>
        An unknown problem has occured please reload the app and report the bug from menu in the top
        left corner. If the page is unable to load please click the button below and reload the app.
      </span>
      <button
        data-testid="calc-error-reset"
        type="button"
        onClick={() => update({ ...DEFAULT_VALUES })}
      >
        Reset Calculator Data
      </button>
    </main>
  );
}
export default ErrorBoundary;
