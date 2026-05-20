import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  createDemoReadinessInput,
  createMockRouteReadinessAdapter,
  generateReadinessReport,
  toStableReadinessJson,
} from "../src";

test("generates a PASS report when actionable checks pass", async () => {
  const report = await generateReadinessReport(
    createDemoReadinessInput({
      routeAdapter: createMockRouteReadinessAdapter({ mode: "pass" }),
    }),
  );

  assert.equal(report.status, "PASS");
  assert.equal(report.score, 100);
  assert.equal(report.generatedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(report.checks.length, 6);
});

test("generates a WARN report when a balance is low but non-zero", async () => {
  const report = await generateReadinessReport(
    createDemoReadinessInput({
      gas: {
        balance: "0.25",
        estimatedFee: "0.2",
      },
      routeAdapter: createMockRouteReadinessAdapter({ mode: "warn" }),
    }),
  );

  assert.equal(report.status, "WARN");
  assert.ok(report.score < 100);
  assert.ok(report.checks.some((check) => check.status === "WARN"));
});

test("generates a FAIL report when critical wallet and asset checks fail", async () => {
  const report = await generateReadinessReport(
    createDemoReadinessInput({
      wallet: {
        isConnected: false,
      },
      strkBtcAsset: {
        balance: "0",
      },
      routeAdapter: createMockRouteReadinessAdapter({ mode: "pass" }),
    }),
  );

  assert.equal(report.status, "FAIL");
  assert.ok(report.score < 80);
  assert.ok(report.checks.some((check) => check.id === "wallet.connected" && check.status === "FAIL"));
  assert.ok(
    report.checks.some((check) => check.id === "asset.strkbtc.balance" && check.status === "FAIL"),
  );
});

test("serializes reports with stable top-level and check field order", async () => {
  const report = await generateReadinessReport(
    createDemoReadinessInput({
      routeAdapter: createMockRouteReadinessAdapter({ mode: "pass" }),
    }),
  );

  assert.equal(
    toStableReadinessJson(report).split("\n").slice(0, 5).join("\n"),
    [
      "{",
      '  "status": "PASS",',
      '  "score": 100,',
      '  "checks": [',
      "    {",
    ].join("\n"),
  );
});
