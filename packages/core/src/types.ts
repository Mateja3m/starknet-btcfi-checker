export type CheckStatus = "PASS" | "WARN" | "FAIL" | "INFO";

export type ReadinessCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
  recommendation?: string;
};

export type ReadinessReport = {
  status: CheckStatus;
  score: number;
  checks: ReadinessCheck[];
  generatedAt: string;
};

export type StarknetChainId = "SN_MAIN" | "SN_SEPOLIA" | (string & {});

export type WalletSnapshot = {
  isConnected: boolean;
  address?: string | undefined;
  label?: string | undefined;
  isMock?: boolean;
};

export type NetworkSnapshot = {
  currentChainId?: StarknetChainId | undefined;
  expectedChainId: StarknetChainId;
  rpcReachable: boolean;
  isMock?: boolean;
};

export type GasSnapshot = {
  feeTokenSymbol: string;
  balance: string;
  estimatedFee: string;
  decimals: number;
  isMock?: boolean;
};

export type AssetSnapshot = {
  symbol: string;
  balance: string;
  minimumRecommendedBalance: string;
  decimals: number;
  tokenAddress?: string | undefined;
  isMock?: boolean;
};

export type StrkBtcModelSnapshot = {
  symbol: string;
  contractAddress?: string | undefined;
  metadataVerified: boolean;
  balanceModel: "wallet" | "indexer" | "mock" | "unknown";
  isMock?: boolean;
};

export type RouteReadinessContext = {
  wallet: WalletSnapshot;
  network: NetworkSnapshot;
  strkBtcAsset: AssetSnapshot;
  strkBtc: StrkBtcModelSnapshot;
};

export type RouteReadinessAdapter = {
  id: string;
  label: string;
  check(context: RouteReadinessContext): Promise<ReadinessCheck> | ReadinessCheck;
};

export type ReadinessInput = {
  wallet: WalletSnapshot;
  network: NetworkSnapshot;
  gas: GasSnapshot;
  strkBtcAsset: AssetSnapshot;
  strkBtc: StrkBtcModelSnapshot;
  routeAdapter?: RouteReadinessAdapter;
  now?: () => Date;
};
