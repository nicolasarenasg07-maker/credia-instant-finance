/**
 * Type definitions for the credIA domain model.
 * Data is now served from src/mock/mockDb.ts (localStorage-backed).
 * TODO: replace mock with real backend (Supabase/Firebase)
 */

import type { ExtractedFields } from '@/scoring/simulateExtraction';
import type { Decision } from '@/scoring/scoreInvoice';

export interface Deal {
  id: string;
  invoiceNumber: string;
  smeId: string;
  smeName: string;
  payerName: string;
  amount: number;
  currency: string;
  dueDate: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'docs_requested' | 'funded' | 'paid';
  aiScore: number;
  invoiceRiskScore: number;
  payerRiskScore: number;
  smeReliabilityScore: number;
  suggestedRate: number;
  finalRate?: number;
  /** Scoring decision from scoreInvoice() */
  decision?: Decision;
  aiExplanation: string;
  /** Structured explanation lines from scoring module */
  scoreExplanation?: string[];
  /** Assumptions applied when inputs were missing */
  assumptionsUsed?: string[];
  documentUrl?: string;
  extractedFields: {
    invoiceDate: string;
    lineItems: { description: string; amount: number }[];
    taxAmount: number;
    totalAmount: number;
  };
  /** Raw simulated extraction result (if extracted via simulateExtraction) */
  simulatedExtraction?: ExtractedFields;
}

export interface SME {
  id: string;
  companyName: string;
  email: string;
  registrationNumber: string;
  country: string;
  profileCompleteness: number;
  kybStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
  totalFunded: number;
  activeDeals: number;
  joinedAt: string;
  lastActivity: string;
  riskTier: 'low' | 'medium' | 'high';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'SME' | 'ADMIN';
  action: string;
  resourceType: 'deal' | 'sme' | 'user' | 'system';
  resourceId: string;
  details: string;
  ipAddress: string;
}
