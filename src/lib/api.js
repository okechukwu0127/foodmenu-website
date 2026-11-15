// Beta sign-ups go to the foodMenuAPI gateway: POST {VITE_API_BASE_URL}/api/v1/beta-testers
// (identity-service stores them in the BetaTester table).
const base = () => (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export async function submitBeta({ email, platform, company }) {
  if (!base()) throw new Error('Beta sign-up is not configured yet (VITE_API_BASE_URL is missing).');
  let res;
  try {
    res = await fetch(`${base()}/api/v1/beta-testers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, platform, consent: true, source: 'liberq-website', ...(company ? { company } : {}) }),
    });
  } catch {
    throw new Error('We couldn’t reach the server. Please check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (res.status === 429) throw new Error('Too many attempts — please wait a minute and try again.');
  if (!res.ok) throw new Error(typeof body?.message === 'string' && res.status < 500 ? body.message : 'Something went wrong — please try again.');
  return body?.data?.message || '';
}

// "Book a free demo" / "Become a partner" → POST {VITE_API_BASE_URL}/api/v1/demo-requests
// (saved in the WebsiteLead table and emailed to LEADS_NOTIFY_EMAIL on the backend).
export async function submitLead({ kind, name, business, email, phone, company }) {
  if (!base()) throw new Error('The form is not configured yet (VITE_API_BASE_URL is missing).');
  let res;
  try {
    res = await fetch(`${base()}/api/v1/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, name, business, email, phone, consent: true, source: 'liberq-website', ...(company ? { company } : {}) }),
    });
  } catch {
    throw new Error('We couldn’t reach the server. Please check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (res.status === 429) throw new Error('Too many attempts — please wait a minute and try again.');
  if (!res.ok) throw new Error(typeof body?.message === 'string' && res.status < 500 ? body.message : 'Something went wrong — please try again.');
  return body?.data?.message || '';
}
