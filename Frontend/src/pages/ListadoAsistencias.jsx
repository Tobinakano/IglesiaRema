import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logout } from '../utils/auth';
import ChatBot from '../components/ChatBot';
import '../styles/asistencias.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate('/login', { replace: true });
    } else {
      alert('Error al cerrar sesión');
    }
  };

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

  const generarPDF = (fecha, personas) => {
    const doc = new jsPDF();
    const fechaFormato = new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Colores de grupos
    const coloresGrupo = { 
      'Niños': [96, 165, 250],      // #60a5fa
      'Jóvenes': [129, 140, 248],   // #818cf8
      'Adultos': [52, 211, 153]     // #34d399
    };
    
    let currentPage = 1;
    let yPos = 20;
    
    // ============ ENCABEZADO ============
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Iglesia Cristiana Remanente', 105, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Registro de Asistencias', 105, yPos, { align: 'center' });
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(85, 85, 85);
    doc.text(`Asistencias registradas el ${fechaFormato}`, 105, yPos, { align: 'center' });
    yPos += 10;
    
    // ============ GRUPOS ============
    const grupos = ['Niños', 'Jóvenes', 'Adultos'];
    
    grupos.forEach((grupo) => {
      const personasGrupo = personas.filter(p => p.grupo === grupo);
      
      if (personasGrupo.length === 0) return;
      
      // Verificar si necesitamos nueva página para el grupo
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
        currentPage++;
      }
      
      // Encabezado del grupo con punto de color
      const [r, g, b] = coloresGrupo[grupo];
      
      // Dibujar punto de color
      doc.setFillColor(r, g, b);
      doc.circle(23, yPos - 2, 1.5, 'F');
      
      // Texto del grupo
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${grupo} (${personasGrupo.length})`, 28, yPos);
      yPos += 7;
      
      // Tabla del grupo
      const tableData = personasGrupo.map(p => [
        p.nombre_completo,
        p.numero || '-',
        p.sexo || '-'
      ]);
      
      autoTable(doc, {
        head: [['Nombre', 'Número', 'Género']],
        body: tableData,
        startY: yPos,
        theme: 'grid',
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: [102, 102, 102],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'left',
          padding: 3,
          lineColor: [224, 224, 224],
          lineWidth: 0.5
        },
        bodyStyles: {
          textColor: [34, 34, 34],
          fontSize: 11,
          padding: 3,
          lineColor: [240, 240, 240],
          lineWidth: 0.3
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 100 },
          1: { halign: 'center', cellWidth: 40 },
          2: { halign: 'center', cellWidth: 30 }
        },
        margin: { left: 20, right: 20 },
        didDrawPage: function() {
          // Este callback se ejecuta después de dibujar la tabla
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 8;
    });
    
    // ============ FOOTER ============
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`,
        105,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Descargar PDF
    doc.save(`Asistencias_${fecha}.pdf`);
  };

  const handleBorrar = (fecha, registroId, nombrePersona) => {
    setRegistroBorrar({ id: registroId, fecha, nombre: nombrePersona });
    setModalBorrar(true);
  };

  const confirmaBorrar = async () => {
    if (!registroBorrar) return;

    try {
      const res = await fetch(`/api/asistencia/registros/${registroBorrar.fecha}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        // Remover la fecha de la lista principal
        setRegistros(prev => prev.filter(r => r.fecha !== registroBorrar.fecha));
        
        // Cerrar detalles si estaba abierto
        if (detalles && detalles.fecha === registroBorrar.fecha) {
          setDetalles(null);
        }
        
        setModalBorrar(false);
        setRegistroBorrar(null);
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
            <i className="fas fa-check-square"></i>
            Registrar Asistencias
          </a>
          <a href="/asistencia/registros" className="nav-item active">
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
            <h1 className="page-title">Registros de Asistencias</h1>
            <p className="page-subtitle">Historial de asistencias registradas</p>
          </div>
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
                          {new Date(registro.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                            <i className="fas fa-eye" style={{ fontSize: '18px' }}></i>
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/asistencia/registros/${registro.fecha}`, { credentials: 'include' });
                                if (res.ok) {
                                  const personas = await res.json();
                                  generarPDF(registro.fecha, personas);
                                }
                              } catch (error) {
                                console.error('Error generando PDF:', error);
                              }
                            }}
                            title="Imprimir"
                            style={{ background: '#f0f1f3', border: '1px solid #e4e6ea', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9098a3', width: '35px', height: '35px', borderRadius: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.target.style.background = '#e4e6ea'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#f0f1f3'; }}
                          >
                            <i className="fas fa-print" style={{ fontSize: '18px' }}></i>
                          </button>
                          <button
                            onClick={() => handleBorrar(registro.fecha, registro.fecha, `Registro de ${registro.fecha}`)}
                            title="Borrar registro"
                            style={{ background: '#f0f1f3', border: '1px solid #e4e6ea', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', width: '35px', height: '35px', borderRadius: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.target.style.background = '#fee2e2'; e.target.style.borderColor = '#ef4444'; }}
                            onMouseLeave={(e) => { e.target.style.background = '#f0f1f3'; e.target.style.borderColor = '#e4e6ea'; }}
                          >
                            <i className="fas fa-trash" style={{ fontSize: '18px' }}></i>
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
                  Asistencias registradas el {new Date(detalles.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                              <div style={{ textAlign: 'center' }}>Género</div>
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
      <ChatBot />
    </div>
  );
}
