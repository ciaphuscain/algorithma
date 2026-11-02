"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** What failed, in words a learner understands ("this array view"). */
  label: string;
  /** When this value changes (e.g. the trace position), the boundary tries again. */
  resetKey?: unknown;
}

interface State {
  error: Error | null;
}

/**
 * Contains rendering failures to the part of the page that failed. A bug in one
 * renderer must not blank the lesson, the controls or the other structures.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept in the console for diagnosis; there is no telemetry backend yet.
    console.error(`[ALGORITHMA] ${this.props.label} failed to render`, error, info.componentStack);
  }

  override componentDidUpdate(prev: Props): void {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div className="alert alert--error" role="alert" data-testid="render-error">
        <strong>Could not draw {this.props.label}.</strong> The rest of the page still works.
        Details: <code>{this.state.error.message}</code>
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn btn--small"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
