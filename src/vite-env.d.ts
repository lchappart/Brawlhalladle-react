/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAWLHALLA_API_KEY: string
  readonly VITE_BRAWLHALLA_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
