// utils/auth.js

export async function checkAuth() {
  try {
    // CAMBIADO: Ahora apunta directamente al servidor real de Render
    const res = await fetch('https://iglesia-rema-backend.onrender.com/api/session', {
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
    // CAMBIADO: Apunta al endpoint de logout en Render
    const res = await fetch('https://iglesia-rema-backend.onrender.com/api/logout', {
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