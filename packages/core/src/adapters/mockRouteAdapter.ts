import type { ReadinessCheck, RouteReadinessAdapter } from "../types";

export type MockRouteMode = "pass" | "warn" | "info";

export type MockRouteAdapterOptions = {
  mode?: MockRouteMode;
};

export function createMockRouteReadinessAdapter(
  options: MockRouteAdapterOptions = {},
): RouteReadinessAdapter {
  const mode = options.mode ?? "info";

  return {
    id: "mock-route-adapter",
    label: "Route readiness",
    check(): ReadinessCheck {
      if (mode === "pass") {
        return {
          id: "route.readiness",
          label: "Route readiness",
          status: "PASS",
          message: "Mock route adapter reports that a read-only route is available.",
        };
      }

      if (mode === "warn") {
        return {
          id: "route.readiness",
          label: "Route readiness",
          status: "WARN",
          message: "Mock route adapter cannot confirm route availability.",
          recommendation: "Use a live read-only route adapter before relying on this signal.",
        };
      }

      return {
        id: "route.readiness",
        label: "Route readiness",
        status: "INFO",
        message: "Route readiness is using a mock placeholder and does not query live liquidity.",
        recommendation: "Replace the mock adapter with a read-only integration for live environments.",
      };
    },
  };
}

