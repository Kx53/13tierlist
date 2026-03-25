const TOKEN_PREFIX = 'editToken:';
const DRAFT_PREFIX = 'draft:';

export function saveToken(slug: string, token: string): void {
  localStorage.setItem(`${TOKEN_PREFIX}${slug}`, token);
}

export function getToken(slug: string): string | null {
  return localStorage.getItem(`${TOKEN_PREFIX}${slug}`);
}

export function hasToken(slug: string): boolean {
  return !!localStorage.getItem(`${TOKEN_PREFIX}${slug}`);
}

export function removeToken(slug: string): void {
  localStorage.removeItem(`${TOKEN_PREFIX}${slug}`);
}

export function saveDraft(slug: string, data: unknown): void {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${slug}`, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function getDraft(slug: string): unknown | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeDraft(slug: string): void {
  localStorage.removeItem(`${DRAFT_PREFIX}${slug}`);
}
