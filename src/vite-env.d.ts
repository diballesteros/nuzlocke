/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SENTRY_DSN: string;
  readonly REACT_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
