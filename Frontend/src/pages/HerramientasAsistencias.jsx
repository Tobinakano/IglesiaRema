import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import '../styles/asistencias.css';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? ''
  : 'https://iglesia-rema-backend.onrender.com';

const GRUPOS = ['Niños', 'Jóvenes', 'Adultos', 'Nuevos'];
const COLORES = {
  'Niños': '#3b82f6',
  'Jóvenes': '#8b5cf6',
  'Adultos': '#10b981',
  'Nuevos': '#f59e0b'
};

export default function HerramientasAsistencias() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [todasLasPersonas, setTodasLasPersonas] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [expandedGrupos, setExpandedGrupos] = useState({ 'Niños': true, 'Jóvenes': true, 'Adultos': true, 'Nuevos': true });
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Modales
  const [modalConfigurar, setModalConfigurar] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [searchTermConfig, setSearchTermConfig] = useState('');

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  });
  const [saveStatus, setSaveStatus] = useState('idle');

  const cargarEstadoAsistencias = async (fecha) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/asistencia/herramientas/registros/${fecha}`, { credentials: 'include' });
      if (res.ok) {
        const registros = await res.json();
        const map = {};
        registros.forEach(reg => {
          map[reg.persona_id] = true;
        });
        setAsistencias(map);
      } else {
        console.error('Error cargando registros de asistencia de herramientas');
      }
    } catch (error) {
      console.error('Error de red cargando registros:', error);
    }
  };

  const cargarPersonas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/asistencia`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTodasLasPersonas(data);
        setPersonasFiltradas(data.filter(p => p.herramientas));
      }
    } catch (error) {
      console.error('Error cargando personas:', error);
    }
  };

  useEffect(() => {
    const iniciar = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/session`, { credentials: 'include' });
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

      await cargarPersonas();
      await cargarEstadoAsistencias(selectedDate);
      setLoading(false);
    };
    
    iniciar();
  }, [navigate]);

  useEffect(() => {
    if (!loading && session) {
      cargarEstadoAsistencias(selectedDate);
    }
  }, [selectedDate]);

  const toggleAsistencia = async (personaId) => {
    const nuevoEstado = !asistencias[personaId];

    setAsistencias(prev => ({
      ...prev,
      [personaId]: nuevoEstado
    }));

    setSaveStatus('saving');
    try {
      const res = await fetch(`${API_BASE_URL}/api/asistencia/herramientas/marcar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fecha: selectedDate,
          persona_id: personaId,
          asistio: nuevoEstado
        })
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
        }, 2000);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      setSaveStatus('error');
      setAsistencias(prev => ({
        ...prev,
        [personaId]: !nuevoEstado
      }));
      setMensajeConfirmacion('No se pudo guardar el cambio en la asistencia.');
      setModalConfirmacion(true);
    }
  };

  const handleToggleMatricula = async (persona) => {
    const nuevoEnrolado = !persona.herramientas;
    
    // Optimista local update
    setTodasLasPersonas(prev => 
      prev.map(p => p.id === persona.id ? { ...p, herramientas: nuevoEnrolado } : p)
    );
    setPersonasFiltradas(prev => {
      if (nuevoEnrolado) {
        return [...prev, { ...persona, herramientas: true }].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nombre_completo.localeCompare(b.nombre_completo));
      } else {
        return prev.filter(p => p.id !== persona.id);
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/asistencia/${persona.id}/herramientas?enrolled=${nuevoEnrolado}`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Error al actualizar en el servidor');
      }
    } catch (error) {
      console.error('Error al matricular persona:', error);
      // Revertir
      setTodasLasPersonas(prev => 
        prev.map(p => p.id === persona.id ? { ...p, herramientas: !nuevoEnrolado } : p)
      );
      setPersonasFiltradas(prev => {
        if (!nuevoEnrolado) {
          return [...prev, { ...persona, herramientas: true }].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nombre_completo.localeCompare(b.nombre_completo));
        } else {
          return prev.filter(p => p.id !== persona.id);
        }
      });
      alert('Error de conexión al guardar inscripción');
    }
  };

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate('/login', { replace: true });
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const toggleGrupo = (grupo) => {
    setExpandedGrupos(prev => ({
      ...prev,
      [grupo]: !prev[grupo]
    }));
  };

  if (!session || loading) return <div style={{padding: 40}}>Cargando...</div>;

  const personasPorGrupo = GRUPOS.reduce((acc, grupo) => {
    acc[grupo] = personasFiltradas.filter(p => p.grupo === grupo);
    return acc;
  }, {});

  const personasModalFiltradas = todasLasPersonas.filter(p => 
    p.nombre_completo.toLowerCase().includes(searchTermConfig.toLowerCase())
  );

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
        
        <span className="sidebar-label">Menú General</span>
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

        <span className="sidebar-label">Herramientas para el Camino</span>
        <nav className="sidebar-nav">
          <a href="/asistencia/herramientas/listado" className="nav-item active">
            <i className="fas fa-check-square"></i>
            Registrar Asistencia
          </a>
          <a href="/asistencia/herramientas/registros" className="nav-item">
            <i className="fas fa-clipboard-list"></i>
            Listado de Registros
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
        <div className="navbar-right" style={{ position: 'relative' }}>
          <div 
            className="user-avatar" 
            title="Mi perfil"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: 'pointer' }}
          >
            {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
          </div>
          
          {showUserMenu && (
            <div style={{ position: 'absolute', top: '50px', right: '0', background: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', minWidth: '200px', zIndex: 1000 }}>
              <div style={{ padding: '12px 0' }}>
                <a href={session ? `/admin/editar/${session.id}` : '#'} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>
                  <i className="fas fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>Mi Perfil</span>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px' }}>
                  <i className="fas fa-gear" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>Configuración</span>
                </a>
                <div style={{ height: '1px', background: '#e4e6ea', margin: '8px 0' }}></div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' }}>
                  <i className="fas fa-arrow-right-from-bracket" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>Cerrar Sesión</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Herramientas para el Camino</h1>
            <p className="page-subtitle">Registra la asistencia del curso</p>
          </div>
          <div className="page-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: saveStatus === 'error' ? '#ef4444' : saveStatus === 'saved' ? '#10b981' : '#9098a3', transition: 'all 0.3s ease' }}>
              {saveStatus === 'saving' && (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #e4e6ea', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                  <span>Guardando...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ Cambios guardados</span>
              )}
              {saveStatus === 'error' && (
                <span style={{ color: '#ef4444' }}>⚠️ Error al guardar</span>
              )}
              {saveStatus === 'idle' && (
                <span style={{ color: '#9098a3' }}>☁️ Guardado automático activo</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e4e6ea', padding: '6px 12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ color: '#c9a84c', fontSize: '14px' }}>📅</span>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                style={{ border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '14px', color: '#1a1a1a', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModalConfigurar(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#c9a227',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <i className="fas fa-cog" style={{ fontSize: '16px' }}></i>
            Configurar Participantes
          </button>
        </div>

        {personasFiltradas.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '12px', padding: '60px 20px', textAlign: 'center', color: '#9098a3' }}>
            <i className="fas fa-users-slash" style={{ fontSize: '48px', marginBottom: '16px', color: '#b0b4bc' }}></i>
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>No hay participantes configurados</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Haz clic en "Configurar Participantes" para inscribir personas del registro general.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {GRUPOS.map(grupo => {
              const personasGrupo = personasPorGrupo[grupo] || [];
              if (personasGrupo.length === 0) return null;

              return (
                <div key={grupo} style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden' }}>
                  <div onClick={() => toggleGrupo(grupo)} style={{
                      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'pointer', background: '#f4f5f7', borderBottom: expandedGrupos[grupo] ? '1px solid #e4e6ea' : 'none'
                    }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORES[grupo] }}></div>
                    <span style={{ fontWeight: '600', color: '#1a1a1a', flex: 1 }}>{grupo}</span>
                    <span style={{ fontSize: '13px', color: '#9098a3' }}>{personasGrupo.length} personas</span>
                  </div>

                  {expandedGrupos[grupo] && (
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px', gap: '24px', paddingBottom: '12px', borderBottom: '1px solid #e4e6ea', marginBottom: '12px', fontSize: '12px', fontWeight: '600', color: '#9098a3', textTransform: 'uppercase', alignItems: 'center' }}>
                        <div>Nombre</div>
                        <div style={{ textAlign: 'center' }}>Asistencia</div>
                      </div>

                      {personasGrupo.map(persona => (
                        <div key={persona.id} style={{ display: 'grid', gridTemplateColumns: '1fr 50px', gap: '24px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0f1f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#555b66' }}>
                              {persona.nombre_completo[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1a1a1a' }}>{persona.nombre_completo}</div>
                              <div style={{ fontSize: '12px', color: '#9098a3' }}>{persona.numero || 'Sin teléfono'}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={asistencias[persona.id] || false} 
                              onChange={() => toggleAsistencia(persona.id)} 
                              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: COLORES[grupo] }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL CONFIGURAR PARTICIPANTES */}
        {modalConfigurar && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '90%', maxWidth: '550px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Inscripción de Participantes</h2>
                <button onClick={() => setModalConfigurar(false)} style={{ fontSize: '24px', color: '#9098a3', cursor: 'pointer' }}>&times;</button>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#555b66' }}>Selecciona quiénes forman parte de "Herramientas para el Camino". Los seleccionados aparecerán en la lista para tomar asistencia.</p>
              
              {/* Buscador */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Buscar persona por nombre..." 
                  value={searchTermConfig}
                  onChange={(e) => setSearchTermConfig(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid #e4e6ea', outline: 'none' }}
                />
              </div>

              {/* Lista */}
              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e4e6ea', borderRadius: '8px', padding: '12px' }}>
                {personasModalFiltradas.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#9098a3', fontSize: '14px' }}>No se encontraron personas</div>
                ) : (
                  personasModalFiltradas.map(persona => (
                    <div key={persona.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f1f3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORES[persona.grupo] || '#999' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{persona.nombre_completo}</span>
                        <span style={{ fontSize: '11px', color: '#9098a3', background: '#f4f5f7', padding: '2px 6px', borderRadius: '4px' }}>{persona.grupo}</span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={persona.herramientas || false} 
                          onChange={() => handleToggleMatricula(persona)} 
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </label>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setModalConfigurar(false)}
                  style={{ padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        )}

        {modalConfirmacion && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Aviso</h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#555b66', lineHeight: '1.5' }}>{mensajeConfirmacion}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setModalConfirmacion(false)}
                  style={{ padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
