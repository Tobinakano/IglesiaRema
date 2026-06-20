// utils/auth.js

const API_BASE_URL = window.location.hostname === 'localhost'
  ? ''
  : 'https://iglesia-rema-backend.onrender.com';

export async function checkAuth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/session`, {
      method: 'GET',
      credentials: 'include', // Mantiene la cookie activa cruzada
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si el servidor responde 401 (No autorizado) o falla, retornamos false limpiamente
    if (!res.ok) return false;

    const data = await res.json();
    
    // Tu backend devuelve el objeto del usuario directamente (id, usuario, nombre, rol)
    // Si el objeto existe, significa que está autenticado
    return !!data; 
  } catch (err) {
    console.error('Error en checkAuth:', err);
    return false; // Si el servidor está caído, no rompemos la app con un '<', simplemente denegamos el acceso
  }
}

export async function logout() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/logout`, {
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