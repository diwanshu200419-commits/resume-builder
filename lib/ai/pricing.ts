import "server-only";

export interface AiPricingConfig {
  provider: "google" | "openai";
  model: string;
  inputCostPer1kTokensInr: number;
  outputCostPer1kTokensInr: number;
  flatFallbackScanCostInr: number;
}

export const AI_PRICING_REGISTRY: Record<string, AiPricingConfig> = {
  "gemini-1.5-flash": {
    provider: "google",
    model: "gemini-1.5-flash",
    inputCostPer1kTokensInr: 0.006,  // ~₹0.006 / 1k input tokens
    outputCostPer1kTokensInr: 0.024, // ~₹0.024 / 1k output tokens
    flatFallbackScanCostInr: 0.35,   // ~₹0.35 per resume scan fallback
  },
  "gemini-1.5-pro": {
    provider: "google",
    model: "gemini-1.5-pro",
    inputCostPer1kTokensInr: 0.10,   // ~₹0.10 / 1k input tokens
    outputCostPer1kTokensInr: 0.30,   // ~₹0.30 / 1k output tokens
    flatFallbackScanCostInr: 0.85,
  },
};

export function calculateAiCostInr(
  model: string,
  inputTokens?: number,
  outputTokens?: number
): number {
  const config = AI_PRICING_REGISTRY[model] || AI_PRICING_REGISTRY["gemini-1.5-flash"];

  if (inputTokens !== undefined && outputTokens !== undefined) {
    const inputCost = (inputTokens / 1000) * config.inputCostPer1kTokensInr;
    const outputCost = (outputTokens / 1000) * config.outputCostPer1kTokensInr;
    return Number((inputCost + outputCost).toFixed(4));
  }

  return config.flatFallbackScanCostInr;
}
