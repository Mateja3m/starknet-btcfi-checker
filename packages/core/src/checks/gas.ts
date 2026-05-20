import { parseTokenAmount } from "../amounts";
import type { GasSnapshot, ReadinessCheck } from "../types";

export function checkGasReadiness(gas: GasSnapshot): ReadinessCheck {
  try {
    const balance = parseTokenAmount(gas.balance, gas.decimals);
    const estimatedFee = parseTokenAmount(gas.estimatedFee, gas.decimals);

    if (estimatedFee === 0n) {
      return {
        id: "gas.balance",
        label: "Gas readiness",
        status: "INFO",
        message: "No fee estimate is available for this read-only demo check.",
        recommendation: "Provide a read-only fee estimate before relying on this signal.",
      };
    }

    if (balance < estimatedFee) {
      return {
        id: "gas.balance",
        label: "Gas readiness",
        status: "FAIL",
        message: `${gas.feeTokenSymbol} balance is below the estimated fee requirement.`,
        recommendation: `Add enough ${gas.feeTokenSymbol} to cover network fees before entering the flow.`,
      };
    }

    if (balance < estimatedFee * 2n) {
      return {
        id: "gas.balance",
        label: "Gas readiness",
        status: "WARN",
        message: `${gas.feeTokenSymbol} balance covers the estimate but leaves little buffer.`,
        recommendation: `Keep additional ${gas.feeTokenSymbol} available for fee movement.`,
      };
    }

    return {
      id: "gas.balance",
      label: "Gas readiness",
      status: "PASS",
      message: gas.isMock
        ? `Mock ${gas.feeTokenSymbol} gas balance is above the demo estimate.`
        : `${gas.feeTokenSymbol} balance is above the estimated fee with buffer.`,
    };
  } catch (error) {
    return {
      id: "gas.balance",
      label: "Gas readiness",
      status: "FAIL",
      message: "Gas readiness data could not be parsed.",
      recommendation: error instanceof Error ? error.message : "Provide valid gas balance data.",
    };
  }
}

