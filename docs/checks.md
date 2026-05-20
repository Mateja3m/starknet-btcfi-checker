# Checks

Checks return a `ReadinessCheck`:

```ts
type ReadinessCheck = {
  id: string;
  label: string;
  status: "PASS" | "WARN" | "FAIL" | "INFO";
  message: string;
  recommendation?: string;
};
```

## Wallet Readiness

ID: `wallet.connected`

Checks whether a Starknet wallet appears connected and has a syntactically valid Starknet-style address.

- `PASS`: wallet is connected and address is present.
- `FAIL`: wallet is disconnected, missing, or malformed.

The check does not request private keys and does not sign messages.

## Network Readiness

ID: `network.chain`

Checks whether the wallet network matches the expected Starknet chain and whether a read-only RPC signal is reachable.

- `PASS`: expected chain is selected and reachable.
- `WARN`: expected chain is selected but RPC reachability is unavailable.
- `FAIL`: chain is missing or does not match.

## Gas Readiness

ID: `gas.balance`

Compares a fee token balance against an estimated fee using integer token-unit parsing.

- `PASS`: balance is at least twice the estimate.
- `WARN`: balance covers the estimate but has little buffer.
- `FAIL`: balance is below the estimate or amount data cannot be parsed.
- `INFO`: no fee estimate is configured.

## Asset Readiness

ID: `asset.strkbtc.balance`

Checks whether the configured strkBTC balance meets a caller-defined threshold.

- `PASS`: balance meets the threshold.
- `WARN`: balance is non-zero but below the threshold.
- `FAIL`: balance is zero or amount data cannot be parsed.
- `INFO`: no minimum threshold is configured.

This is a readiness signal only. It does not acquire, bridge, wrap, unwrap, or swap assets.

## strkBTC Readiness Model

ID: `strkbtc.model`

Checks whether strkBTC metadata and the balance source model are configured.

- `PASS`: token address, metadata, and balance model are configured for non-mock data.
- `INFO`: demo metadata is configured and clearly marked as mock.
- `WARN`: token address is missing, metadata is not verified, or balance source is unknown.

The demo token address is a placeholder.

## Route Readiness

ID: `route.readiness`

The route check is intentionally adapter-based.

- Without an adapter, it returns `INFO`.
- With the mock adapter, it can return `PASS`, `WARN`, or `INFO`.
- A live adapter must be read-only and must not execute a route.

The route readiness check must not bridge, swap, quote as a commitment, sign, or submit transactions.

## Scoring

The score is a simple average of actionable checks:

- `PASS`: 100
- `WARN`: 60
- `FAIL`: 0
- `INFO`: excluded from the average

Top-level status is derived from the checks:

- any `FAIL` returns `FAIL`
- otherwise any `WARN` returns `WARN`
- otherwise any `PASS` returns `PASS`
- otherwise `INFO`

