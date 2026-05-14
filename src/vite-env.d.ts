/// <reference types="vite/client" />

declare global {
  interface Window {
    // Injected by index.php — the litz the server picked so the browser can
    // start downloading the GIF before React boots.
    __INITIAL_LITZ__?: string;
  }
}

export {};
