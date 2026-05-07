import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logout } from '../utils/auth';
import '../styles/asistencias.css';

const GRUPOS = ['Niños', 'Jóvenes', 'Adultos'];
const COLORES = {
  'Niños': '#3b82f6',
  'Jóvenes': '#8b5cf6',
  'Adultos': '#10b981'
};

export default function EditarAsistencia() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    numero: '',
    sexo: 'M',
    grupo: 'Jóvenes',
    fecha_nacimiento: '',
    direccion: '',
    barrio: ''
  });

  useEffect(() => {
    const iniciar = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          if (data.rol !== 'Asistencias' && data.rol !== 'Administrador') {
            navigate('/admin');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/login');
      }

      // Cargar datos de la persona
      try {
        const res = await fetch(`/api/asistencia/${id}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            nombre_completo: data.nombre_completo || '',
            numero: data.numero || '',
            sexo: data.sexo || 'M',
            grupo: data.grupo || 'Jóvenes',
            fecha_nacimiento: data.fecha_nacimiento || '',
            direccion: data.direccion || '',
            barrio: data.barrio || ''
          });
        } else {
          setMensajeConfirmacion('Error al cargar los datos de la persona');
          setModalConfirmacion(true);
        }
      } catch (error) {
        console.error('Error al cargar persona:', error);
        setMensajeConfirmacion('Error de conexión al cargar la persona');
        setModalConfirmacion(true);
      }
      setLoadingData(false);
    };
    
    iniciar();
  }, [id, navigate]);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate('/login', { replace: true });
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre_completo.trim() || !String(formData.numero).trim() || !formData.sexo) {
      setMensajeConfirmacion('Por favor completa los campos obligatorios (Nombre, Teléfono y Género)');
      setModalConfirmacion(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/asistencia/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre_completo: formData.nombre_completo.trim(),
          numero: parseInt(formData.numero),
          sexo: formData.sexo,
          grupo: formData.grupo,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          direccion: formData.direccion.trim() || null,
          barrio: formData.barrio.trim() || null
        })
      });

      if (res.ok) {
        navigate('/asistencia/listado');
      } else {
        const error = await res.json();
        setMensajeConfirmacion(error.error || 'Error al actualizar la persona');
        setModalConfirmacion(true);
      }
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      setMensajeConfirmacion('Error de conexión con el servidor');
      setModalConfirmacion(true);
    } finally {
      setLoading(false);
    }
  };

  if (!session || loadingData) return <div className="asistencias-loading">Cargando...</div>;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-logo" src="/favicon.png" alt="Logo Iglesia Remanente Cali" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Remanente</span>
            <span className="sidebar-brand-sub">Cali</span>
          </div>
        </div>
        <span className="sidebar-label">Menú</span>
        <nav className="sidebar-nav">
          <a href="/asistencia/listado" className="nav-item">
            <i className="fas fa-check-square"></i>
            Registrar Asistencias
          </a>
          <a href="/asistencia/registros" className="nav-item">
            <i className="fas fa-clipboard-list"></i>
            Listado de Registros
          </a>
          <a href="/asistencia/graficas" className="nav-item">
            <i className="fas fa-chart-bar"></i>
            Gráficas
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{session.nombre}</div>
              <div className="sidebar-user-role">Asistencias · Remanente</div>
            </div>
          </div>
        </div>
      </aside>

      <header className="navbar">
        <div style={{ flex: 1 }}></div>
        <div className="user-avatar-container" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-avatar">
            {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
          </div>
          {showUserMenu && (
            <div className="user-menu">
              <a href="#" className="user-menu-item">
                <i className="fas fa-user"></i>
                <span>Mi Perfil</span>
              </a>
              <a href="#" className="user-menu-item">
                <i className="fas fa-gear"></i>
                <span>Configuración</span>
              </a>
              <div className="user-menu-divider"></div>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="user-menu-item danger">
                <i className="fas fa-arrow-right-from-bracket"></i>
                <span>Cerrar Sesión</span>
              </a>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Editar Persona</h1>
            <p className="page-subtitle">Actualiza la información de la persona</p>
          </div>
        </div>

        <div className="agregar-persona-container">
          <form onSubmit={handleSubmit} className="agregar-persona-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero">Número de Teléfono *</label>
              <input
                type="number"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sexo">Género *</label>
                <div className="sexo-buttons">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sexo: 'M' }))}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: formData.sexo === 'M' ? 'none' : '1.5px solid #e4e6ea',
                      borderRadius: '8px',
                      background: formData.sexo === 'M' ? '#3b82f6' : '#ffffff',
                      color: formData.sexo === 'M' ? '#fff' : '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    M
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sexo: 'F' }))}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: formData.sexo === 'F' ? 'none' : '1.5px solid #e4e6ea',
                      borderRadius: '8px',
                      background: formData.sexo === 'F' ? '#ef4444' : '#ffffff',
                      color: formData.sexo === 'F' ? '#fff' : '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    F
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="grupo">Grupo</label>
                <select
                  id="grupo"
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                >
                  {GRUPOS.map(grupo => (
                    <option key={grupo} value={grupo}>
                      {grupo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Calle 10 #20-30"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="barrio">Barrio</label>
              <input
                type="text"
                id="barrio"
                name="barrio"
                value={formData.barrio}
                onChange={handleChange}
                placeholder="Ej: Aguablanca"
              />
            </div>

            <div className="agregar-persona-buttons">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => navigate('/asistencia/listado')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
                style={{
                  backgroundColor: COLORES[formData.grupo],
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
            <div className="campos-obligatorios-nota">
              Los campos marcados con <span>*</span> son obligatorios
            </div>
          </form>
        </div>

        {modalConfirmacion && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <p>{mensajeConfirmacion}</p>
              <button
                className="btn-modal"
                onClick={() => setModalConfirmacion(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
