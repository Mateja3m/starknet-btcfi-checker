import type { CheckStatus, ReadinessCheck } from "./types";

const ACTIONABLE_STATUS_SCORE: Record<Exclude<CheckStatus, "INFO">, number> = {
  PASS: 100,
  WARN: 60,
  FAIL: 0,
};

export function summarizeStatus(checks: ReadinessCheck[]): CheckStatus {
  if (checks.some((check) => check.status === "FAIL")) {
    return "FAIL";
  }

  if (checks.some((check) => check.status === "WARN")) {
    return "WARN";
  }

  if (checks.some((check) => check.status === "PASS")) {
    return "PASS";
  }

  return "INFO";
}

export function calculateReadinessScore(checks: ReadinessCheck[]): number {
  const actionableChecks = checks.filter((check) => check.status !== "INFO");

  if (actionableChecks.length === 0) {
    return 0;
  }

  const total = actionableChecks.reduce((sum, check) => {
    return sum + ACTIONABLE_STATUS_SCORE[check.status as Exclude<CheckStatus, "INFO">];
  }, 0);

  return Math.round(total / actionableChecks.length);
}

