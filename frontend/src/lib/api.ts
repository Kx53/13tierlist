const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

export interface TierItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

export interface TierListData {
  slug: string;
  title: string;
  tiers: Tier[];
  unrankedItems?: TierItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResponse {
  slug: string;
  editToken: string;
}

export async function createTierList(title: string): Promise<CreateResponse> {
  const res = await fetch(`${API_URL}/api/tier-lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create tier list');
  }
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image');
  }
  const data = await res.json();
  return data.imageUrl;
}

export async function getTierList(slug: string): Promise<TierListData> {
  const res = await fetch(`${API_URL}/api/tier-lists/${slug}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Tier list not found');
  }
  return res.json();
}

export async function updateTierList(
  slug: string,
  editToken: string,
  data: { title?: string; tiers?: Tier[]; unrankedItems?: TierItem[] }
): Promise<TierListData> {
  const res = await fetch(`${API_URL}/api/tier-lists/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-edit-token': editToken,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update tier list');
  }
  return res.json();
}

export async function addItem(
  slug: string,
  editToken: string,
  tierId: string,
  title: string,
  imageUrl: string
): Promise<TierItem> {
  const res = await fetch(`${API_URL}/api/tier-lists/${slug}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-edit-token': editToken,
    },
    body: JSON.stringify({ tierId, title, imageUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to add item');
  }
  return res.json();
}

export async function deleteItem(
  slug: string,
  editToken: string,
  itemId: string
): Promise<void> {
  const res = await fetch(`${API_URL}/api/tier-lists/${slug}/items/${itemId}`, {
    method: 'DELETE',
    headers: { 'x-edit-token': editToken },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete item');
  }
}
