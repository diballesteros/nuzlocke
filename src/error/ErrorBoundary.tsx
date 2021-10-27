function ErrorBoundary(): JSX.Element {
  return (
    <main
      data-testid="errorboundary"
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '10px',
        textAlign: 'center',
      }}
    >
      <h1>Nuzlocke Tracker</h1>
      <span style={{ color: 'red' }}>
        An unknown problem has occured please reload the app and report the bug from menu in the top
        left corner. If the page is unable to load please delete cache for this page and reload.
      </span>
    </main>
  );
}
export default ErrorBoundary;
