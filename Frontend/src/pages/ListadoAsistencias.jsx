import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/asistencias.css';

const COLORES = {
  'Niños': '#3b82f6',
  'Jóvenes': '#8b5cf6',
  'Adultos': '#10b981'
};

export default function ListadoAsistencias() {
  const navigate = useNavigate();
  const { fecha } = useParams();
  const [session, setSession] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [modalBorrar, setModalBorrar] = useState(false);
  const [registroBorrar, setRegistroBorrar] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cargarRegistros = async () => {
    try {
      const res = await fetch('/api/asistencia/registros', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRegistros(data);
      }
    } catch (error) {
      console.error('Error cargando registros:', error);
    }
  };

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

      await cargarRegistros();
      setLoading(false);
    };
    
    iniciar();
  }, [navigate]);

  const verListado = async (fechaSeleccionada) => {
    try {
      const res = await fetch(`/api/asistencia/registros/${fechaSeleccionada}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDetalles({ fecha: fechaSeleccionada, personas: data });
      }
    } catch (error) {
      console.error('Error cargando detalles:', error);
    }
  };

  const handleBorrar = (fecha, registroId, nombrePersona) => {
    setRegistroBorrar({ id: registroId, fecha, nombre: nombrePersona });
    setModalBorrar(true);
  };

  const confirmaBorrar = async () => {
    if (!registroBorrar) return;

    try {
      const res = await fetch(`/api/asistencia/registros/${registroBorrar.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setModalBorrar(false);
        setRegistroBorrar(null);
        // Recargar detalles de la fecha
        if (detalles) {
          await verListado(detalles.fecha);
        }
      }
    } catch (error) {
      console.error('Error al borrar:', error);
    }
  };

  if (!session || loading) return <div style={{padding: 40}}>Cargando...</div>;

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
            <svg viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Registrar Asistencias
          </a>
          <a href="/asistencia/registros" className="nav-item active">
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
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '14px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.parentElement.style.background = '#fee2e2'} onMouseLeave={(e) => e.target.parentElement.style.background = 'transparent'}>
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
            <h1 className="page-title">Registros de Asistencias</h1>
            <p className="page-subtitle">Historial de asistencias registradas</p>
          </div>
          {!detalles && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={cargarRegistros} style={{ padding: '10px 20px', background: '#c9a84c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                ↻ Recargar
              </button>
            </div>
          )}
        </div>

        {!detalles ? (
          <div style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e4e6ea' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#555b66', fontSize: '13px' }}>Fecha</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#555b66', fontSize: '13px' }}>Personas Asistidas</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#555b66', fontSize: '13px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#9098a3' }}>
                        No hay registros aún
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro) => (
                      <tr key={registro.fecha} style={{ borderBottom: '1px solid #f0f1f3' }}>
                        <td style={{ padding: '16px 20px', color: '#1a1a1a' }}>
                          {new Date(registro.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center', color: '#1a1a1a', fontWeight: '600' }}>
                          {registro.total}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            onClick={() => verListado(registro.fecha)}
                            title="Ver asistencias"
                            style={{ background: '#f0f1f3', border: '1px solid #e4e6ea', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', width: '35px', height: '35px', borderRadius: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.target.style.background = '#e4e6ea'; e.target.style.borderColor = '#3b82f6'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#f0f1f3'; e.target.style.borderColor = '#e4e6ea'; }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '21px', height: '21px' }}>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button
                            title="Imprimir"
                            style={{ background: '#f0f1f3', border: '1px solid #e4e6ea', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9098a3', width: '35px', height: '35px', borderRadius: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.target.style.background = '#e4e6ea'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#f0f1f3'; }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '21px', height: '21px' }}>
                              <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleBorrar(registro.fecha, registro.fecha, `Registro de ${registro.fecha}`)}
                            title="Borrar registro"
                            style={{ background: '#f0f1f3', border: '1px solid #e4e6ea', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', width: '35px', height: '35px', borderRadius: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.target.style.background = '#fee2e2'; e.target.style.borderColor = '#ef4444'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#f0f1f3'; e.target.style.borderColor = '#e4e6ea'; }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '21px', height: '21px' }}>
                              <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setDetalles(null)}
                style={{ padding: '10px 16px', background: '#e4e6ea', color: '#1a1a1a', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                ← Volver
              </button>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e4e6ea', background: '#f4f5f7' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                  Asistencias registradas el {new Date(detalles.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>
              </div>

              <div style={{ padding: '20px' }}>
                {detalles.personas.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9098a3', padding: '40px' }}>
                    No hay registros para esta fecha
                  </div>
                ) : (
                  <div>
                    {['Niños', 'Jóvenes', 'Adultos'].map((grupo) => {
                      const personasGrupo = detalles.personas.filter(p => p.grupo === grupo);
                      return personasGrupo.length > 0 ? (
                        <div key={grupo} style={{ marginBottom: '28px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORES[grupo] }}></div>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                              {grupo} ({personasGrupo.length})
                            </h3>
                          </div>
                          
                          <div style={{ background: '#f4f5f7', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e6ea' }}>
                            {/* Headers */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '12px 16px', background: '#fff', borderBottom: '2px solid #e4e6ea', fontWeight: '600', fontSize: '12px', color: '#555b66', textTransform: 'uppercase' }}>
                              <div>Nombre</div>
                              <div style={{ textAlign: 'center' }}>Número</div>
                              <div style={{ textAlign: 'center' }}>Sexo</div>
                            </div>
                            
                            {/* Filas */}
                            {personasGrupo.map((persona, idx) => (
                              <div key={persona.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', padding: '12px 16px', borderBottom: idx < personasGrupo.length - 1 ? '1px solid #e4e6ea' : 'none', fontSize: '14px', color: '#1a1a1a', background: idx % 2 === 0 ? '#fff' : '#f9f9fb' }}>
                                <div>{persona.nombre_completo}</div>
                                <div style={{ textAlign: 'center', color: '#555b66' }}>{persona.numero || '-'}</div>
                                <div style={{ textAlign: 'center', color: '#555b66' }}>{persona.sexo || '-'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {modalBorrar && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Confirmar eliminación</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#555b66' }}>
              ¿Estás seguro de que deseas borrar el registro de <strong>{new Date(registroBorrar?.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalBorrar(false)}
                style={{ padding: '10px 24px', background: '#e4e6ea', color: '#1a1a1a', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmaBorrar}
                style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Borrar
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
    </div>
  );
}
