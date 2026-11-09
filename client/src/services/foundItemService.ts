import { type FoundItemData } from '../components/found-items/FoundItemCard';

const API_BASE = 'http://localhost:5000/api/found-items';

export const getFoundItems = async (): Promise<FoundItemData[]> => {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch found items');
    const data = await res.json();
    return data.items || data;
  } catch (error) {
    console.warn('Using local fallback for found items:', error);
    return [];
  }
};

export const createFoundItem = async (item: Partial<FoundItemData>, token?: string): Promise<FoundItemData> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit found item report');
  }
  return res.json();
};

