import React, { useState } from "react";
import "../styles/registro.css";

function Registro() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío del formulario aquí
    console.log("Formulario enviado");
  };

  return (
    <div className="registro-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">Remanente</span>
            <span className="brand-sub">Cali</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-label">Menú</p>
          <a href="#" className="menu-item active">
            <svg
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Registrar Persona
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-avatar">A</div>
          <div className="footer-info">
            <p className="footer-name">Administrador</p>
            <p className="footer-role">Admin · Remanente</p>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            Inicio
            <svg viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Registrar Persona</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="content">
          <div className="page-header">
            <h1 className="page-title">Registrar Persona</h1>
            <p className="page-subtitle">
              Completa los datos para registrar a una nueva persona
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              {/* Datos personales */}
              <div className="form-section">
                <p className="form-section-title">Datos personales</p>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Nombre</label>
                    <input type="text" placeholder="Ej: María" />
                  </div>
                  <div className="field-group">
                    <label>Apellido</label>
                    <input type="text" placeholder="Ej: González" />
                  </div>
                </div>
              </div>

              {/* Credenciales */}
              <div className="form-section">
                <p className="form-section-title">Credenciales de acceso</p>
                <div className="form-grid">
                  <div className="field-group">
                    <label>Usuario</label>
                    <input type="text" placeholder="Ej: maria.gonzalez" />
                  </div>
                  <div className="field-group">
                    <label>Contraseña</label>
                    <div className="password-wrapper">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        id="passwordInput"
                        placeholder="••••••••"
                        className="password-input"
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="toggle-password-btn"
                      >
                        {passwordVisible ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="field-group span2">
                    <label>Rol</label>
                    <select>
                      <option value="" disabled defaultValue>
                        Seleccionar rol...
                      </option>
                      <option>Administrador</option>
                      <option>Pastor</option>
                      <option>Líder de ministerio</option>
                      <option>Servidor</option>
                      <option>Visitante</option>
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
                  <button type="button" className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <svg
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Registrar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
