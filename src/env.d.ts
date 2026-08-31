/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_APPLY_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}