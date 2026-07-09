"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside Patch Notes:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 bg-zinc-950 text-zinc-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                <AlertTriangle className="h-10 w-10 text-rose-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Something went wrong</h1>
              <p className="text-sm text-zinc-400">
                An unexpected rendering error occurred. This can happen if the data structure returned by the server did not match expectations.
              </p>
              {this.state.error && (
                <pre className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-left text-xs font-mono text-rose-400 overflow-x-auto whitespace-pre-wrap mt-4 max-h-40">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
