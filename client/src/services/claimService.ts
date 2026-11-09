import { type ClaimItem } from '../components/claims/ClaimCard';

const API_BASE = 'http://localhost:5000/api/claims';

export const getMyClaims = async (token?: string): Promise<ClaimItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/my-claims`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch claims');
    const data = await res.json();
    return data.claims || data;
  } catch (error) {
    console.warn('Using local fallback for claims:', error);
    return [];
  }
};

export const submitClaim = async (claimData: Partial<ClaimItem>, token?: string): Promise<any> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(claimData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit claim');
  }
  return res.json();
};

