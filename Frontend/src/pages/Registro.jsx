import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import "../styles/admin.css";

function Registro() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    contrasena: "",
    rol: "Administrador"
  });

  // Obtener usuario autenticado
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await fetch("/api/auth", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsuarioActual(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    obtenerUsuario();
  }, []);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      window.location.href = '/login';
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validar que los campos no estén vacíos
    if (!formData.nombre || !formData.apellido || !formData.usuario || !formData.contrasena) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    // Enviar al backend
    fetch("/api/personas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setSuccess("Usuario registrado exitosamente");
          // Limpiar formulario
          setFormData({
            nombre: "",
            apellido: "",
            usuario: "",
            contrasena: "",
            rol: "Administrador"
          });
          // Redirigir después de 1.5 segundos
          setTimeout(() => {
            navigate("/admin/personas");
          }, 1500);
        } else {
          setError(data.error || "Error al registrar el usuario");
        }
      })
      .catch(err => {
        setError("Error de conexión con el servidor");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/favicon.png" alt="Logo Iglesia Remanente Cali" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div className="brand-text">
            <div className="name">Remanente</div>
            <div className="city">Cali</div>
          </div>
        </div>

        <div className="sidebar-menu-label">Menú</div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Registrar Persona
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar-sm">{usuarioActual?.nombre?.[0].toUpperCase() || 'A'}</div>
          <div className="footer-info">
            <div className="label">{usuarioActual?.nombre || 'Nombre'}</div>
            <div className="sub">{usuarioActual?.rol || 'Rol'} · Remanente</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="topbar">
          <nav className="breadcrumb">
            <span>Inicio</span>
            <span className="sep">›</span>
            <span className="current">Registrar Persona</span>
          </nav>
          <div className="topbar-right" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowUserMenu(!showUserMenu)}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '16px' }}>
              {usuarioActual?.nombre ? usuarioActual.nombre[0].toUpperCase() : 'A'}
            </div>
            
            {showUserMenu && (
              <div style={{ position: 'absolute', top: '50px', right: '0', background: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', minWidth: '200px', zIndex: 1000 }}>
                <div style={{ padding: '12px 0' }}>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#f4f5f7'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
                    <i className="fas fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                    <span>Mi Perfil</span>
                  </a>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#f4f5f7'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
                    <i className="fas fa-gear" style={{ width: '20px', textAlign: 'center' }}></i>
                    <span>Configuración</span>
                  </a>
                  <div style={{ height: '1px', background: '#e4e6ea', margin: '8px 0' }}></div>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#fee2e2'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
                    <i className="fas fa-arrow-right-from-bracket" style={{ width: '20px', textAlign: 'center' }}></i>
                    <span>Cerrar Sesión</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          <div className="page-header">
            <h1>Registrar Persona</h1>
            <p>Completa los datos para registrar a una nueva persona</p>
          </div>

          {error && <div style={{ color: '#e74c3c', padding: '12px', marginBottom: '20px', backgroundColor: '#fadbd8', borderRadius: '4px', fontSize: '14px', border: '1px solid #e74c3c' }}>{error}</div>}
          {success && <div style={{ color: '#27ae60', padding: '12px', marginBottom: '20px', backgroundColor: '#d5f4e6', borderRadius: '4px', fontSize: '14px', border: '1px solid #27ae60' }}>{success}</div>}

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              {/* Datos personales */}
              <div className="form-section">
                <p className="form-section-title">Datos personales</p>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Nombre</label>
                    <input 
                      type="text" 
                      name="nombre"
                      placeholder="Ej: María"
                      value={formData.nombre}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="field-group">
                    <label>Apellido</label>
                    <input 
                      type="text" 
                      name="apellido"
                      placeholder="Ej: González"
                      value={formData.apellido}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div className="form-section">
                <p className="form-section-title">Credenciales de acceso</p>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Usuario</label>
                    <input 
                      type="text" 
                      name="usuario"
                      placeholder="Ej: maria.gonzalez"
                      value={formData.usuario}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="field-group">
                    <label>Contraseña</label>
                    <div className="password-wrapper">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="contrasena"
                        placeholder="••••••••"
                        className="password-input"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="toggle-password-btn"
                      >
                        {passwordVisible ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Rol</label>
                    <select 
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Asistencias">Asistencias</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="form-footer">
                <div className="required-note">
                  Los campos marcados con <span>*</span> son obligatorios
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => navigate("/admin/personas")}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {loading ? "Registrando..." : "Registrar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
