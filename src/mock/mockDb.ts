/**
 * localStorage-backed mock database.
 * Provides API-like CRUD functions for invoices, deals, SMEs, payers, and audit.
 * Seeded with demo data on first load.
 * TODO: replace mock with real backend (Supabase/Firebase)
 */

import type { Deal, SME, AuditLog } from '@/lib/mockData';
import type { ExtractedFields } from '@/scoring/simulateExtraction';
import { simulateExtraction, computeDocCompleteness } from '@/scoring/simulateExtraction';
import { scoreInvoice, inferPayerTier } from '@/scoring/scoreInvoice';
import type { PayerTier, ScoreResult } from '@/scoring/scoreInvoice';

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

const KEYS = {
  deals: 'credia_deals',
  smes: 'credia_smes',
  audit: 'credia_audit',
  payers: 'credia_payers',
  seeded: 'credia_seeded',
} as const;

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// Payer type (lightweight)
// ---------------------------------------------------------------------------

export interface Payer {
  id: string;
  name: string;
  tier: PayerTier;
  country: string;
  disputeRate: number; // 0–100
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seedPayers: Payer[] = [
  { id: 'payer-001', name: 'Siemens AG', tier: 'A', country: 'Germany', disputeRate: 2 },
  { id: 'payer-002', name: 'BMW Group', tier: 'A', country: 'Germany', disputeRate: 1 },
  { id: 'payer-003', name: 'BASF SE', tier: 'A', country: 'Germany', disputeRate: 3 },
  { id: 'payer-004', name: 'Deutsche Post', tier: 'A', country: 'Germany', disputeRate: 2 },
  { id: 'payer-005', name: 'StartupXYZ', tier: 'C', country: 'Germany', disputeRate: 15 },
  { id: 'payer-006', name: 'MidCorp GmbH', tier: 'B', country: 'Germany', disputeRate: 7 },
];

const seedSMEs: SME[] = [
  {
    id: 'sme-001', companyName: 'TechFlow Solutions', email: 'finance@techflow.de',
    registrationNumber: 'HRB 123456', country: 'Germany', profileCompleteness: 100,
    kybStatus: 'verified', totalFunded: 450000, activeDeals: 2,
    joinedAt: '2023-06-15', lastActivity: '2024-02-06T09:30:00Z', riskTier: 'low',
  },
  {
    id: 'sme-002', companyName: 'Green Manufacturing Ltd', email: 'accounts@greenmanuf.co.uk',
    registrationNumber: 'UK-89012345', country: 'United Kingdom', profileCompleteness: 85,
    kybStatus: 'verified', totalFunded: 78500, activeDeals: 1,
    joinedAt: '2023-11-20', lastActivity: '2024-02-05T14:20:00Z', riskTier: 'medium',
  },
  {
    id: 'sme-003', companyName: 'Digital Marketing Pro', email: 'info@digitalmpro.com',
    registrationNumber: 'NL-56789012', country: 'Netherlands', profileCompleteness: 70,
    kybStatus: 'pending', totalFunded: 0, activeDeals: 1,
    joinedAt: '2024-01-10', lastActivity: '2024-02-04T11:45:00Z', riskTier: 'high',
  },
  {
    id: 'sme-004', companyName: 'Logistics Express', email: 'billing@logisticsexp.de',
    registrationNumber: 'HRB 789012', country: 'Germany', profileCompleteness: 100,
    kybStatus: 'verified', totalFunded: 890000, activeDeals: 3,
    joinedAt: '2022-09-01', lastActivity: '2024-02-06T11:00:00Z', riskTier: 'low',
  },
  {
    id: 'sme-005', companyName: 'Creative Agency Hub', email: 'finance@creativeagency.fr',
    registrationNumber: 'FR-34567890', country: 'France', profileCompleteness: 45,
    kybStatus: 'pending', totalFunded: 0, activeDeals: 0,
    joinedAt: '2024-02-01', lastActivity: '2024-02-03T09:00:00Z', riskTier: 'medium',
  },
  {
    id: 'sme-006', companyName: 'Suspended Corp', email: 'admin@suspended.com',
    registrationNumber: 'ES-12345678', country: 'Spain', profileCompleteness: 100,
    kybStatus: 'suspended', totalFunded: 125000, activeDeals: 0,
    joinedAt: '2023-03-15', lastActivity: '2024-01-15T10:00:00Z', riskTier: 'high',
  },
];

/** Pre-scored seed deals — scores were computed with scoreInvoice() for consistency */
const seedDeals: Deal[] = [
  {
    id: 'deal-001', invoiceNumber: 'INV-2024-0142', smeId: 'sme-001',
    smeName: 'TechFlow Solutions', payerName: 'Siemens AG',
    amount: 45000, currency: 'EUR', dueDate: '2024-03-15',
    submittedAt: '2024-02-06T09:30:00Z', status: 'pending_review',
    aiScore: 87, invoiceRiskScore: 92, payerRiskScore: 95, smeReliabilityScore: 78,
    suggestedRate: 2.09, decision: 'APPROVE',
    aiExplanation: 'Payer quality (A-tier): 28/30. Document completeness (100%): 20/20. Payment timeline (38d): 12/15. Invoice amount (€45,000): 14/15. Concentration risk (10%): 9/10. Dispute rate (2%): 10/10.',
    scoreExplanation: [
      'Payer quality (A-tier): 28/30',
      'Document completeness (100%): 20/20',
      'Payment timeline (38d): 12/15',
      'Invoice amount (€45,000): 14/15',
      'Concentration risk (10%): 9/10',
      'Dispute rate (2%): 10/10',
    ],
    assumptionsUsed: [],
    extractedFields: {
      invoiceDate: '2024-02-01',
      lineItems: [
        { description: 'Software Development Services - Q1', amount: 38000 },
        { description: 'Cloud Infrastructure Setup', amount: 7000 },
      ],
      taxAmount: 8550, totalAmount: 45000,
    },
  },
  {
    id: 'deal-002', invoiceNumber: 'INV-2024-0089', smeId: 'sme-002',
    smeName: 'Green Manufacturing Ltd', payerName: 'BASF SE',
    amount: 78500, currency: 'EUR', dueDate: '2024-03-30',
    submittedAt: '2024-02-05T14:20:00Z', status: 'pending_review',
    aiScore: 72, invoiceRiskScore: 75, payerRiskScore: 88, smeReliabilityScore: 65,
    suggestedRate: 2.76, decision: 'REQUEST_DOCS',
    aiExplanation: 'Payer quality (A-tier): 28/30. Document completeness (70%): 14/20. Payment timeline (53d): 12/15. Invoice amount (€78,500): 11/15. Concentration risk (30%): 7/10. Dispute rate (3%): 10/10.',
    scoreExplanation: [
      'Payer quality (A-tier): 28/30',
      'Document completeness (70%): 14/20',
      'Payment timeline (53d): 12/15',
      'Invoice amount (€78,500): 11/15',
      'Concentration risk (30%): 7/10',
      'Dispute rate (3%): 10/10',
    ],
    assumptionsUsed: [],
    extractedFields: {
      invoiceDate: '2024-01-28',
      lineItems: [
        { description: 'Industrial Equipment Parts', amount: 65000 },
        { description: 'Installation Services', amount: 13500 },
      ],
      taxAmount: 14915, totalAmount: 78500,
    },
  },
  {
    id: 'deal-003', invoiceNumber: 'INV-2024-0201', smeId: 'sme-003',
    smeName: 'Digital Marketing Pro', payerName: 'StartupXYZ',
    amount: 12000, currency: 'EUR', dueDate: '2024-02-28',
    submittedAt: '2024-02-04T11:45:00Z', status: 'pending_review',
    aiScore: 45, invoiceRiskScore: 40, payerRiskScore: 35, smeReliabilityScore: 82,
    suggestedRate: 3.98, decision: 'REJECT',
    aiExplanation: 'Payer quality (C-tier): 6/30. Document completeness (50%): 10/20. Payment timeline (22d): 15/15. Invoice amount (€12,000): 14/15. Concentration risk (50%): 5/10. Dispute rate (15%): 9/10.',
    scoreExplanation: [
      'Payer quality (C-tier): 6/30',
      'Document completeness (50%): 10/20',
      'Payment timeline (22d): 15/15',
      'Invoice amount (€12,000): 14/15',
      'Concentration risk (50%): 5/10',
      'Dispute rate (15%): 9/10',
    ],
    assumptionsUsed: [],
    extractedFields: {
      invoiceDate: '2024-02-01',
      lineItems: [
        { description: 'Marketing Campaign Q1', amount: 8000 },
        { description: 'Social Media Management', amount: 4000 },
      ],
      taxAmount: 2280, totalAmount: 12000,
    },
  },
  {
    id: 'deal-004', invoiceNumber: 'INV-2024-0178', smeId: 'sme-001',
    smeName: 'TechFlow Solutions', payerName: 'BMW Group',
    amount: 125000, currency: 'EUR', dueDate: '2024-04-15',
    submittedAt: '2024-02-03T16:00:00Z', status: 'approved',
    aiScore: 94, invoiceRiskScore: 96, payerRiskScore: 98, smeReliabilityScore: 78,
    suggestedRate: 1.77, finalRate: 1.77, decision: 'APPROVE',
    aiExplanation: 'Payer quality (A-tier): 28/30. Document completeness (100%): 20/20. Payment timeline (68d): 12/15. Invoice amount (€125,000): 11/15. Concentration risk (5%): 10/10. Dispute rate (1%): 10/10.',
    scoreExplanation: [
      'Payer quality (A-tier): 28/30',
      'Document completeness (100%): 20/20',
      'Payment timeline (68d): 12/15',
      'Invoice amount (€125,000): 11/15',
      'Concentration risk (5%): 10/10',
      'Dispute rate (1%): 10/10',
    ],
    assumptionsUsed: [],
    extractedFields: {
      invoiceDate: '2024-01-30',
      lineItems: [
        { description: 'Enterprise Software License', amount: 100000 },
        { description: 'Implementation Services', amount: 25000 },
      ],
      taxAmount: 23750, totalAmount: 125000,
    },
  },
  {
    id: 'deal-005', invoiceNumber: 'INV-2024-0156', smeId: 'sme-004',
    smeName: 'Logistics Express', payerName: 'Deutsche Post',
    amount: 34000, currency: 'EUR', dueDate: '2024-03-10',
    submittedAt: '2024-02-02T08:15:00Z', status: 'funded',
    aiScore: 89, invoiceRiskScore: 91, payerRiskScore: 94, smeReliabilityScore: 85,
    suggestedRate: 2.0, finalRate: 2.0, decision: 'APPROVE',
    aiExplanation: 'Payer quality (A-tier): 28/30. Document completeness (100%): 20/20. Payment timeline (33d): 12/15. Invoice amount (€34,000): 14/15. Concentration risk (10%): 9/10. Dispute rate (2%): 10/10.',
    scoreExplanation: [
      'Payer quality (A-tier): 28/30',
      'Document completeness (100%): 20/20',
      'Payment timeline (33d): 12/15',
      'Invoice amount (€34,000): 14/15',
      'Concentration risk (10%): 9/10',
      'Dispute rate (2%): 10/10',
    ],
    assumptionsUsed: [],
    extractedFields: {
      invoiceDate: '2024-01-25',
      lineItems: [{ description: 'Fleet Management Services', amount: 34000 }],
      taxAmount: 6460, totalAmount: 34000,
    },
  },
];

const seedAudit: AuditLog[] = [
  { id: 'log-001', timestamp: '2024-02-06T10:30:00Z', userId: 'admin-1', userName: 'Admin User', userRole: 'ADMIN', action: 'DEAL_APPROVED', resourceType: 'deal', resourceId: 'deal-004', details: 'Approved deal INV-2024-0178 for TechFlow Solutions. Rate: 1.77%', ipAddress: '192.168.1.100' },
  { id: 'log-002', timestamp: '2024-02-06T09:45:00Z', userId: 'sme-001', userName: 'TechFlow Solutions', userRole: 'SME', action: 'INVOICE_SUBMITTED', resourceType: 'deal', resourceId: 'deal-001', details: 'New invoice INV-2024-0142 submitted. Amount: €45,000', ipAddress: '85.214.132.45' },
  { id: 'log-003', timestamp: '2024-02-06T08:20:00Z', userId: 'admin-1', userName: 'Admin User', userRole: 'ADMIN', action: 'SME_SUSPENDED', resourceType: 'sme', resourceId: 'sme-006', details: 'Suspended Suspended Corp due to compliance concerns', ipAddress: '192.168.1.100' },
  { id: 'log-004', timestamp: '2024-02-05T16:30:00Z', userId: 'admin-2', userName: 'Maria Garcia', userRole: 'ADMIN', action: 'DEAL_FUNDED', resourceType: 'deal', resourceId: 'deal-005', details: 'Deal INV-2024-0156 funded. Amount: €34,000. Rate: 2.0%', ipAddress: '192.168.1.101' },
  { id: 'log-005', timestamp: '2024-02-05T14:20:00Z', userId: 'sme-002', userName: 'Green Manufacturing Ltd', userRole: 'SME', action: 'INVOICE_SUBMITTED', resourceType: 'deal', resourceId: 'deal-002', details: 'New invoice INV-2024-0089 submitted. Amount: €78,500', ipAddress: '51.132.45.89' },
  { id: 'log-006', timestamp: '2024-02-05T11:00:00Z', userId: 'sme-004', userName: 'Logistics Express', userRole: 'SME', action: 'PROFILE_UPDATED', resourceType: 'sme', resourceId: 'sme-004', details: 'Updated bank account information', ipAddress: '89.45.123.67' },
  { id: 'log-007', timestamp: '2024-02-04T15:45:00Z', userId: 'admin-1', userName: 'Admin User', userRole: 'ADMIN', action: 'RATE_OVERRIDE', resourceType: 'deal', resourceId: 'deal-004', details: 'Manual rate override from 2.3% to 1.77% for premium client', ipAddress: '192.168.1.100' },
  { id: 'log-008', timestamp: '2024-02-04T11:45:00Z', userId: 'sme-003', userName: 'Digital Marketing Pro', userRole: 'SME', action: 'INVOICE_SUBMITTED', resourceType: 'deal', resourceId: 'deal-003', details: 'New invoice INV-2024-0201 submitted. Amount: €12,000', ipAddress: '145.89.23.12' },
  { id: 'log-009', timestamp: '2024-02-03T09:30:00Z', userId: 'admin-2', userName: 'Maria Garcia', userRole: 'ADMIN', action: 'SME_VERIFIED', resourceType: 'sme', resourceId: 'sme-002', details: 'KYB verification completed for Green Manufacturing Ltd', ipAddress: '192.168.1.101' },
  { id: 'log-010', timestamp: '2024-02-02T08:15:00Z', userId: 'sme-004', userName: 'Logistics Express', userRole: 'SME', action: 'INVOICE_SUBMITTED', resourceType: 'deal', resourceId: 'deal-005', details: 'New invoice INV-2024-0156 submitted. Amount: €34,000', ipAddress: '89.45.123.67' },
];

// ---------------------------------------------------------------------------
// Init / seed
// ---------------------------------------------------------------------------

export function ensureSeeded(): void {
  if (localStorage.getItem(KEYS.seeded) === 'v2') return;
  save(KEYS.deals, seedDeals);
  save(KEYS.smes, seedSMEs);
  save(KEYS.audit, seedAudit);
  save(KEYS.payers, seedPayers);
  localStorage.setItem(KEYS.seeded, 'v2');
}

/** Call once at app boot (e.g. in main.tsx). */
ensureSeeded();

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

export function getDeals(): Deal[] {
  return load<Deal>(KEYS.deals);
}

export function getDealById(id: string): Deal | undefined {
  return getDeals().find(d => d.id === id);
}

export function getDealsByStatus(status: string): Deal[] {
  return getDeals().filter(d => d.status === status);
}

export function getDealsBySme(smeId: string): Deal[] {
  return getDeals().filter(d => d.smeId === smeId);
}

export function updateDeal(id: string, patch: Partial<Deal>): Deal {
  const deals = getDeals();
  const idx = deals.findIndex(d => d.id === id);
  if (idx === -1) throw new Error(`Deal ${id} not found`);
  deals[idx] = { ...deals[idx], ...patch };
  save(KEYS.deals, deals);
  return deals[idx];
}

function addDeal(deal: Deal): Deal {
  const deals = getDeals();
  deals.unshift(deal);
  save(KEYS.deals, deals);
  return deal;
}

// ---------------------------------------------------------------------------
// SMEs
// ---------------------------------------------------------------------------

export function getSMEs(): SME[] {
  return load<SME>(KEYS.smes);
}

export function getSMEById(id: string): SME | undefined {
  return getSMEs().find(s => s.id === id);
}

export function updateSME(id: string, patch: Partial<SME>): SME {
  const smes = getSMEs();
  const idx = smes.findIndex(s => s.id === id);
  if (idx === -1) throw new Error(`SME ${id} not found`);
  smes[idx] = { ...smes[idx], ...patch };
  save(KEYS.smes, smes);
  return smes[idx];
}

// ---------------------------------------------------------------------------
// Payers
// ---------------------------------------------------------------------------

export function getPayers(): Payer[] {
  return load<Payer>(KEYS.payers);
}

export function getPayerByName(name: string): Payer | undefined {
  return getPayers().find(p => p.name.toLowerCase() === name.toLowerCase());
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export function getAuditLogs(): AuditLog[] {
  return load<AuditLog>(KEYS.audit);
}

export function appendAudit(event: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>): AuditLog {
  const logs = getAuditLogs();
  const entry: AuditLog = {
    ...event,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1', // simulated
  };
  logs.unshift(entry);
  save(KEYS.audit, logs);
  return entry;
}

// ---------------------------------------------------------------------------
// Invoice submission workflow (used by SME portal)
// ---------------------------------------------------------------------------

export interface SubmitInvoiceInput {
  invoiceAmount: number;
  daysToDue: number;
  payerName: string;
  supplierName: string; // SME company name
  smeId: string;
  smeName: string;
  fileName?: string;
}

export function submitInvoice(input: SubmitInvoiceInput): Deal {
  // 1. Simulate extraction
  const extracted = simulateExtraction(
    input.payerName,
    input.invoiceAmount,
    input.daysToDue,
    input.supplierName,
    input.fileName,
  );

  // 2. Derive doc completeness from extraction flags
  const docCompleteness = computeDocCompleteness(extracted.flags);

  // 3. Look up payer tier & dispute rate from mock payer DB
  const payer = getPayerByName(input.payerName);
  const payerTier = payer?.tier ?? undefined; // let scoreInvoice infer if unknown
  const disputeRate = payer?.disputeRate ?? undefined;

  // 4. Score with the SINGLE scoring module
  const result: ScoreResult = scoreInvoice({
    invoiceAmount: input.invoiceAmount,
    daysToDue: input.daysToDue,
    payerName: input.payerName,
    payerTier,
    docCompleteness,
    disputeRate,
  });

  // 5. Build Deal record (compatible with existing admin page interface)
  const now = new Date().toISOString();
  const dealId = `deal-${Date.now()}`;
  const deal: Deal = {
    id: dealId,
    invoiceNumber: extracted.invoice_number,
    smeId: input.smeId,
    smeName: input.smeName,
    payerName: input.payerName,
    amount: input.invoiceAmount,
    currency: 'EUR',
    dueDate: extracted.due_date,
    submittedAt: now,
    status: 'pending_review',
    aiScore: result.score,
    invoiceRiskScore: result.components.amountScore + result.components.timeScore + result.components.docScore,
    payerRiskScore: result.components.payerScore + result.components.concScore,
    smeReliabilityScore: result.components.dispScore * 10, // scale to 0-100 range
    suggestedRate: result.pricing.feePercent,
    decision: result.decision,
    aiExplanation: result.explanation.join('. ') + '.',
    scoreExplanation: result.explanation,
    assumptionsUsed: result.assumptionsUsed,
    extractedFields: {
      invoiceDate: extracted.issue_date,
      lineItems: [{ description: `Invoice to ${input.payerName}`, amount: input.invoiceAmount }],
      taxAmount: Math.round(input.invoiceAmount * 0.19),
      totalAmount: input.invoiceAmount,
    },
    simulatedExtraction: extracted,
  };

  addDeal(deal);

  // 6. Audit
  appendAudit({
    userId: input.smeId,
    userName: input.smeName,
    userRole: 'SME',
    action: 'INVOICE_SUBMITTED',
    resourceType: 'deal',
    resourceId: dealId,
    details: `New invoice ${extracted.invoice_number} submitted. Amount: €${input.invoiceAmount.toLocaleString()}. Score: ${result.score}. Decision: ${result.decision}.`,
  });

  return deal;
}

// ---------------------------------------------------------------------------
// Admin actions
// ---------------------------------------------------------------------------

export function approveDeal(
  dealId: string,
  rate: number,
  actorId: string,
  actorName: string,
): Deal {
  const deal = getDealById(dealId);
  if (!deal) throw new Error('Deal not found');

  const updated = updateDeal(dealId, {
    status: 'approved',
    finalRate: rate,
  });

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'DEAL_APPROVED',
    resourceType: 'deal',
    resourceId: dealId,
    details: `Approved deal ${deal.invoiceNumber} for ${deal.smeName}. Rate: ${rate}%`,
  });

  return updated;
}

export function rejectDeal(
  dealId: string,
  reason: string,
  actorId: string,
  actorName: string,
): Deal {
  const deal = getDealById(dealId);
  if (!deal) throw new Error('Deal not found');

  const updated = updateDeal(dealId, { status: 'rejected' });

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'DEAL_REJECTED',
    resourceType: 'deal',
    resourceId: dealId,
    details: `Rejected deal ${deal.invoiceNumber}. Reason: ${reason}`,
  });

  return updated;
}

export function requestDocs(
  dealId: string,
  message: string,
  actorId: string,
  actorName: string,
): Deal {
  const deal = getDealById(dealId);
  if (!deal) throw new Error('Deal not found');

  const updated = updateDeal(dealId, { status: 'docs_requested' });

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'DOCS_REQUESTED',
    resourceType: 'deal',
    resourceId: dealId,
    details: `Requested docs for ${deal.invoiceNumber} from ${deal.smeName}. Message: ${message}`,
  });

  return updated;
}

export function suspendSME(smeId: string, actorId: string, actorName: string): SME {
  const sme = getSMEById(smeId);
  if (!sme) throw new Error('SME not found');

  const updated = updateSME(smeId, { kybStatus: 'suspended' });

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'SME_SUSPENDED',
    resourceType: 'sme',
    resourceId: smeId,
    details: `Suspended ${sme.companyName}`,
  });

  return updated;
}

export function reactivateSME(smeId: string, actorId: string, actorName: string): SME {
  const sme = getSMEById(smeId);
  if (!sme) throw new Error('SME not found');

  const updated = updateSME(smeId, { kybStatus: 'verified' });

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'SME_REACTIVATED',
    resourceType: 'sme',
    resourceId: smeId,
    details: `Reactivated ${sme.companyName}`,
  });

  return updated;
}

export function sendPayerNotice(dealId: string, actorId: string, actorName: string): void {
  const deal = getDealById(dealId);
  if (!deal) throw new Error('Deal not found');

  appendAudit({
    userId: actorId,
    userName: actorName,
    userRole: 'ADMIN',
    action: 'PAYER_NOTICE_SENT',
    resourceType: 'deal',
    resourceId: dealId,
    details: `Payer notice sent to ${deal.payerName} for deal ${deal.invoiceNumber}`,
  });
}

// ---------------------------------------------------------------------------
// Reset (useful for development)
// ---------------------------------------------------------------------------

export function resetAllData(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  ensureSeeded();
}
