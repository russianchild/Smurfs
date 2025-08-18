/// <reference types="vite/client" />

declare global {
  interface Window {
    ElevenLabsWidget?: any;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id': string;
    };
  }
}
