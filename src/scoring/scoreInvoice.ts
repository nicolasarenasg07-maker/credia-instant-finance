/**
 * Single source of truth for invoice scoring.
 * Used by: landing pre-score, SME dashboard, admin deal review.
 * TODO: replace mock with real backend (Supabase/Firebase)
 */

export type PayerTier = 'A' | 'B' | 'C';
export type Decision = 'APPROVE' | 'REJECT' | 'REQUEST_DOCS';
export type SmeSizeBand = 'micro' | 'small' | 'medium';

export interface ScoreInputs {
  invoiceAmount: number;
  daysToDue: number;
  payerName: string;
  payerTier?: PayerTier;
  docCompleteness?: number; // 0–100
  concentrationRisk?: number; // 0–100
  smeSizeBand?: SmeSizeBand;
  disputeRate?: number; // 0–100 (percent)
}

export interface ScoreResult {
  score: number; // 0–100
  decision: Decision;
  pricing: {
    feePercent: number; // capped 1.5%–6.0%
    impliedAPR: number;
  };
  explanation: string[];
  assumptionsUsed: string[];
  /** Component sub-scores for detailed admin view */
  components: {
    payerScore: number;
    docScore: number;
    timeScore: number;
    amountScore: number;
    concScore: number;
    dispScore: number;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/** Deterministic string → positive integer hash (djb2). */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Well-known top-tier payers used in the demo
const KNOWN_TIER_A = [
  'siemens', 'bmw', 'deutsche post', 'basf', 'volkswagen', 'mercedes',
  'bosch', 'sap', 'allianz', 'daimler', 'henkel', 'bayer',
];
const KNOWN_TIER_B = [
  'midcorp', 'europarts', 'logisticsexp', 'greenmanuf',
];

/** Infer payer tier deterministically from name when not provided. */
export function inferPayerTier(payerName: string): PayerTier {
  const lower = payerName.toLowerCase().trim();
  if (KNOWN_TIER_A.some(c => lower.includes(c))) return 'A';
  if (KNOWN_TIER_B.some(c => lower.includes(c))) return 'B';
  // Fallback: deterministic hash-based
  const h = hashString(lower) % 100;
  if (h < 25) return 'A';
  if (h < 60) return 'B';
  return 'C';
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

/**
 * Deterministic, explainable invoice scoring.
 *
 * Weights (max 100 total):
 *   Payer quality     0–30
 *   Doc completeness  0–20
 *   Payment timeline  0–15
 *   Invoice amount    0–15
 *   Concentration     0–10
 *   Dispute rate      0–10
 *
 * Thresholds:
 *   >= 75  → APPROVE
 *   55–74  → REQUEST_DOCS
 *   < 55   → REJECT
 */
export function scoreInvoice(inputs: ScoreInputs): ScoreResult {
  const assumptions: string[] = [];
  const explanation: string[] = [];

  // --- Resolve optional inputs with conservative defaults ----------------

  const payerTier: PayerTier = inputs.payerTier ?? (() => {
    const t = inferPayerTier(inputs.payerName);
    assumptions.push(`Payer tier inferred as "${t}" from name (no verified tier provided)`);
    return t;
  })();

  const docCompleteness: number = inputs.docCompleteness ?? (() => {
    assumptions.push('Document completeness assumed 50% (no documents uploaded)');
    return 50;
  })();

  const concentrationRisk: number = inputs.concentrationRisk ?? (() => {
    assumptions.push('Concentration risk assumed 30% (default for new SMEs)');
    return 30;
  })();

  const disputeRate: number = inputs.disputeRate ?? (() => {
    assumptions.push('Dispute rate assumed 5% (industry average)');
    return 5;
  })();

  // smeSizeBand only affects explanation text, not score directly
  const _smeSizeBand = inputs.smeSizeBand ?? (() => {
    assumptions.push('SME size assumed "small" (no profile data)');
    return 'small' as SmeSizeBand;
  })();

  // --- Component scores --------------------------------------------------

  // 1. Payer quality (0–30)
  let payerScore: number;
  switch (payerTier) {
    case 'A': payerScore = 28; break;
    case 'B': payerScore = 18; break;
    case 'C': payerScore = 6; break;
  }
  explanation.push(`Payer quality (${payerTier}-tier): ${payerScore}/30`);

  // 2. Document completeness (0–20)
  const docScore = Math.round((clamp(docCompleteness, 0, 100) / 100) * 20);
  explanation.push(`Document completeness (${docCompleteness}%): ${docScore}/20`);

  // 3. Payment timeline (0–15)
  let timeScore: number;
  const days = Math.max(inputs.daysToDue, 1);
  if (days <= 30) timeScore = 15;
  else if (days <= 60) timeScore = 12;
  else if (days <= 90) timeScore = 8;
  else timeScore = 4;
  explanation.push(`Payment timeline (${days}d): ${timeScore}/15`);

  // 4. Invoice amount sweet-spot (0–15)
  let amountScore: number;
  const amt = inputs.invoiceAmount;
  if (amt < 5_000) amountScore = 8;
  else if (amt <= 50_000) amountScore = 14;
  else if (amt <= 200_000) amountScore = 11;
  else amountScore = 7;
  explanation.push(`Invoice amount (€${amt.toLocaleString()}): ${amountScore}/15`);

  // 5. Concentration risk (0–10) – lower is better
  const concScore = Math.round(((100 - clamp(concentrationRisk, 0, 100)) / 100) * 10);
  explanation.push(`Concentration risk (${concentrationRisk}%): ${concScore}/10`);

  // 6. Dispute rate (0–10) – lower is better
  const dispScore = Math.round(((100 - clamp(disputeRate, 0, 100)) / 100) * 10);
  explanation.push(`Dispute rate (${disputeRate}%): ${dispScore}/10`);

  // --- Aggregate ---------------------------------------------------------

  const rawScore = payerScore + docScore + timeScore + amountScore + concScore + dispScore;
  const score = clamp(rawScore, 0, 100);

  // --- Decision ----------------------------------------------------------

  let decision: Decision;
  if (score >= 75) decision = 'APPROVE';
  else if (score >= 55) decision = 'REQUEST_DOCS';
  else decision = 'REJECT';

  // --- Pricing -----------------------------------------------------------
  // Inverse mapping: high score → low fee, low score → high fee
  // Range: 1.5% (best) to 6.0% (worst)

  const feePercent = clamp(
    Math.round((6.0 - (score / 100) * 4.5) * 100) / 100,
    1.5,
    6.0,
  );

  const annualizedDays = Math.max(inputs.daysToDue, 1);
  const impliedAPR = Math.round((feePercent / 100) * (365 / annualizedDays) * 100 * 100) / 100;

  return {
    score,
    decision,
    pricing: { feePercent, impliedAPR },
    explanation,
    assumptionsUsed: assumptions,
    components: { payerScore, docScore, timeScore, amountScore, concScore, dispScore },
  };
}
