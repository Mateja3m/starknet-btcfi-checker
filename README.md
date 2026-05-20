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

The local app is available at `http://localhost:3000`.

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Live Data

Live Starknet integrations are intentionally not included in this PoC. A future live adapter should be optional, read-only, and configured through public inputs such as RPC URL, wallet address, token address, and chain ID.

Do not add private keys, signing, transaction submission, or custody flows.
