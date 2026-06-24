import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import pa11y from "pa11y";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";

const REPORTS_DIR = "./testing/reports";

const APPS = [
    {
        name: "static-html",
        url: "http://localhost:8080",
        type: "static" as const,
        startCmd: "npx",
        startArgs: [
            "http-server",
            path.resolve(__dirname, "../apps/Native_HTML"),
            "-p",
            "8080",
            "--silent",
        ],
        waitForReady: "http://localhost:8080",
    },
    {
        name: "native-angular",
        url: "http://localhost:4300",
        type: "angular" as const,
        startCmd: "npm",
        startArgs: ["start"],
        cwd: path.resolve(__dirname, "../apps/Native_Angular/angular-native"),
        waitForReady: "http://localhost:4300",
    },
    {
        name: "ssr-angular",
        url: "http://localhost:4200",
        type: "angular" as const,
        startCmd: "npm",
        startArgs: ["start"],
        cwd: path.resolve(__dirname, "../apps/Angular_SSR/angular-ssr"),
        waitForReady: "http://localhost:4200",
    },
];

const WCAG_CONFIG = {
    standard: "WCAG2AA" as const,
    tags: ["wcag2a", "wcag2aa"],
    runners: ["axe"],
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });

interface BenchmarkResult {
    tool: string;
    browser: string;
    app: string;
    durationMs: number;
    timestamp: string;
}

const benchmarkResults: BenchmarkResult[] = [];

function generateRunId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
}

const RUN_ID = generateRunId();

function saveReport(tool: string, browser: string, app: string, data: any) {
    const dir = path.join(REPORTS_DIR, tool, app);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
        path.join(dir, `${browser}-${RUN_ID}.json`),
        JSON.stringify(data, null, 2),
    );
}

function saveBenchmark(result: BenchmarkResult) {
    const benchmarkWithRunId = {
        ...result,
        runId: RUN_ID,
    };
    benchmarkResults.push(benchmarkWithRunId);
    fs.writeFileSync(
        path.join(REPORTS_DIR, `benchmark-${RUN_ID}.json`),
        JSON.stringify(benchmarkResults, null, 2),
    );
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function waitForServer(url: string, timeoutMs = 60000): Promise<void> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const poll = () => {
            http.get(url, (res) => {
                if (res.statusCode === 200) {
                    resolve();
                } else if (Date.now() - start > timeoutMs) {
                    reject(
                        new Error(
                            `Server at ${url} responded with ${res.statusCode} after timeout`,
                        ),
                    );
                } else {
                    setTimeout(poll, 1000);
                }
            }).on("error", () => {
                if (Date.now() - start > timeoutMs) {
                    reject(
                        new Error(
                            `Server at ${url} not ready after ${timeoutMs}ms`,
                        ),
                    );
                } else {
                    setTimeout(poll, 1000);
                }
            });
        };
        poll();
    });
}

async function startServer(app: (typeof APPS)[0]): Promise<any> {
    if (!app.startCmd) return null;

    const server = spawn(app.startCmd, app.startArgs || [], {
        stdio: "pipe",
        shell: true,
        cwd: (app as any).cwd || process.cwd(),
    });

    server.stdout.on("data", (data: Buffer) => {
        console.log(`[${app.name}] ${data.toString()}`);
    });
    server.stderr.on("data", (data: Buffer) => {
        console.error(`[${app.name}] ${data.toString()}`);
    });

    if (app.type === "angular") {
        const readyPromise = new Promise<void>((resolve) => {
            const onData = (data: Buffer) => {
                if (data.toString().includes("Compiled successfully")) {
                    resolve();
                    server.stdout.removeListener("data", onData);
                }
            };
            server.stdout.on("data", onData);
            setTimeout(() => resolve(), 30000);
        });
        await Promise.race([
            readyPromise,
            waitForServer(app.waitForReady, 60000),
        ]);
    } else {
        await waitForServer(app.waitForReady, 30000);
    }

    console.log(`[${app.name}] сервер готов`);
    return server;
}

function stopServer(server: any) {
    if (!server) return;
    try {
        if (process.platform === "win32") {
            spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"]);
        } else {
            server.kill("SIGTERM");
        }
    } catch (e) {
        console.error("Ошибка при остановке сервера:", e);
    }
}

for (const app of shuffleArray(APPS)) {
    test.describe(app.name, () => {
        let server: any = null;

        test.beforeAll(async () => {
            console.log(`Запускаем сервер для ${app.name}...`);
            server = await startServer(app);
        });

        test.afterAll(() => {
            stopServer(server);
        });

        const tools = shuffleArray(["axe-core", "pa11y", "lighthouse"]);

        for (const tool of tools) {
            if (tool === "axe-core") {
                test("axe-core", async ({ page, browserName }) => {
                    const startTime = Date.now();

                    await page.goto(app.url, { waitUntil: "networkidle" });
                    const results = await new AxeBuilder({ page })
                        .withTags(WCAG_CONFIG.tags)
                        .analyze();

                    const duration = Date.now() - startTime;

                    saveReport("axe-core", browserName, app.name, results);
                    saveBenchmark({
                        tool: "axe-core",
                        browser: browserName,
                        app: app.name,
                        durationMs: duration,
                        timestamp: new Date().toISOString(),
                    });
                });
            }

            if (tool === "pa11y") {
                test("pa11y", async ({ browserName }) => {
                    test.skip(
                        browserName !== "chromium",
                        "Pa11y работает только в Chrome, пропускаем для других браузеров",
                    );

                    const startTime = Date.now();

                    const results = await pa11y(app.url, {
                        standard: WCAG_CONFIG.standard,
                        runners: WCAG_CONFIG.runners,
                    });

                    const duration = Date.now() - startTime;

                    saveReport("pa11y", "chromium", app.name, results);
                    saveBenchmark({
                        tool: "pa11y",
                        browser: "chromium",
                        app: app.name,
                        durationMs: duration,
                        timestamp: new Date().toISOString(),
                    });
                });
            }

            if (tool === "lighthouse") {
                test("lighthouse", async ({ browserName }) => {
                    test.skip(
                        browserName !== "chromium",
                        "Lighthouse работает только в Chrome, пропускаем для других браузеров",
                    );

                    const startTime = Date.now();

                    const chrome = await chromeLauncher.launch({
                        chromeFlags: ["--headless"],
                    });
                    const options = {
                        logLevel: "error" as const,
                        output: "json" as const,
                        onlyCategories: ["accessibility"],
                        port: chrome.port,
                    };

                    const runnerResult = await lighthouse(app.url, options);
                    await chrome.kill();

                    const duration = Date.now() - startTime;

                    saveReport("lighthouse", "chromium", app.name, {
                        score: runnerResult?.lhr.categories.accessibility.score,
                        audits: runnerResult?.lhr.audits,
                    });
                    saveBenchmark({
                        tool: "lighthouse",
                        browser: "chromium",
                        app: app.name,
                        durationMs: duration,
                        timestamp: new Date().toISOString(),
                    });
                });
            }
        }
    });
}

test.afterAll(() => {
    console.log("\n Бенчмарк результатов:");
    console.table(
        benchmarkResults.map((r) => ({
            Инструмент: r.tool,
            Браузер: r.browser,
            Приложение: r.app,
            "Время (мс)": r.durationMs,
        })),
    );
});
