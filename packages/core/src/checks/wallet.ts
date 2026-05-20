import type { ReadinessCheck, WalletSnapshot } from "../types";

const STARKNET_ADDRESS_PATTERN = /^0x[0-9a-fA-F]{1,64}$/;

export function checkWalletReadiness(wallet: WalletSnapshot): ReadinessCheck {
  if (!wallet.isConnected) {
    return {
      id: "wallet.connected",
      label: "Wallet readiness",
      status: "FAIL",
      message: "No Starknet wallet connection is available.",
      recommendation: "Connect a Starknet wallet before entering a BTCFi flow.",
    };
  }

  if (!wallet.address || !STARKNET_ADDRESS_PATTERN.test(wallet.address)) {
    return {
      id: "wallet.connected",
      label: "Wallet readiness",
      status: "FAIL",
      message: "The connected wallet address is missing or malformed.",
      recommendation: "Reconnect the wallet and verify the displayed Starknet address.",
    };
  }

  return {
    id: "wallet.connected",
    label: "Wallet readiness",
    status: "PASS",
    message: wallet.isMock
      ? "Mock Starknet wallet data is connected for this demo."
      : "A Starknet wallet address is available.",
  };
}

