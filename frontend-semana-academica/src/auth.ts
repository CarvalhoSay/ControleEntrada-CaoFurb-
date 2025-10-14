export type AuthUser = { username: string; ts: number };

const KEY = "mock_auth";

export function isAuth(): boolean {
  return !!(localStorage.getItem(KEY) || sessionStorage.getItem(KEY));
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function login(username: string, remember = false) {
  const target = remember ? localStorage : sessionStorage;
  target.setItem(KEY, JSON.stringify({ username, ts: Date.now() }));
}

export function logout() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

export function clearAllAuth() {
  logout();
}
