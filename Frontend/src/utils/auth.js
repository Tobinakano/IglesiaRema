// utils/auth.js
export async function checkAuth() {
  const res = await fetch('http://localhost:4000/api/auth', {
    credentials: 'include',
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.ok;
}
