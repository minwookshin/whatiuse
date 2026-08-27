import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedTheme = process.argv[2];
const themes = requestedTheme ? [requestedTheme] : ["light", "dark"];

if (themes.some((theme) => theme !== "light" && theme !== "dark")) {
  console.error("Usage: node scripts/run-storybook-tests.mjs [light|dark]");
  process.exit(2);
}

const vitestArgs = (theme) => [
  "run",
  "--config",
  "vitest.storybook.config.mts",
  `--project=storybook-${theme}`,
];

function run(root, theme) {
  const vitest = path.join(root, "node_modules", ".bin", "vitest");
  const result = spawnSync(vitest, vitestArgs(theme), {
    cwd: root,
    env: { ...process.env, VITEST: "true" },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function hasUnsafeStorybookPath(root) {
  return /[^\x20-\x7e]|\s/.test(root);
}

function copyDependencies(destination) {
  const source = path.join(projectRoot, "node_modules");
  if (!existsSync(source)) throw new Error("node_modules is missing. Run npm ci first.");
  mkdirSync(destination, { recursive: true });

  if (process.platform === "darwin") {
    const result = spawnSync("/bin/cp", ["-cR", source, destination], { stdio: "inherit" });
    if (!result.error && result.status === 0) return;
    rmSync(path.join(destination, "node_modules"), { force: true, recursive: true });
  }

  cpSync(source, path.join(destination, "node_modules"), {
    recursive: true,
    dereference: true,
  });
}

function prepareAsciiWorkspace() {
  const lockfile = readFileSync(path.join(projectRoot, "package-lock.json"));
  const dependencyKey = createHash("sha256").update(lockfile).digest("hex").slice(0, 16);
  const dependencyRoot = path.join(tmpdir(), `whatiuse-storybook-deps-${dependencyKey}`);
  const cachedNodeModules = path.join(dependencyRoot, "node_modules");

  if (!existsSync(path.join(cachedNodeModules, ".bin", "vitest"))) {
    rmSync(dependencyRoot, { force: true, recursive: true });
    copyDependencies(dependencyRoot);
  }

  const runRoot = mkdtempSync(path.join(tmpdir(), "whatiuse-storybook-run-"));
  for (const entry of [".storybook", "src"]) {
    cpSync(path.join(projectRoot, entry), path.join(runRoot, entry), { recursive: true });
  }
  for (const entry of [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.mjs",
    "vitest.storybook.config.mts",
  ]) {
    cpSync(path.join(projectRoot, entry), path.join(runRoot, entry));
  }
  symlinkSync(cachedNodeModules, path.join(runRoot, "node_modules"), "dir");
  return runRoot;
}

let runRoot = projectRoot;
let removeRunRoot = false;

try {
  if (hasUnsafeStorybookPath(projectRoot)) {
    console.log("Storybook tests: using an ASCII temporary workspace for browser-module compatibility.");
    runRoot = prepareAsciiWorkspace();
    removeRunRoot = true;
  }

  for (const theme of themes) {
    const status = run(runRoot, theme);
    if (status !== 0) process.exitCode = status;
    if (status !== 0) break;
  }
} finally {
  if (removeRunRoot) rmSync(runRoot, { force: true, recursive: true });
}
