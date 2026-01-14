import './polyfill'; // MUST BE FIRST IMPORT
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Error Handler for non-React errors
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="color: #ff5555; background: #09090b; padding: 20px; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: sans-serif;">
        <h2 style="font-weight: 900; letter-spacing: -0.05em; font-style: italic;">Application Error</h2>
        <p style="opacity: 0.6; font-size: 14px;">${message}</p>
        <button onclick="localStorage.clear(); window.location.reload();" style="margin-top: 24px; padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
          Reset App
        </button>
      </div>
    `;
  }
};

class ErrorBoundary extends React.Component<any, any> {
  state: {
    hasError: boolean;
    error: any;
  };
  props: {
    children: React.ReactNode;
  };

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-zinc-950 text-white h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
          <h1 className="text-3xl font-black italic tracking-tighter mb-4">APPLICATION ERROR</h1>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8 max-w-md overflow-auto text-left shadow-2xl">
            <code className="text-xs text-zinc-500">
              {this.state.error?.toString() || 'Unknown Connection Error'}
            </code>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="bg-violet-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-violet-500 shadow-lg shadow-violet-600/30 transition-all"
          >
            Clear Cache & Restart
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);