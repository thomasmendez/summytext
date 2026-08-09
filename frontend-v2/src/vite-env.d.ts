/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUM_MY_TEXT_SERVICE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
