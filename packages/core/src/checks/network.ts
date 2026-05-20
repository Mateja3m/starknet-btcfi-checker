import type { NetworkSnapshot, ReadinessCheck } from "../types";

export function checkNetworkReadiness(network: NetworkSnapshot): ReadinessCheck {
  if (!network.currentChainId) {
    return {
      id: "network.chain",
      label: "Network readiness",
      status: "FAIL",
      message: "The active Starknet network could not be detected.",
      recommendation: `Switch the wallet to ${network.expectedChainId}.`,
    };
  }

  if (network.currentChainId !== network.expectedChainId) {
    return {
      id: "network.chain",
      label: "Network readiness",
      status: "FAIL",
      message: `Wallet is on ${network.currentChainId}, expected ${network.expectedChainId}.`,
      recommendation: `Switch the wallet network to ${network.expectedChainId}.`,
    };
  }

  if (!network.rpcReachable) {
    return {
      id: "network.chain",
      label: "Network readiness",
      status: "WARN",
      message: `${network.expectedChainId} is selected, but the read-only RPC check is unavailable.`,
      recommendation: "Retry the preflight check or use a reachable Starknet RPC endpoint.",
    };
  }

  return {
    id: "network.chain",
    label: "Network readiness",
    status: "PASS",
    message: network.isMock
      ? `${network.expectedChainId} is selected using mock network data.`
      : `${network.expectedChainId} is selected and reachable.`,
  };
}

