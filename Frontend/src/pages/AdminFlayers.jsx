import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBot from "../components/ChatBot";
import "../styles/flayers.css";
import "../styles/admin.css";

function AdminFlayers() {
  const navigate = useNavigate();
  const [flayers, setFlayers] = useState([
    { id: 1, titulo: "Evento Domingo", imagen: "/favicon.png" },
    { id: 2, titulo: "Conferencia Especial", imagen: "/favicon.png" },
    { id: 3, titulo: "Retiro Familiar", imagen: "/favicon.png" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ titulo: "", imagen: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [flayerToDelete, setFlayerToDelete] = useState(null);

  // Cargar flayers del backend al montar
  useEffect(() => {
    const cargarFlayers = async () => {
      try {
        const res = await fetch("/api/flayers", {
          credentials: "include",
        });
        if (res.ok) {
          const datos = await res.json();
          setFlayers(datos);
        }
      } catch (error) {
        console.error("Error al cargar flayers:", error);
      }
    };
    cargarFlayers();
  }, []);

  // Cargar usuario actual
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const authRes = await fetch("/api/auth", {
          credentials: "include",
        });
        if (authRes.ok) {
          const authData = await authRes.json();
          setUsuarioActual(authData.user);
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      }
    };
    cargarUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (err) {
      alert("Error al cerrar sesión");
    }
  };

  const handleEliminar = (id) => {
    setFlayerToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!flayerToDelete) return;

    try {
      const res = await fetch(`/api/flayers/${flayerToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setFlayers(flayers.filter(f => f.id !== flayerToDelete));
      } else {
        alert("Error al eliminar el flayer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el flayer");
    } finally {
      setShowDeleteConfirm(false);
      setFlayerToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setFlayerToDelete(null);
  };

  const handleEditar = (id) => {
    alert("Funcionalidad de editar próximamente");
  };

  const handleMoverArriba = async (id) => {
    try {
      const res = await fetch(`/api/flayers/${id}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direccion: "arriba" }),
        credentials: "include",
      });

      if (res.ok) {
        // Recargar flayers del backend
        const resGet = await fetch("/api/flayers", { credentials: "include" });
        if (resGet.ok) {
          setFlayers(await resGet.json());
        }
      } else {
        alert("No se puede mover más arriba");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMoverAbajo = async (id) => {
    try {
      const res = await fetch(`/api/flayers/${id}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direccion: "abajo" }),
        credentials: "include",
      });

      if (res.ok) {
        // Recargar flayers del backend
        const resGet = await fetch("/api/flayers", { credentials: "include" });
        if (resGet.ok) {
          setFlayers(await resGet.json());
        }
      } else {
        alert("No se puede mover más abajo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAnadirFlayer = () => {
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setFormData({ titulo: "", imagen: null });
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, imagen: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor arrastra un archivo de imagen');
      }
    }
  };

  const handleGuardarFlayer = async () => {
    if (!formData.titulo.trim() || !formData.imagen) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('imagen', formData.imagen);

      const res = await fetch("/api/flayers", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (res.ok) {
        const nuevoFlayer = await res.json();
        setFlayers([...flayers, nuevoFlayer]);
        handleCerrarModal();
      } else {
        alert("Error al guardar el flayer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el flayer");
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagen: null }));
    setPreviewImage(null);
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
          <a className="nav-item" href="/admin/personas">
            <i className="fas fa-users"></i>
            Personas registradas
          </a>
          <a className="nav-item active" href="/admin/flayers">
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
          <span className="current">Gestión de Flayers</span>
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
          <div className="flayers-page-wrapper">
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">Gestión de Flayers</h1>
            </div>

            <div className="table-card">
        <div className="table-card-header">
          <div className="count">
            <span>{flayers.length}</span> flayers registrados
          </div>
          <button className="btn-new" onClick={handleAnadirFlayer}>
            <span>+</span> Nuevo Flayer
          </button>
        </div>

        {flayers.length === 0 ? (
          <div className="empty-state">
            <p>No hay flayers registrados</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="flayers-table">
              <thead>
                <tr>
                  <th className="col-image">IMAGEN</th>
                  <th className="col-title">TÍTULO</th>
                  <th className="col-actions">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {flayers.map((flayer) => (
                  <tr key={flayer.id} className="table-row">
                    <td className="col-image">
                      <div className="image-cell">
                        <img src={flayer.imagen} alt={flayer.titulo} />
                      </div>
                    </td>
                    <td className="col-title">
                      <span className="title-text">{flayer.titulo}</span>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <div className="order-buttons">
                          <button
                            className="btn-action btn-order btn-up"
                            onClick={() => handleMoverArriba(flayer.id)}
                            title="Mover arriba"
                          >
                            ↑
                          </button>
                          <button
                            className="btn-action btn-order btn-down"
                            onClick={() => handleMoverAbajo(flayer.id)}
                            title="Mover abajo"
                          >
                            ↓
                          </button>
                        </div>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditar(flayer.id)}
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleEliminar(flayer.id)}
                          title="Eliminar"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
            </div>

            {/* Modal Nuevo Flayer */}
            {showModal && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nuevo Flayer</h2>
              <button className="modal-close" onClick={handleCerrarModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="titulo" className="form-label">Título</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Nombre del evento"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imagen" className="form-label">Imagen</label>
                
                {/* Botón Seleccionar */}
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="file-input"
                  />
                  <label htmlFor="imagen" className="file-label">
                    {previewImage ? "Cambiar imagen" : "Seleccionar imagen"}
                  </label>
                </div>

                {/* Área Drag and Drop */}
                <div 
                  className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="drag-drop-content">
                    <p className="drag-drop-text">Arrastra la imagen aquí</p>
                    <p className="drag-drop-subtext">o usa el botón de arriba</p>
                  </div>
                </div>

                {/* Preview */}
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                    <button 
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                      type="button"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCerrarModal}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleGuardarFlayer}>
                  Guardar Flayer
                </button>
              </div>
            </div>
          </div>
            )}

            {/* Modal de Confirmación Eliminar */}
            {showDeleteConfirm && (
              <div className="modal-overlay" onClick={handleCancelDelete}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2 className="modal-title">Confirmar eliminación</h2>
                    <button className="modal-close" onClick={handleCancelDelete}>×</button>
                  </div>
                  <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
                    <p style={{ fontSize: '16px', margin: 0 }}>
                      ¿Estás seguro de que deseas eliminar este flayer?
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleCancelDelete}>
                      Cancelar
                    </button>
                    <button 
                      className="btn-save" 
                      onClick={handleConfirmDelete}
                      style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ChatBot />
    </div>
  );
}

export default AdminFlayers;
