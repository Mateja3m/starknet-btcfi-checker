# Usage

## Install Dependencies

```bash
npm install
```

## Run the Demo

```bash
npm run dev
```

Open the local URL printed by Next.js.

The demo app starts with mocked data. Use the scenario control to switch between a ready wallet, a low-gas wallet, and a disconnected wallet.

## Run Tests

```bash
npm test
```

The core package tests compile TypeScript test files and run them with Node's built-in test runner.

## Build

```bash
npm run build
```

This builds the core package first, then the web app.

## Use the Core Package

```ts
import {
  createDemoReadinessInput,
  createMockRouteReadinessAdapter,
  generateReadinessReport,
  toStableReadinessJson,
} from "@starknet-btcfi-checker/core";

const input = createDemoReadinessInput({
  routeAdapter: createMockRouteReadinessAdapter({ mode: "pass" }),
});

const report = await generateReadinessReport(input);

console.log(toStableReadinessJson(report));
```

## Provide Live Read-Only Data

Prepare a `ReadinessInput` with live read-only values:

```ts
const input = {
  wallet: {
    isConnected: true,
    address: "0x...",
  },
  network: {
    currentChainId: "SN_MAIN",
    expectedChainId: "SN_MAIN",
    rpcReachable: true,
  },
  gas: {
    feeTokenSymbol: "STRK",
    balance: "4.2",
    estimatedFee: "0.05",
    decimals: 18,
  },
  strkBtcAsset: {
    symbol: "strkBTC",
    balance: "0.01",
    minimumRecommendedBalance: "0.001",
    decimals: 8,
    tokenAddress: "0x...",
  },
  strkBtc: {
    symbol: "strkBTC",
    contractAddress: "0x...",
    metadataVerified: true,
    balanceModel: "indexer",
  },
};
```

The package does not fetch live data by itself in this PoC.

## Add a Route Adapter

```ts
import type { RouteReadinessAdapter } from "@starknet-btcfi-checker/core";

const routeAdapter: RouteReadinessAdapter = {
  id: "read-only-route-adapter",
  label: "Route readiness",
  async check() {
    return {
      id: "route.readiness",
      label: "Route readiness",
      status: "INFO",
      message: "Read-only route adapter not implemented yet.",
    };
  },
};
```

A route adapter must only report availability signals. It must not execute the route.

