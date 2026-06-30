declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTH_LOGIN_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
