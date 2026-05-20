import type {
  ReadinessCheck,
  ReadinessInput,
  RouteReadinessAdapter,
  RouteReadinessContext,
} from "../types";

export function createRouteReadinessContext(input: ReadinessInput): RouteReadinessContext {
  return {
    wallet: input.wallet,
    network: input.network,
    strkBtcAsset: input.strkBtcAsset,
    strkBtc: input.strkBtc,
  };
}

export async function checkRouteReadiness(
  input: ReadinessInput,
  adapter?: RouteReadinessAdapter,
): Promise<ReadinessCheck> {
  if (!adapter) {
    return {
      id: "route.readiness",
      label: "Route readiness",
      status: "INFO",
      message: "No route adapter is configured. Route readiness is a placeholder in this PoC.",
      recommendation: "Implement a read-only route adapter before using this signal for live flows.",
    };
  }

  try {
    return await adapter.check(createRouteReadinessContext(input));
  } catch (error) {
    return {
      id: "route.readiness",
      label: adapter.label,
      status: "WARN",
      message: "The route readiness adapter failed during a read-only check.",
      recommendation: error instanceof Error ? error.message : "Inspect the route adapter error.",
    };
  }
}

