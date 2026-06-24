import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./testing",
    testMatch: "**/*.spec.ts",
    projects: [
        { name: "chromium", use: { browserName: "chromium" } },
        { name: "firefox", use: { browserName: "firefox" } },
        { name: "webkit", use: { browserName: "webkit" } },
    ],
    reporter: [["list"], ["json", { outputFile: "./reports/summary.json" }]],
    timeout: 60000,
    retries: 0,
    workers: 1,
});
