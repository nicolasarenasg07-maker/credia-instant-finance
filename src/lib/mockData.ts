// Mock data for admin dashboard - structured for future API integration

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
  aiExplanation: string;
  documentUrl?: string;
  extractedFields: {
    invoiceDate: string;
    lineItems: { description: string; amount: number }[];
    taxAmount: number;
    totalAmount: number;
  };
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

// Mock deals data
export const mockDeals: Deal[] = [
  {
    id: 'deal-001',
    invoiceNumber: 'INV-2024-0142',
    smeId: 'sme-001',
    smeName: 'TechFlow Solutions',
    payerName: 'Siemens AG',
    amount: 45000,
    currency: 'EUR',
    dueDate: '2024-03-15',
    submittedAt: '2024-02-06T09:30:00Z',
    status: 'pending_review',
    aiScore: 87,
    invoiceRiskScore: 92,
    payerRiskScore: 95,
    smeReliabilityScore: 78,
    suggestedRate: 2.8,
    aiExplanation: 'High-quality invoice from established payer. Siemens has excellent payment history. SME has 3 successful prior transactions. Minor concern: SME profile recently updated.',
    extractedFields: {
      invoiceDate: '2024-02-01',
      lineItems: [
        { description: 'Software Development Services - Q1', amount: 38000 },
        { description: 'Cloud Infrastructure Setup', amount: 7000 },
      ],
      taxAmount: 8550,
      totalAmount: 45000,
    },
  },
  {
    id: 'deal-002',
    invoiceNumber: 'INV-2024-0089',
    smeId: 'sme-002',
    smeName: 'Green Manufacturing Ltd',
    payerName: 'BASF SE',
    amount: 78500,
    currency: 'EUR',
    dueDate: '2024-03-30',
    submittedAt: '2024-02-05T14:20:00Z',
    status: 'pending_review',
    aiScore: 72,
    invoiceRiskScore: 75,
    payerRiskScore: 88,
    smeReliabilityScore: 65,
    suggestedRate: 4.2,
    aiExplanation: 'Medium-risk deal. BASF is a solid payer but the SME is relatively new with limited history. Invoice amount is above average for this SME. Recommend additional documentation.',
    extractedFields: {
      invoiceDate: '2024-01-28',
      lineItems: [
        { description: 'Industrial Equipment Parts', amount: 65000 },
        { description: 'Installation Services', amount: 13500 },
      ],
      taxAmount: 14915,
      totalAmount: 78500,
    },
  },
  {
    id: 'deal-003',
    invoiceNumber: 'INV-2024-0201',
    smeId: 'sme-003',
    smeName: 'Digital Marketing Pro',
    payerName: 'StartupXYZ',
    amount: 12000,
    currency: 'EUR',
    dueDate: '2024-02-28',
    submittedAt: '2024-02-04T11:45:00Z',
    status: 'pending_review',
    aiScore: 45,
    invoiceRiskScore: 40,
    payerRiskScore: 35,
    smeReliabilityScore: 82,
    suggestedRate: 8.5,
    aiExplanation: 'High-risk deal. Payer is an early-stage startup with no payment history in our system. Invoice verification shows potential inconsistencies in line item pricing. Manual review strongly recommended.',
    extractedFields: {
      invoiceDate: '2024-02-01',
      lineItems: [
        { description: 'Marketing Campaign Q1', amount: 8000 },
        { description: 'Social Media Management', amount: 4000 },
      ],
      taxAmount: 2280,
      totalAmount: 12000,
    },
  },
  {
    id: 'deal-004',
    invoiceNumber: 'INV-2024-0178',
    smeId: 'sme-001',
    smeName: 'TechFlow Solutions',
    payerName: 'BMW Group',
    amount: 125000,
    currency: 'EUR',
    dueDate: '2024-04-15',
    submittedAt: '2024-02-03T16:00:00Z',
    status: 'approved',
    aiScore: 94,
    invoiceRiskScore: 96,
    payerRiskScore: 98,
    smeReliabilityScore: 78,
    suggestedRate: 2.1,
    finalRate: 2.1,
    aiExplanation: 'Excellent deal. BMW is a top-tier payer with near-perfect payment history. Invoice fully verified. SME has strong track record. Auto-approval recommended.',
    extractedFields: {
      invoiceDate: '2024-01-30',
      lineItems: [
        { description: 'Enterprise Software License', amount: 100000 },
        { description: 'Implementation Services', amount: 25000 },
      ],
      taxAmount: 23750,
      totalAmount: 125000,
    },
  },
  {
    id: 'deal-005',
    invoiceNumber: 'INV-2024-0156',
    smeId: 'sme-004',
    smeName: 'Logistics Express',
    payerName: 'Deutsche Post',
    amount: 34000,
    currency: 'EUR',
    dueDate: '2024-03-10',
    submittedAt: '2024-02-02T08:15:00Z',
    status: 'funded',
    aiScore: 89,
    invoiceRiskScore: 91,
    payerRiskScore: 94,
    smeReliabilityScore: 85,
    suggestedRate: 2.5,
    finalRate: 2.5,
    aiExplanation: 'Strong deal. Deutsche Post excellent payer. SME has 8 successful transactions. Invoice verified and funded.',
    extractedFields: {
      invoiceDate: '2024-01-25',
      lineItems: [
        { description: 'Fleet Management Services', amount: 34000 },
      ],
      taxAmount: 6460,
      totalAmount: 34000,
    },
  },
];

// Mock SMEs data
export const mockSMEs: SME[] = [
  {
    id: 'sme-001',
    companyName: 'TechFlow Solutions',
    email: 'finance@techflow.de',
    registrationNumber: 'HRB 123456',
    country: 'Germany',
    profileCompleteness: 100,
    kybStatus: 'verified',
    totalFunded: 450000,
    activeDeals: 2,
    joinedAt: '2023-06-15',
    lastActivity: '2024-02-06T09:30:00Z',
    riskTier: 'low',
  },
  {
    id: 'sme-002',
    companyName: 'Green Manufacturing Ltd',
    email: 'accounts@greenmanuf.co.uk',
    registrationNumber: 'UK-89012345',
    country: 'United Kingdom',
    profileCompleteness: 85,
    kybStatus: 'verified',
    totalFunded: 78500,
    activeDeals: 1,
    joinedAt: '2023-11-20',
    lastActivity: '2024-02-05T14:20:00Z',
    riskTier: 'medium',
  },
  {
    id: 'sme-003',
    companyName: 'Digital Marketing Pro',
    email: 'info@digitalmpro.com',
    registrationNumber: 'NL-56789012',
    country: 'Netherlands',
    profileCompleteness: 70,
    kybStatus: 'pending',
    totalFunded: 0,
    activeDeals: 1,
    joinedAt: '2024-01-10',
    lastActivity: '2024-02-04T11:45:00Z',
    riskTier: 'high',
  },
  {
    id: 'sme-004',
    companyName: 'Logistics Express',
    email: 'billing@logisticsexp.de',
    registrationNumber: 'HRB 789012',
    country: 'Germany',
    profileCompleteness: 100,
    kybStatus: 'verified',
    totalFunded: 890000,
    activeDeals: 3,
    joinedAt: '2022-09-01',
    lastActivity: '2024-02-06T11:00:00Z',
    riskTier: 'low',
  },
  {
    id: 'sme-005',
    companyName: 'Creative Agency Hub',
    email: 'finance@creativeagency.fr',
    registrationNumber: 'FR-34567890',
    country: 'France',
    profileCompleteness: 45,
    kybStatus: 'pending',
    totalFunded: 0,
    activeDeals: 0,
    joinedAt: '2024-02-01',
    lastActivity: '2024-02-03T09:00:00Z',
    riskTier: 'medium',
  },
  {
    id: 'sme-006',
    companyName: 'Suspended Corp',
    email: 'admin@suspended.com',
    registrationNumber: 'ES-12345678',
    country: 'Spain',
    profileCompleteness: 100,
    kybStatus: 'suspended',
    totalFunded: 125000,
    activeDeals: 0,
    joinedAt: '2023-03-15',
    lastActivity: '2024-01-15T10:00:00Z',
    riskTier: 'high',
  },
];

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2024-02-06T10:30:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'ADMIN',
    action: 'DEAL_APPROVED',
    resourceType: 'deal',
    resourceId: 'deal-004',
    details: 'Approved deal INV-2024-0178 for TechFlow Solutions. Rate: 2.1%',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-002',
    timestamp: '2024-02-06T09:45:00Z',
    userId: 'sme-001',
    userName: 'TechFlow Solutions',
    userRole: 'SME',
    action: 'INVOICE_SUBMITTED',
    resourceType: 'deal',
    resourceId: 'deal-001',
    details: 'New invoice INV-2024-0142 submitted. Amount: €45,000',
    ipAddress: '85.214.132.45',
  },
  {
    id: 'log-003',
    timestamp: '2024-02-06T08:20:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'ADMIN',
    action: 'SME_SUSPENDED',
    resourceType: 'sme',
    resourceId: 'sme-006',
    details: 'Suspended Suspended Corp due to compliance concerns',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-004',
    timestamp: '2024-02-05T16:30:00Z',
    userId: 'admin-2',
    userName: 'Maria Garcia',
    userRole: 'ADMIN',
    action: 'DEAL_FUNDED',
    resourceType: 'deal',
    resourceId: 'deal-005',
    details: 'Deal INV-2024-0156 funded. Amount: €34,000. Rate: 2.5%',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'log-005',
    timestamp: '2024-02-05T14:20:00Z',
    userId: 'sme-002',
    userName: 'Green Manufacturing Ltd',
    userRole: 'SME',
    action: 'INVOICE_SUBMITTED',
    resourceType: 'deal',
    resourceId: 'deal-002',
    details: 'New invoice INV-2024-0089 submitted. Amount: €78,500',
    ipAddress: '51.132.45.89',
  },
  {
    id: 'log-006',
    timestamp: '2024-02-05T11:00:00Z',
    userId: 'sme-004',
    userName: 'Logistics Express',
    userRole: 'SME',
    action: 'PROFILE_UPDATED',
    resourceType: 'sme',
    resourceId: 'sme-004',
    details: 'Updated bank account information',
    ipAddress: '89.45.123.67',
  },
  {
    id: 'log-007',
    timestamp: '2024-02-04T15:45:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'ADMIN',
    action: 'RATE_OVERRIDE',
    resourceType: 'deal',
    resourceId: 'deal-004',
    details: 'Manual rate override from 2.3% to 2.1% for premium client',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-008',
    timestamp: '2024-02-04T11:45:00Z',
    userId: 'sme-003',
    userName: 'Digital Marketing Pro',
    userRole: 'SME',
    action: 'INVOICE_SUBMITTED',
    resourceType: 'deal',
    resourceId: 'deal-003',
    details: 'New invoice INV-2024-0201 submitted. Amount: €12,000',
    ipAddress: '145.89.23.12',
  },
  {
    id: 'log-009',
    timestamp: '2024-02-03T09:30:00Z',
    userId: 'admin-2',
    userName: 'Maria Garcia',
    userRole: 'ADMIN',
    action: 'SME_VERIFIED',
    resourceType: 'sme',
    resourceId: 'sme-002',
    details: 'KYB verification completed for Green Manufacturing Ltd',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'log-010',
    timestamp: '2024-02-02T08:15:00Z',
    userId: 'sme-004',
    userName: 'Logistics Express',
    userRole: 'SME',
    action: 'INVOICE_SUBMITTED',
    resourceType: 'deal',
    resourceId: 'deal-005',
    details: 'New invoice INV-2024-0156 submitted. Amount: €34,000',
    ipAddress: '89.45.123.67',
  },
];

// API simulation functions - ready to be replaced with real API calls
export const adminApi = {
  // Deals
  getDeals: async (filters?: { status?: string; smeId?: string }): Promise<Deal[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let deals = [...mockDeals];
    if (filters?.status) {
      deals = deals.filter(d => d.status === filters.status);
    }
    if (filters?.smeId) {
      deals = deals.filter(d => d.smeId === filters.smeId);
    }
    return deals;
  },
  
  getDealById: async (id: string): Promise<Deal | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDeals.find(d => d.id === id);
  },
  
  updateDealStatus: async (id: string, status: Deal['status'], rate?: number): Promise<Deal> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const deal = mockDeals.find(d => d.id === id);
    if (!deal) throw new Error('Deal not found');
    deal.status = status;
    if (rate !== undefined) deal.finalRate = rate;
    return deal;
  },
  
  // SMEs
  getSMEs: async (): Promise<SME[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockSMEs];
  },
  
  updateSMEStatus: async (id: string, status: SME['kybStatus']): Promise<SME> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const sme = mockSMEs.find(s => s.id === id);
    if (!sme) throw new Error('SME not found');
    sme.kybStatus = status;
    return sme;
  },
  
  // Audit
  getAuditLogs: async (): Promise<AuditLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockAuditLogs];
  },
};
