// Robust Polyfill for process global
// This creates a fake 'process' object so libraries like Google GenAI don't crash
if (typeof window !== 'undefined') {
  // Use any cast to prevent TypeScript errors on window.process
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  } else if (typeof (window as any).process.env === 'undefined') {
    (window as any).process.env = {};
  }
}

// Minimal Buffer polyfill if needed by some encodings
if (typeof window !== 'undefined' && !(window as any).global) {
    (window as any).global = window;
}

export {};