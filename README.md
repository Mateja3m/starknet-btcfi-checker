# Starknet BTCFi Preflight Checker

Small Proof of Concept for a read-only TypeScript readiness checker for Starknet wallets preparing for strkBTC BTCFi flows.

The demo app currently uses **mocked data only**. It does not connect to a live wallet, RPC, token contract, bridge, swap route, or DeFi protocol.

## What It Does

- Generates a stable readiness report:
  - `status`
  - `score`
  - `checks`
  - `generatedAt`
- Checks wallet, network, gas, strkBTC asset, strkBTC model, and route-readiness placeholder signals.
- Provides a reusable core package in `packages/core`.
- Provides a simple Next.js demo app in `apps/web`.
- Keeps all checks read-only.

## What It Does Not Do

- No private key handling.
- No transaction signing.
- No transaction execution.
- No bridge, swap, yield, custody, or financial recommendation features.
- No smart contracts or token deployment.

## Structure

```text
apps/web        Next.js demo app with mocked wallet scenarios
packages/core   TypeScript readiness engine
docs            Architecture, check, security, and usage notes
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

The local app is usually available at `http://localhost:3000`.

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Core Usage

```ts
import {
  createDemoReadinessInput,
  generateReadinessReport,
  toStableReadinessJson,
} from "@starknet-btcfi-checker/core";

const report = await generateReadinessReport(createDemoReadinessInput());

console.log(toStableReadinessJson(report));
```

## Live Data

Live Starknet integrations are intentionally not included in this PoC. A future live adapter should be optional, read-only, and configured through public inputs such as RPC URL, wallet address, token address, and chain ID.

Do not add private keys, signing, transaction submission, or custody flows.

## Notes

- The demo data is clearly marked as mock data in the UI and report messages.
- The route readiness check is an adapter placeholder.
- The current Next.js version is pinned to a canary release because stable Next pins a PostCSS version flagged by `npm audit`. Revisit this when stable Next includes the patched dependency.

More detail is available in [docs](docs).
