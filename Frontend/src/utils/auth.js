// utils/auth.js
export async function checkAuth() {
  const res = await fetch('/api/auth', {
    credentials: 'include',
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.ok;
}
