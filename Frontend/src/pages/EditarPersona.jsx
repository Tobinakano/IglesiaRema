import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../utils/auth";
import "../styles/admin.css";

function EditarPersona() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
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

  // Cargar datos de la persona al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener usuario autenticado
        const authRes = await fetch("/api/auth", {
          credentials: "include",
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          setUsuarioActual(authData.user);
        }

        // Obtener datos de la persona a editar
        const res = await fetch(`/api/personas/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar los datos");
        const data = await res.json();
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          usuario: data.usuario,
          rol: data.rol
        });
      } catch (err) {
        setError("Error al cargar los datos de la persona");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      window.location.href = '/login';
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    // Validar que los campos no estén vacíos
    if (!formData.nombre || !formData.apellido || !formData.rol) {
      setError("Todos los campos son requeridos");
      setSaving(false);
      return;
    }

    // Preparar datos a enviar
    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      rol: formData.rol
    };

    // Solo enviar contraseña si no está vacía
    if (formData.contrasena) {
      dataToSend.contrasena = formData.contrasena;
    }

    // Enviar actualización al backend
    fetch(`/api/personas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(dataToSend)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setSuccess("Usuario actualizado exitosamente");
          // Redirigir después de 1.5 segundos
          setTimeout(() => {
            navigate("/admin/personas");
          }, 1500);
        } else {
          setError(data.error || "Error al actualizar el usuario");
        }
      })
      .catch(err => {
        setError("Error de conexión con el servidor");
        console.error(err);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="admin-container">
        <main className="main">
          <div className="content" style={{ textAlign: 'center', padding: '40px' }}>
            Cargando datos...
          </div>
        </main>
      </div>
    );
  }

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
            <i className="fas fa-user-edit" style={{ fontSize: '20px' }}></i>
            Editar Persona
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
            <span className="current">Editar Persona</span>
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
            <h1>Editar Persona</h1>
            <p>Modifica los datos de la persona registrada</p>
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

              {/* Información de usuario (solo lectura) */}
              <div className="form-section">
                <p className="form-section-title">Información de usuario</p>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Usuario</label>
                    <input 
                      type="text" 
                      name="usuario"
                      value={formData.usuario}
                      disabled
                      style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    />
                    <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>No se puede cambiar el usuario</p>
                  </div>

                  <div className="field-group">
                    <label>Contraseña (opcional)</label>
                    <div className="password-wrapper">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="contrasena"
                        placeholder="Dejar vacío para mantener la contraseña actual"
                        className="password-input"
                        value={formData.contrasena}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="toggle-password-btn"
                      >
                        {passwordVisible ? (
                          <i className="fas fa-eye-slash" style={{ fontSize: '18px' }}></i>
                        ) : (
                          <i className="fas fa-eye" style={{ fontSize: '18px' }}></i>
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
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit" disabled={saving}>
                    <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                    {saving ? "Guardando..." : "Guardar Cambios"}
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

export default EditarPersona;
