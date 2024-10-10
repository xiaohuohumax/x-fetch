import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      "@/": "./packages",
    },
    coverage: {
      include: [
        "packages/**/src/**/*.ts",
      ],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*template*/**",
      ],
    },
  },
})
