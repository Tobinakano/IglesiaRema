import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/login.css";
import logoNegro from "../assets/images/Logo-negro.png";

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
      console.log("🔐 Intentando login con:", usuario);
      
      // Usar /api en lugar de localhost:4000 para que funcione en Docker
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, contrasena })
      });
      
      console.log("📡 Respuesta del login:", res.status);
      
      if (!res.ok) {
        const data = await res.json();
        console.error("❌ Error de login:", data);
        setError(data.error || "Error de autenticación");
        return;
      }
      
      const loginData = await res.json();
      console.log("✅ Login exitoso:", loginData);
      
      // Obtener rol del usuario
      console.log("🔍 Obteniendo sesión...");
      const sessionRes = await fetch("/api/session", {
        credentials: "include",
      });
      
      console.log("📡 Respuesta de sesión:", sessionRes.status);
      
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        console.log("📋 Datos de sesión:", sessionData);
        
        // Redirigir según el rol
        if (sessionData.rol === "Asistencias") {
          console.log("➡️ Redirigiendo a /asistencia/listado");
          navigate("/asistencia/listado");
        } else {
          console.log("➡️ Redirigiendo a /admin/personas");
          navigate("/admin/personas");
        }
      } else {
        console.warn("⚠️ No se pudo obtener la sesión, redirigiendo a /admin/personas");
        navigate("/admin/personas");
      }
    } catch (err) {
      console.error("💥 Error en login:", err);
      setError("Error de red o servidor: " + err.message);
    }
  };

  return (
    <div className="login-card">
      {/* IZQUIERDA: FORMULARIO */}
      <div className="form-panel">
        {/* Branding */}
        <div className="form-brand">
          <img className="form-brand-logo" src={logoNegro} alt="Logo Iglesia Remanente Cali" />
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