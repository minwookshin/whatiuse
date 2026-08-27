import path from "node:path";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookProject = (theme: "light" | "dark") => ({
  extends: true as const,
  plugins: [storybookTest({
      configDir: path.join(dirname, ".storybook"),
      initialGlobals: { theme },
      tags: { include: ["test"], exclude: [], skip: [] },
    })],
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" as const }],
    },
  },
});

export default defineConfig({
  server: {
    fs: {
      allow: [dirname, realpathSync(path.join(dirname, "node_modules"))],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  test: {
    projects: [storybookProject("light"), storybookProject("dark")],
  },
});
