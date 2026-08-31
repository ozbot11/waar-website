import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // TODO: set this to your production domain before deploying
  site: 'https://www.washingtonaerialrobotics.com',
  build: { format: 'directory' },
  server: { port: 4321, strictPort: true },
});
