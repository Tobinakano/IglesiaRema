import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

function PersonasRegistradas() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cargar personas del backend
    const cargarPersonas = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/personas", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar personas");
        const data = await res.json();
        setPersonas(data);
      } catch (err) {
        setError("Error al cargar las personas registradas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarPersonas();
  }, []);

  const handleEditar = (id) => {
    alert(`Editar persona con ID: ${id}`);
  };

  const handleEliminar = (id) => {
    setPersonas(personas.filter(p => p.id !== id));
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case "Administrador": return "badge-admin";
      case "Registrador": return "badge-registrador";
      case "Lector": return "badge-lector";
      default: return "";
    }
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div className="brand-text">
            <div className="name">Remanente</div>
            <div className="city">Cali</div>
          </div>
        </div>

        <div className="sidebar-menu-label">Menú</div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            Personas registradas
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

      {/* TOPBAR */}
      <header className="topbar">
        <nav className="breadcrumb">
          <span>Inicio</span>
          <span className="sep">›</span>
          <span className="current">Personas registradas</span>
        </nav>
        <div className="topbar-right">A</div>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="content">
          <div className="page-header">
            <h1>Personas registradas</h1>
            <p>Listado de todas las personas registradas en el sistema</p>
          </div>

          {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px' }}>{error}</div>}
          {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Cargando personas...</div>}

          {!loading && (
            <div className="table-card">
              <div className="table-card-header">
                <span className="count"><span>{personas.length}</span> personas registradas</span>
                <button className="btn-new" onClick={() => navigate("/admin/registro") }>
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nuevo Registro
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {personas.length > 0 ? (
                    personas.map((persona) => (
                      <tr key={persona.id}>
                        <td>
                          <span className="full-name">{persona.nombre}</span>
                        </td>
                        <td>{persona.apellido}</td>
                        <td><span className={`badge ${getRolBadgeClass(persona.rol)}`}>{persona.rol}</span></td>
                        <td>
                          <div className="actions">
                            <button className="btn-icon" title="Editar" onClick={() => handleEditar(persona.id)}>
                              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="btn-icon danger" title="Eliminar" onClick={() => handleEliminar(persona.id)}>
                              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        <p>No hay personas registradas</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default PersonasRegistradas;
