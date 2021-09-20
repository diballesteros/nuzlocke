/* eslint-disable react/state-in-constructor */
/* eslint-disable react/prop-types */
import React, { Component, ErrorInfo } from 'react';

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component {
  public state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <main
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '10px',
            textAlign: 'center',
          }}
        >
          <h1>Nuzlocke Tracker</h1>
          <span style={{ color: 'red' }}>
            An unknown problem has occured please reload the app and report the bug from menu in the
            top left corner. If the page is unable to load please delete cache for this page and
            reload.
          </span>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
