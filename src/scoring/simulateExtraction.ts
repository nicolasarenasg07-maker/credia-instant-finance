/**
 * Simulated PDF extraction — no real parsing.
 * Returns deterministic structured data based on user inputs + file name.
 * TODO: replace mock with real backend (Supabase/Firebase) + real OCR
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtractionFlags {
  po_present: boolean;
  delivery_note_present: boolean;
  iban_present: boolean;
  signature_present: boolean;
}

export interface ExtractedFields {
  invoice_number: string;
  invoice_amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  payer_name: string;
  supplier_name: string;
  flags: ExtractionFlags;
}

// ---------------------------------------------------------------------------
// Deterministic seeded PRNG (mulberry32)
// ---------------------------------------------------------------------------

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Simulate extraction
// ---------------------------------------------------------------------------

export function simulateExtraction(
  payerName: string,
  invoiceAmount: number,
  daysToDue: number,
  supplierName: string,
  fileName?: string,
): ExtractedFields {
  const seed = hashString(
    payerName.toLowerCase() + (fileName || 'invoice') + String(invoiceAmount),
  );
  const rng = mulberry32(seed);

  const now = new Date();
  const issueDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dueDate = new Date(now.getTime() + daysToDue * 24 * 60 * 60 * 1000);

  // Deterministic invoice number from seed
  const invNum = Math.floor(rng() * 9000 + 1000);
  const invoiceNumber = `INV-${now.getFullYear()}-${String(invNum).padStart(4, '0')}`;

  return {
    invoice_number: invoiceNumber,
    invoice_amount: invoiceAmount,
    currency: 'EUR',
    issue_date: issueDate.toISOString().split('T')[0],
    due_date: dueDate.toISOString().split('T')[0],
    payer_name: payerName,
    supplier_name: supplierName,
    flags: {
      po_present: rng() > 0.3,
      delivery_note_present: rng() > 0.4,
      iban_present: rng() > 0.2,
      signature_present: rng() > 0.25,
    },
  };
}

// ---------------------------------------------------------------------------
// Derive docCompleteness from extraction flags
// ---------------------------------------------------------------------------

export function computeDocCompleteness(flags: ExtractionFlags): number {
  const checks = [
    flags.po_present,
    flags.delivery_note_present,
    flags.iban_present,
    flags.signature_present,
  ];
  const present = checks.filter(Boolean).length;
  // Base 40% for having a parseable invoice + up to 60% for flags
  return Math.round(40 + (present / checks.length) * 60);
}
