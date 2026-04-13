import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import '../styles/asistencias.css';

const GRUPOS = ['Niños', 'Jóvenes', 'Adultos'];
const COLORES = {
  'Niños': '#3b82f6',
  'Jóvenes': '#8b5cf6',
  'Adultos': '#10b981'
};

export default function Asistencias() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [expandedGrupos, setExpandedGrupos] = useState({ 'Niños': true, 'Jóvenes': true, 'Adultos': true });
  const [loading, setLoading] = useState(true);
  const [nuevasPersonas, setNuevasPersonas] = useState({ 'Niños': '', 'Jóvenes': '', 'Adultos': '' });
  const [nuevosNumeros, setNuevosNumeros] = useState({ 'Niños': '', 'Jóvenes': '', 'Adultos': '' });
  const [nuevosSexos, setNuevosSexos] = useState({ 'Niños': '', 'Jóvenes': '', 'Adultos': '' });
  const [busqueda, setBusqueda] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [personaBorrar, setPersonaBorrar] = useState(null);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  useEffect(() => {
    const iniciar = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          if (data.rol !== 'Asistencias') {
            navigate('/admin');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/login');
      }

      try {
        const res = await fetch('/api/asistencia', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setPersonas(data);
        }
      } catch (error) {
        console.error('Error cargando asistencia:', error);
      }
      setLoading(false);
    };
    
    iniciar();
  }, [navigate]);

  const toggleAsistencia = (personaId) => {
    setAsistencias(prev => ({
      ...prev,
      [personaId]: !prev[personaId]
    }));
  };

  const handleBorrar = (personaId, nombreCompleto) => {
    setPersonaBorrar({ id: personaId, nombre: nombreCompleto });
    setModalBorrar(true);
  };

  const confirmaBorrar = async () => {
    if (!personaBorrar) return;

    try {
      const res = await fetch(`/api/asistencia/${personaBorrar.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        // Recargar lista de personas
        const resPersonas = await fetch('/api/asistencia', { credentials: 'include' });
        if (resPersonas.ok) {
          setPersonas(await resPersonas.json());
        }
        setModalBorrar(false);
        setPersonaBorrar(null);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMensajeConfirmacion('Error al eliminar la persona');
      setModalConfirmacion(true);
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

  const agregarPersona = async (grupo) => {
    const nombre = nuevasPersonas[grupo].trim();
    const numero = nuevosNumeros[grupo].trim();
    const sexo = nuevosSexos[grupo].trim();
    
    if (!nombre || !numero || !sexo) {
      setMensajeConfirmacion('Por favor completa: nombre, número y sexo');
      setModalConfirmacion(true);
      return;
    }

    try {
      const res = await fetch('/api/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          nombre_completo: nombre, 
          numero: parseInt(numero),
          sexo: sexo,
          grupo 
        })
      });
      if (res.ok) {
        const nueva = await res.json();
        setPersonas(prev => [...prev, nueva]);
        // Pre-marcar automáticamente
        setAsistencias(prev => ({ ...prev, [nueva.id]: true }));
        // Limpiar inputs
        setNuevasPersonas(prev => ({ ...prev, [grupo]: '' }));
        setNuevosNumeros(prev => ({ ...prev, [grupo]: '' }));
        setNuevosSexos(prev => ({ ...prev, [grupo]: '' }));
      }
    } catch (error) {
      console.error('Error al agregar persona:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      // Obtener personas con asistencia marcada
      const asistenciasARegistrar = Object.entries(asistencias)
        .filter(([, asistio]) => asistio)
        .map(([id]) => {
          const persona = personas.find(p => p.id == id);
          return persona ? { 
            id: persona.id, 
            nombre_completo: persona.nombre_completo, 
            numero: persona.numero,
            sexo: persona.sexo,
            grupo: persona.grupo 
          } : null;
        })
        .filter(p => p !== null);

      // Guardar asistencias en BD si hay alguna marcada
      if (asistenciasARegistrar.length > 0) {
        const resRegistro = await fetch('/api/asistencia/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ asistencias: asistenciasARegistrar })
        });

        if (resRegistro.ok) {
          // Limpiar checkboxes después de guardar
          setAsistencias({});
          // Mostrar confirmación
          setMensajeConfirmacion('Asistencias guardadas correctamente');
          setModalConfirmacion(true);
        } else {
          setMensajeConfirmacion('Error al guardar las asistencias');
          setModalConfirmacion(true);
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
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
    acc[grupo] = personas
      .filter(p => p.grupo === grupo)
      .filter(p => p.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()));
    return acc;
  }, {});

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
          <a href="/asistencia/listado" className="nav-item active">
            <svg viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Registrar Asistencias
          </a>
          <a href="/asistencia/registros" className="nav-item">
            <svg viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
            </svg>
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
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#f4f5f7'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
                  <i className="fas fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>Mi Perfil</span>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#f4f5f7'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
                  <i className="fas fa-gear" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>Configuración</span>
                </a>
                <div style={{ height: '1px', background: '#e4e6ea', margin: '8px 0' }}></div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#fee2e2'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
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
            <h1 className="page-title">Control de Asistencias</h1>
            <p className="page-subtitle">Registra la asistencia del servicio de hoy</p>
          </div>
        </div>

        <div className="stats-row" style={{ marginBottom: '12px' }}>
          {GRUPOS.map(grupo => (
            <div key={grupo} className="stat-card">
              <div className="stat-icon" style={{ background: `${COLORES[grupo]}20` }}>
                <svg viewBox="0 0 24 24" style={{ stroke: COLORES[grupo] }}>
                  <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                </svg>
              </div>
              <div>
                <div className="stat-value">{personasPorGrupo[grupo].length}</div>
                <div className="stat-label">{grupo}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Buscar persona..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #e4e6ea', borderRadius: '8px', fontSize: '14px', width: '100%', maxWidth: '400px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {GRUPOS.map(grupo => (
            <div key={grupo} style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden' }}>
              <div  onClick={() => toggleGrupo(grupo)} style={{
                  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', background: '#f4f5f7', borderBottom: expandedGrupos[grupo] ? '1px solid #e4e6ea' : 'none'
                }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORES[grupo] }}></div>
                <span style={{ fontWeight: '600', color: '#1a1a1a', flex: 1 }}>{grupo}</span>
                <span style={{ fontSize: '13px', color: '#9098a3' }}>{personasPorGrupo[grupo].length} personas</span>
              </div>

              {expandedGrupos[grupo] && (
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 25px 1px 40px', gap: '24px', paddingBottom: '12px', borderBottom: '1px solid #e4e6ea', marginBottom: '12px', fontSize: '12px', fontWeight: '600', color: '#9098a3', textTransform: 'uppercase', alignItems: 'center' }}>
                    <div>Nombre</div>
                    <div></div>
                    <div></div>
                    <div style={{ textAlign: 'center' }}>Acción</div>
                  </div>

                  {personasPorGrupo[grupo].map(persona => (
                    <div key={persona.id} style={{ display: 'grid', gridTemplateColumns: '1fr 25px 1px 40px', gap: '24px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f1f3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0f1f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#555b66' }}>
                          {persona.nombre_completo[0]}
                        </div>
                        <span>{persona.nombre_completo}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <input type="checkbox" checked={asistencias[persona.id] || false} onChange={() => toggleAsistencia(persona.id)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: COLORES[grupo] }} />
                      </div>
                      <div style={{ width: '1px', height: '24px', background: '#e4e6ea' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          onClick={() => handleBorrar(persona.id, persona.nombre_completo)}
                          style={{ background: '#ff4444', color: '#fff', border: 'none', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e4e6ea', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Nombre..."
                      value={nuevasPersonas[grupo]}
                      onChange={(e) => setNuevasPersonas(prev => ({ ...prev, [grupo]: e.target.value }))}
                      style={{ flex: 1, padding: '10px 12px', border: '1px solid #e4e6ea', borderRadius: '8px', fontSize: '14px' }}
                    />
                    <input
                      type="number"
                      placeholder="Número"
                      value={nuevosNumeros[grupo]}
                      onChange={(e) => setNuevosNumeros(prev => ({ ...prev, [grupo]: e.target.value }))}
                      style={{ flex: 1, padding: '10px 12px', border: '1px solid #e4e6ea', borderRadius: '8px', fontSize: '14px' }}
                      min="0"
                    />
                    <button
                      onClick={() => setNuevosSexos(prev => ({ ...prev, [grupo]: 'F' }))}
                      style={{ 
                        padding: '10px 14px', 
                        background: nuevosSexos[grupo] === 'F' ? '#ef4444' : '#e4e6ea',
                        color: nuevosSexos[grupo] === 'F' ? '#fff' : '#1a1a1a',
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        transition: 'all 0.2s',
                        minWidth: '44px'
                      }}
                    >
                      F
                    </button>
                    <button
                      onClick={() => setNuevosSexos(prev => ({ ...prev, [grupo]: 'M' }))}
                      style={{ 
                        padding: '10px 14px', 
                        background: nuevosSexos[grupo] === 'M' ? '#3b82f6' : '#e4e6ea',
                        color: nuevosSexos[grupo] === 'M' ? '#fff' : '#1a1a1a',
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        transition: 'all 0.2s',
                        minWidth: '44px'
                      }}
                    >
                      M
                    </button>
                    <button
                      onClick={() => {
                        if (nuevasPersonas[grupo].trim() && nuevosNumeros[grupo].trim() && nuevosSexos[grupo]) {
                          agregarPersona(grupo);
                        }
                      }}
                      style={{ 
                        padding: '10px 20px', 
                        background: COLORES[grupo], 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button onClick={handleGuardar} style={{ padding: '12px 28px', background: '#c9a84c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            Guardar Asistencias
          </button>
        </div>

        {modalBorrar && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Confirmar eliminación</h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#555b66' }}>
                ¿Estás seguro/a de borrar a <strong>{personaBorrar?.nombre}</strong>?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setModalBorrar(false);
                    setPersonaBorrar(null);
                  }}
                  style={{ padding: '10px 24px', background: '#e4e6ea', color: '#1a1a1a', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmaBorrar}
                  style={{ padding: '10px 24px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {modalConfirmacion && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Aviso</h2>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#555b66', lineHeight: '1.5' }}>
                {mensajeConfirmacion}
              </p>
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
