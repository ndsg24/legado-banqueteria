import { defineConfig } from '@playwright/test'

const origin = 'http://127.0.0.1:4189'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: origin + '/legado-banqueteria/',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    reducedMotion: 'reduce',
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'fotos', testMatch: 'photos.spec.ts' },
    { name: 'worker', testMatch: 'worker.spec.ts' },
    {
      name: 'escritorio',
      testIgnore: ['worker.spec.ts', 'photos.spec.ts'],
      use: { viewport: { width: 1280, height: 850 } },
    },
    {
      name: 'movil',
      testIgnore: ['worker.spec.ts', 'photos.spec.ts'],
      use: { viewport: { width: 390, height: 844 }, hasTouch: true, colorScheme: 'dark' },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4189 --strictPort',
    url: origin + '/legado-banqueteria/',
  },
})
