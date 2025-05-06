/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_API_URL: string;
  // Add other VITE_ env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}