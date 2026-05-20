import { checkStrkBtcAssetReadiness } from "./checks/assets";
import { checkGasReadiness } from "./checks/gas";
import { checkNetworkReadiness } from "./checks/network";
import { checkRouteReadiness } from "./checks/route";
import { checkStrkBtcModelReadiness } from "./checks/strkBtc";
import { checkWalletReadiness } from "./checks/wallet";
import { calculateReadinessScore, summarizeStatus } from "./scoring";
import type { ReadinessCheck, ReadinessInput, ReadinessReport } from "./types";

export async function generateReadinessReport(input: ReadinessInput): Promise<ReadinessReport> {
  const checks: ReadinessCheck[] = [
    checkWalletReadiness(input.wallet),
    checkNetworkReadiness(input.network),
    checkGasReadiness(input.gas),
    checkStrkBtcAssetReadiness(input.strkBtcAsset),
    checkStrkBtcModelReadiness(input.strkBtc),
    await checkRouteReadiness(input, input.routeAdapter),
  ];

  return {
    status: summarizeStatus(checks),
    score: calculateReadinessScore(checks),
    checks,
    generatedAt: (input.now ?? (() => new Date()))().toISOString(),
  };
}

export function toStableReadinessJson(report: ReadinessReport): string {
  const stableReport: ReadinessReport = {
    status: report.status,
    score: report.score,
    checks: report.checks.map((check) => ({
      id: check.id,
      label: check.label,
      status: check.status,
      message: check.message,
      ...(check.recommendation ? { recommendation: check.recommendation } : {}),
    })),
    generatedAt: report.generatedAt,
  };

  return JSON.stringify(stableReport, null, 2);
}

