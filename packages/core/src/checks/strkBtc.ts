import type { ReadinessCheck, StrkBtcModelSnapshot } from "../types";

export function checkStrkBtcModelReadiness(strkBtc: StrkBtcModelSnapshot): ReadinessCheck {
  if (!strkBtc.contractAddress) {
    return {
      id: "strkbtc.model",
      label: "strkBTC readiness model",
      status: "WARN",
      message: "No strkBTC contract address is configured for this environment.",
      recommendation: "Configure a verified token address before using live readiness data.",
    };
  }

  if (strkBtc.balanceModel === "unknown") {
    return {
      id: "strkbtc.model",
      label: "strkBTC readiness model",
      status: "WARN",
      message: "The strkBTC balance source is unknown.",
      recommendation: "Use a documented wallet, RPC, or indexer balance source.",
    };
  }

  if (!strkBtc.metadataVerified) {
    return {
      id: "strkbtc.model",
      label: "strkBTC readiness model",
      status: "WARN",
      message: `${strkBtc.symbol} metadata has not been verified by this checker.`,
      recommendation: "Verify token metadata and address mapping before relying on the asset signal.",
    };
  }

  return {
    id: "strkbtc.model",
    label: "strkBTC readiness model",
    status: strkBtc.isMock ? "INFO" : "PASS",
    message: strkBtc.isMock
      ? "strkBTC readiness is using clearly marked mock token metadata."
      : "strkBTC token metadata and balance model are configured.",
    ...(strkBtc.isMock
      ? {
          recommendation:
            "Replace mock token metadata with verified live data before production use.",
        }
      : {}),
  };
}
