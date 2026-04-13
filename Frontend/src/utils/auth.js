// utils/auth.js
export async function checkAuth() {
  const res = await fetch('/api/auth', {
    credentials: 'include',
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.ok;
}

export async function logout() {
  try {
    const res = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error en logout:', err);
    return false;
  }
}
