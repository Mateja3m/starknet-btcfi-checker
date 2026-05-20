# Architecture

The project uses a small monorepo layout:

```text
apps/web
packages/core
docs
```

`packages/core` contains the readiness engine. It is responsible for typed inputs, typed check results, scoring, report generation, demo data, and adapter contracts. It has no runtime dependencies in this PoC.

`apps/web` is a Next.js app that imports the core package and renders a local dashboard. It uses mocked scenarios so the UI can demonstrate `PASS`, `WARN`, and `FAIL` reports without connecting to a real wallet.

`docs` explains the design, checks, security assumptions, and usage.

## Core Flow

1. A caller prepares a `ReadinessInput`.
2. The core package runs checks in a stable order.
3. The route check calls an optional `RouteReadinessAdapter`.
4. The scoring module derives a numeric score and top-level status.
5. The report module returns a stable `ReadinessReport`.

The core package does not fetch secrets, manage wallet sessions, sign payloads, or execute transactions.

## Adapter Boundary

Adapters are used for data that may come from external systems:

- wallet connection state
- Starknet network state
- gas and asset balances
- strkBTC metadata
- route availability

This PoC only includes a mock route adapter. Future adapters must stay read-only and should document their data sources, freshness assumptions, and failure behavior.

## Report Stability

The exported report shape is intentionally small:

```ts
type ReadinessReport = {
  status: "PASS" | "WARN" | "FAIL" | "INFO";
  score: number;
  checks: ReadinessCheck[];
  generatedAt: string;
};
```

Use `toStableReadinessJson(report)` when a deterministic key order is useful for UI display, tests, or logs.

## Non-Goals

The architecture does not include smart contracts, bridge execution, swap execution, yield routing, custody, token deployment, ZK proof generation, or financial recommendations.

