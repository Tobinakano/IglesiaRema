import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Añadir clase especial al body solo en Login
  React.useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, contrasena })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error de autenticación");
        return;
      }
      // Login exitoso
      navigate("/registro");
    } catch (err) {
      setError("Error de red o servidor");
    }
  };

  return (
    <div className="login-card">
      {/* IZQUIERDA: FORMULARIO */}
      <div className="form-panel">
        {/* Branding */}
        <div className="form-brand">
          <img className="form-brand-logo" src="/src/assets/images/logo-negro.png" alt="Logo Iglesia Remanente Cali" />
          <div className="form-brand-name">
            Iglesia Remanente
            <small>Cali</small>
          </div>
        </div>
        {/* Heading */}
        <div className="form-heading">
          <h1 className="form-title">Login</h1>
          <p className="form-subtitle">Ingresa tus credenciales para continuar.</p>
        </div>
        {/* Form */}
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-fields">
            {/* Usuario */}
            <div className="field-wrap">
              <label className="field-label">Usuario</label>
              <div className="field-input-wrap">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  required
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label className="field-label">Contraseña</label>
              <div className="field-input-wrap">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Error */}
          {error && <div style={{ color: '#b94a48', margin: '12px 0', fontSize: '1rem' }}>{error}</div>}

          {/* Botón */}
          <button className="btn-login" type="submit">
            Ingresar
            <svg viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login