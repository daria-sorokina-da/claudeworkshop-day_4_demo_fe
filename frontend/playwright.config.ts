import { defineConfig } from '@playwright/test'

const PROOFS_DIR = '../../temp'

export default defineConfig({
  testDir: '../e2e',
  outputDir: PROOFS_DIR,
  use: {
    baseURL: 'http://localhost:5173',
    video: 'on',
    screenshot: 'on',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
