# Security

This project is designed as a read-only readiness checker.

## Rules

- Never ask for private keys, mnemonics, seed phrases, or recovery material.
- Never store private keys or wallet secrets.
- Never auto-sign transactions or typed data.
- Never submit transactions.
- Never execute bridge, swap, lending, borrowing, staking, yield, or liquidity actions.
- Never custody funds.
- Never hardcode secrets.
- Keep all checks read-only.
- Mark mock/demo data clearly.

## Data Handling

The core package accepts snapshots. A snapshot may represent wallet connection state, chain ID, balances, token metadata, or route availability. The core package treats these values as untrusted input and returns checks rather than executing side effects.

Amount parsing uses integer units derived from decimal strings. Invalid amount data produces a `FAIL` check instead of throwing through the report generator.

## Adapter Expectations

Adapters should:

- perform read-only queries only
- return explicit `WARN` or `INFO` checks when a data source is unavailable
- document data freshness assumptions
- avoid secrets in configuration
- avoid logging wallet addresses unless the caller explicitly chooses to log reports

Adapters must not:

- request signatures
- submit transactions
- create approvals
- move funds
- custody assets
- hide mock data as live data

## Demo Assumptions

The Next.js app uses mocked wallet, network, token, balance, and route data. The displayed address and token address are placeholders. They are present so the report shape and UI can be tested without a live Starknet wallet.

## Residual Risks

- A passing report can become stale if wallet, network, gas, asset, or route state changes.
- A read-only route adapter may be wrong if its upstream provider is stale or incomplete.
- A readiness score is not a risk score.
- This project does not evaluate protocol risk, bridge risk, liquidity risk, oracle risk, smart contract risk, or market risk.

