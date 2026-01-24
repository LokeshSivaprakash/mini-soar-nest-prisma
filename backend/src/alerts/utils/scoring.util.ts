import { ReputationResult } from './reputation.util';

export function computeRiskScore(enrichments: ReputationResult[], base: number = 10): number {
  // take max confidence + small additive for count
  const max = enrichments.reduce((m, r) => Math.max(m, r.confidence), 0);
  const countBoost = Math.min(20, enrichments.length * 3);
  const score = Math.min(100, base + max + countBoost);
  return Math.round(score);
}

export function severityFromScore(score: number) {
  if (score >= 85) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}
