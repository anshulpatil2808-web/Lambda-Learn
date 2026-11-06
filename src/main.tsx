import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error',
    };
  }

  componentDidCatch(error: Error) {
    console.error('Lambda Learn caught runtime error:', error);
    try {
      localStorage.removeItem('lambda_learn_user');
      localStorage.removeItem('lambda_learn_posts');
      localStorage.removeItem('lambda_learn_photos');
      localStorage.removeItem('lambda_learn_user_v2');
      localStorage.removeItem('lambda_learn_posts_v2');
      localStorage.removeItem('lambda_learn_photos_v2');
    } catch {
      // ignore storage errors
    }
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090416] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-[#130a2a] border border-amber-500/40 p-8 text-center space-y-4 shadow-2xl">
            <div className="text-3xl font-serif font-bold text-amber-300">λ LAMBDA LEARN</div>
            <h1 className="text-xl font-bold text-white">Space Cab Systems Resetting</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              We cleared cached browser data that conflicted with the latest update. Click below to launch Lambda Learn cleanly.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm cursor-pointer"
            >
              Launch Lambda Learn
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
