import { parseTokenAmount } from "../amounts";
import type { AssetSnapshot, ReadinessCheck } from "../types";

export function checkStrkBtcAssetReadiness(asset: AssetSnapshot): ReadinessCheck {
  try {
    const balance = parseTokenAmount(asset.balance, asset.decimals);
    const minimum = parseTokenAmount(asset.minimumRecommendedBalance, asset.decimals);

    if (minimum === 0n) {
      return {
        id: "asset.strkbtc.balance",
        label: "Asset readiness",
        status: "INFO",
        message: `No minimum ${asset.symbol} balance is configured for this demo.`,
        recommendation: "Configure a read-only balance threshold for the intended flow.",
      };
    }

    if (balance >= minimum) {
      return {
        id: "asset.strkbtc.balance",
        label: "Asset readiness",
        status: "PASS",
        message: asset.isMock
          ? `Mock ${asset.symbol} balance meets the demo threshold.`
          : `${asset.symbol} balance meets the configured threshold.`,
      };
    }

    if (balance > 0n) {
      return {
        id: "asset.strkbtc.balance",
        label: "Asset readiness",
        status: "WARN",
        message: `${asset.symbol} balance is present but below the configured threshold.`,
        recommendation: "Review the intended flow requirements before continuing.",
      };
    }

    return {
      id: "asset.strkbtc.balance",
      label: "Asset readiness",
      status: "FAIL",
      message: `${asset.symbol} balance is zero.`,
      recommendation: "Acquire the required asset only through trusted, external tools. This checker will not execute that action.",
    };
  } catch (error) {
    return {
      id: "asset.strkbtc.balance",
      label: "Asset readiness",
      status: "FAIL",
      message: "Asset readiness data could not be parsed.",
      recommendation: error instanceof Error ? error.message : "Provide valid asset balance data.",
    };
  }
}

