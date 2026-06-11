import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "../components/Alert";
import "../styles/admin.css";

function PersonasRegistradas() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Cargar usuario actual y personas del backend
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

        // Cargar personas
        const res = await fetch("/api/personas", {
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
    cargarDatos();
  }, []);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      window.location.href = '/login';
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const handleEditar = (id) => {
    // Obtener la persona que se intenta editar
    const persona = personas.find(p => p.id === id);
    
    // Verificar si es el usuario autenticado
    if (usuarioActual && usuarioActual.id === id) {
      addAlert({
        type: "warning",
        title: "No permitido",
        message: `No puedes editar tu propio usuario (${persona.nombre} ${persona.apellido}).`
      });
      return;
    }
    
    navigate(`/admin/editar/${id}`);
  };

  const handleEliminar = (id) => {
    // Obtener la persona que se intenta eliminar
    const persona = personas.find(p => p.id === id);
    
    // Verificar si es el usuario autenticado
    if (usuarioActual && usuarioActual.id === id) {
      addAlert({
        type: "danger",
        title: "No permitido",
        message: `No puedes eliminar tu propio usuario (${persona.nombre} ${persona.apellido}).`
      });
      return;
    }
    
    setPersonaToDelete(id);
    setShowDeleteModal(true);
  };

  const addAlert = (alertConfig) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, ...alertConfig }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const confirmDelete = () => {
    setDeleting(true);
    
    fetch(`/api/personas/${personaToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setPersonas(personas.filter(p => p.id !== personaToDelete));
          setShowDeleteModal(false);
          setPersonaToDelete(null);
        } else {
          setError(data.error || "Error al eliminar el usuario");
          setShowDeleteModal(false);
        }
      })
      .catch(err => {
        setError("Error de conexión al eliminar el usuario");
        console.error(err);
        setShowDeleteModal(false);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPersonaToDelete(null);
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case "Administrador": return "badge-admin";
      case "Asistencias": return "badge-asistencias";
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
          <img src="/favicon.png" alt="Logo Iglesia Remanente Cali" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div className="brand-text">
            <div className="name">Remanente</div>
            <div className="city">Cali</div>
          </div>
        </div>

        <div className="sidebar-menu-label">Menú</div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <i className="fas fa-users"></i>
            Personas registradas
          </a>
          <a className="nav-item" href="/admin/flayers">
            <i className="fas fa-image"></i>
            Flayers
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

      {/* TOPBAR */}
      <header className="topbar">
        <nav className="breadcrumb">
          <span>Inicio</span>
          <span className="sep">›</span>
          <span className="current">Personas registradas</span>
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

      {/* MAIN */}
      <main className="main">
        <div className="content">
          <div className="page-header">
            <h1>Personas registradas</h1>
          </div>

          {error && <div style={{ color: 'red', padding: '10px', marginBottom: '20px' }}>{error}</div>}
          {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Cargando personas...</div>}

          {!loading && (
            <div className="table-card">
              <div className="table-card-header">
                <span className="count"><span>{personas.length}</span> personas registradas</span>
                <button className="btn-new" onClick={() => navigate("/admin/registro") }>
                  <i className="fas fa-plus"></i>
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
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn-icon danger" title="Eliminar" onClick={() => handleEliminar(persona.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        <i className="fas fa-user" style={{ fontSize: '48px' }}></i>
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

      <ConfirmModal 
        isOpen={showDeleteModal}
        title="Confirmar eliminación"
        message="¿Estás seguro/a de borrar este usuario?"
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={deleting}
      />

      {/* Contenedor de Alertas */}
      <div className="alerts-container">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
            autoClose={true}
          />
        ))}
      </div>
    </div>
  );
}

export default PersonasRegistradas;
