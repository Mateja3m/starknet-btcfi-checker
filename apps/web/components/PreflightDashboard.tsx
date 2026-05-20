"use client";

import {
  createDemoReadinessInput,
  createMockRouteReadinessAdapter,
  generateReadinessReport,
  toStableReadinessJson,
  type CheckStatus,
  type ReadinessInput,
  type ReadinessReport,
} from "@starknet-btcfi-checker/core";
import { useMemo, useState } from "react";

type ScenarioId = "ready" | "low-gas" | "not-connected";

type Scenario = {
  id: ScenarioId;
  label: string;
  input: ReadinessInput;
};

const readyScenario: Scenario = {
  id: "ready",
  label: "Ready",
  input: createDemoReadinessInput({
    routeAdapter: createMockRouteReadinessAdapter({ mode: "pass" }),
    now: () => new Date(),
  }),
};

const scenarios: Scenario[] = [
  readyScenario,
  {
    id: "low-gas",
    label: "Low gas",
    input: createDemoReadinessInput({
      gas: {
        balance: "0.25",
        estimatedFee: "0.2",
      },
      routeAdapter: createMockRouteReadinessAdapter({ mode: "warn" }),
      now: () => new Date(),
    }),
  },
  {
    id: "not-connected",
    label: "Not connected",
    input: createDemoReadinessInput({
      wallet: {
        isConnected: false,
        address: undefined,
      },
      network: {
        currentChainId: undefined,
        rpcReachable: false,
      },
      strkBtcAsset: {
        balance: "0",
      },
      routeAdapter: createMockRouteReadinessAdapter({ mode: "info" }),
      now: () => new Date(),
    }),
  },
];

const statusClassName: Record<CheckStatus, string> = {
  PASS: "statusPass",
  WARN: "statusWarn",
  FAIL: "statusFail",
  INFO: "statusInfo",
};

export function PreflightDashboard() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("ready");
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? readyScenario,
    [scenarioId],
  );

  async function runPreflightCheck() {
    setIsRunning(true);
    setError(null);

    try {
      setReport(await generateReadinessReport(scenario.input));
    } catch (caughtError) {
      setReport(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The preflight check failed unexpectedly.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  const reportJson = report ? toStableReadinessJson(report) : "{\n  \"status\": \"INFO\"\n}";

  return (
    <main className="shell">
      <section className="headerBand">
        <div>
          <h1>Starknet BTCFi Preflight Checker</h1>
          <p className="lede">
            Read-only readiness checks for Starknet wallets preparing for strkBTC flows.
          </p>
        </div>
        <div className="scorePanel" aria-live="polite">
          <span className="scoreLabel">Readiness score</span>
          <strong>{report ? report.score : "--"}</strong>
          <span className={`statusPill ${report ? statusClassName[report.status] : "statusInfo"}`}>
            {report ? report.status : "INFO"}
          </span>
        </div>
      </section>

      <section className="workspaceGrid">
        <div className="columnStack">
          <div className="panel">
            <div className="panelHeader">
              <h2>Wallet state</h2>
              <span className="mockBadge">Mock data</span>
            </div>

            <div className="scenarioControl" role="group" aria-label="Mock wallet scenario">
              {scenarios.map((item) => (
                <button
                  className={item.id === scenarioId ? "scenarioButton active" : "scenarioButton"}
                  key={item.id}
                  onClick={() => {
                    setScenarioId(item.id);
                    setReport(null);
                    setError(null);
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <dl className="walletFacts">
              <div>
                <dt>Connection</dt>
                <dd>{scenario.input.wallet.isConnected ? "Connected" : "Disconnected"}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  {scenario.input.wallet.isConnected && scenario.input.wallet.address
                    ? scenario.input.wallet.address
                    : "Unavailable"}
                </dd>
              </div>
              <div>
                <dt>Network</dt>
                <dd>{scenario.input.network.currentChainId ?? "Undetected"}</dd>
              </div>
              <div>
                <dt>strkBTC</dt>
                <dd>
                  {scenario.input.strkBtcAsset.balance} {scenario.input.strkBtcAsset.symbol}
                </dd>
              </div>
            </dl>

            <button className="runButton" disabled={isRunning} onClick={runPreflightCheck} type="button">
              {isRunning ? "Running check" : "Run preflight check"}
            </button>

            {error ? <p className="errorText">{error}</p> : null}
          </div>

          <div className="panel">
            <div className="panelHeader">
              <h2>JSON report</h2>
              <span>Stable shape</span>
            </div>
            <pre className="jsonViewer">{reportJson}</pre>
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <h2>Checks</h2>
            <span>{report ? `${report.checks.length} signals` : "Not run"}</span>
          </div>
          <ul className="checkList">
            {report ? (
              report.checks.map((check) => (
                <li key={check.id} className="checkItem">
                  <div>
                    <span className={`statusPill ${statusClassName[check.status]}`}>
                      {check.status}
                    </span>
                    <h3>{check.label}</h3>
                  </div>
                  <p>{check.message}</p>
                  {check.recommendation ? (
                    <p className="recommendation">{check.recommendation}</p>
                  ) : null}
                </li>
              ))
            ) : (
              <li className="emptyState">Run a preflight check to generate the readiness list.</li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
