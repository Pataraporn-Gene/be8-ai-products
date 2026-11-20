// Runs only the lib/*.test.ts files affected by your uncommitted changes.
// Usage: npm run test:related [-- <git-ref>]   (default ref: HEAD; e.g. origin/main for the whole branch)
// - lib/X.ts changed      -> tests that import lib/X.ts directly or through other lib files
// - lib/X.test.ts changed -> that test
// - *.md changed          -> ignored
// - anything else changed (app/, components/, config, package.json, ...) -> full suite
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).split("\n").filter(Boolean);
const ref = process.argv[2] ?? "HEAD";
const changed = [...new Set([...git("diff", "--name-only", ref), ...git("ls-files", "--others", "--exclude-standard")])]
  .filter((f) => !f.endsWith(".md"));

const libFiles = readdirSync("lib").filter((f) => f.endsWith(".ts")).map((f) => `lib/${f}`);
const allTests = libFiles.filter((f) => f.endsWith(".test.ts"));
// Direct lib imports of a file: `from "./x"` or `from "./x.ts"` -> lib/x.ts
const importsOf = (file) =>
  [...readFileSync(file, "utf8").matchAll(/from\s+["']\.\/([\w.-]+?)(?:\.ts)?["']/g)].map((m) => `lib/${m[1]}.ts`);
const dependsOn = (file, target, seen = new Set()) =>
  importsOf(file).some((dep) => dep === target || (!seen.has(dep) && libFiles.includes(dep) && (seen.add(dep), dependsOn(dep, target, seen))));

let tests = new Set();
for (const file of changed) {
  if (!/^lib\/[^/]+\.ts$/.test(file)) {
    console.log(`${file} is outside lib/ -> running the full suite`);
    tests = new Set(allTests);
    break;
  }
  if (file.endsWith(".test.ts")) {
    if (existsSync(file)) tests.add(file); // a deleted test has nothing to run
  }
  else allTests.filter((t) => dependsOn(t, file)).forEach((t) => tests.add(t));
}

if (tests.size === 0) {
  console.log(changed.length ? `No tests cover: ${changed.join(", ")}` : `No changed files vs ${ref} (ignoring *.md); nothing to test.`);
  process.exit(0);
}
console.log(`Running: ${[...tests].join(" ")}`);
const run = spawnSync(
  process.execPath,
  ["--test", `--test-concurrency=${process.env.TEST_WORKERS || 2}`, ...tests],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
