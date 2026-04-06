import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

function Registro() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    contrasena: "",
    rol: "Administrador"
  });

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí iría la lógica para enviar al backend
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
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
          <div className="avatar-sm">A</div>
          <div className="footer-info">
            <div className="label">Administrador</div>
            <div className="sub">Administrador · Remanente</div>
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
          <div className="topbar-right">A</div>
        </header>

        <div className="content">
          <div className="page-header">
            <h1>Registrar Persona</h1>
            <p>Completa los datos para registrar a una nueva persona</p>
          </div>

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
                      <option value="Pastor">Pastor</option>
                      <option value="Líder de ministerio">Líder de ministerio</option>
                      <option value="Servidor">Servidor</option>
                      <option value="Visitante">Visitante</option>
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
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Registrar
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
