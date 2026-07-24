import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e', // <-- Tells Playwright to ONLY look inside the e2e directory
  use: {
    baseURL: 'http://localhost:5173', // Your Vite server URL
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})