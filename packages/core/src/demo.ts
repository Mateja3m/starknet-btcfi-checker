import { createMockRouteReadinessAdapter } from "./adapters/mockRouteAdapter";
import type { ReadinessInput } from "./types";

const DEMO_NOW = new Date("2026-01-01T00:00:00.000Z");

export type DemoReadinessInputOverrides = Omit<
  Partial<ReadinessInput>,
  "wallet" | "network" | "gas" | "strkBtcAsset" | "strkBtc"
> & {
  wallet?: Partial<ReadinessInput["wallet"]>;
  network?: Partial<ReadinessInput["network"]>;
  gas?: Partial<ReadinessInput["gas"]>;
  strkBtcAsset?: Partial<ReadinessInput["strkBtcAsset"]>;
  strkBtc?: Partial<ReadinessInput["strkBtc"]>;
};

export function createDemoReadinessInput(
  overrides: DemoReadinessInputOverrides = {},
): ReadinessInput {
  const base: ReadinessInput = {
    wallet: {
      isConnected: true,
      address: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      label: "Mock Starknet wallet",
      isMock: true,
    },
    network: {
      currentChainId: "SN_SEPOLIA",
      expectedChainId: "SN_SEPOLIA",
      rpcReachable: true,
      isMock: true,
    },
    gas: {
      feeTokenSymbol: "STRK",
      balance: "12.5",
      estimatedFee: "0.2",
      decimals: 18,
      isMock: true,
    },
    strkBtcAsset: {
      symbol: "strkBTC",
      balance: "0.05",
      minimumRecommendedBalance: "0.01",
      decimals: 8,
      tokenAddress: "0x0456000000000000000000000000000000000000000000000000000000000000",
      isMock: true,
    },
    strkBtc: {
      symbol: "strkBTC",
      contractAddress: "0x0456000000000000000000000000000000000000000000000000000000000000",
      metadataVerified: true,
      balanceModel: "mock",
      isMock: true,
    },
    routeAdapter: createMockRouteReadinessAdapter(),
    now: () => DEMO_NOW,
  };

  return {
    ...base,
    ...overrides,
    wallet: { ...base.wallet, ...overrides.wallet },
    network: { ...base.network, ...overrides.network },
    gas: { ...base.gas, ...overrides.gas },
    strkBtcAsset: { ...base.strkBtcAsset, ...overrides.strkBtcAsset },
    strkBtc: { ...base.strkBtc, ...overrides.strkBtc },
  };
}
