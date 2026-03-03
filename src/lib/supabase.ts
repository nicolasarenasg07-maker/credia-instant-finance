/**
 * Supabase client for lead capture.
 *
 * Setup instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run the SQL below in your Supabase SQL editor to create the leads table:
 *
 *    create table leads (
 *      id uuid default gen_random_uuid() primary key,
 *      created_at timestamptz default now(),
 *      name text not null,
 *      email text not null,
 *      company text not null,
 *      phone text,
 *      seller_company text not null,
 *      data_consent boolean not null default false,
 *      data_consent_at timestamptz,
 *      invoice_amount numeric not null,
 *      days_to_due integer not null,
 *      payer_name text not null,
 *      ai_score integer,
 *      ai_decision text,
 *      estimated_fee numeric,
 *      notes text
 *    );
 *
 *    -- Allow anonymous inserts (for MVP lead capture)
 *    alter table leads enable row level security;
 *    create policy "Anyone can insert leads"
 *      on leads for insert
 *      to anon
 *      with check (true);
 *
 * 3. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
 */

export interface Lead {
  name: string;
  email: string;
  company: string;
  phone?: string;
  seller_company: string;
  data_consent: boolean;
  data_consent_at?: string;
  invoice_amount: number;
  days_to_due: number;
  payer_name: string;
  ai_score?: number;
  ai_decision?: string;
  estimated_fee?: number;
  notes?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Submit a lead to Supabase. Falls back to localStorage when Supabase is not
 * configured so the MVP landing works even without a backend.
 */
export async function submitLead(lead: Lead): Promise<{ ok: boolean; error?: string }> {
  // If Supabase is configured, use it
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(lead),
      });

      if (!res.ok) {
        const text = await res.text();
        return { ok: false, error: `Supabase error: ${text}` };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: `Network error: ${(err as Error).message}` };
    }
  }

  // Fallback: persist to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('credia_leads') || '[]') as Lead[];
    existing.push({ ...lead });
    localStorage.setItem('credia_leads', JSON.stringify(existing));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Failed to save locally' };
  }
}
