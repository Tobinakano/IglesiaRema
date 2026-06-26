import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import html2canvas from 'html2canvas';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import '../styles/graficas.css';

// URL dinámica según el entorno
const API_URL = window.location.hostname === 'localhost'
  ? ''
  : 'https://iglesia-rema-backend.onrender.com';

export default function Graficas() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [monthlyVisits, setMonthlyVisits] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [allMonthsData, setAllMonthsData] = useState({});
  
  const chartMonthRef = useRef(null);
  const chartYearRef = useRef(null);
  
  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1;
  const anoActual = ahora.getFullYear();
  const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const mesNombre = selectedMonth ? mesesNombres[selectedMonth - 1] : mesesNombres[mesActual - 1];

  useEffect(() => {
    const iniciar = async () => {
      try {
        // Validar sesión usando la URL absoluta del backend
        const response = await fetch(`${API_URL}/api/session`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          // Permitir acceso a Asistencias y Administradores
          if (data.rol !== 'Asistencias' && data.rol !== 'Administrador') {
            navigate('/admin');
            return;
          }
        } else {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/login');
        return;
      }

      try {
        const mesesData = {};
        const mesesNombresArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        // Consultar los 12 meses del año
        for (let mes = 1; mes <= 12; mes++) {
          const mesStr = String(mes).padStart(2, '0');
          const resGraficas = await fetch(`${API_URL}/api/asistencia/graficas/${anoActual}-${mesStr}`, { credentials: 'include' });
          
          if (resGraficas.ok) {
            // Verificar si el tipo de contenido recibido es JSON válido para evitar romper la app con HTMLs de error
            const contentType = resGraficas.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const datos = await resGraficas.json();
              
              if (Array.isArray(datos)) {
                const datosTransformados = datos.map(item => {
                  const fecha = new Date(item.fecha + 'T00:00:00');
                  const diaLabel = fecha.toLocaleDateString('es-ES', { 
                    day: 'numeric',
                    month: 'short'
                  });
                  
                  return {
                    ...item,
                    adultos: Number(item.adultos) || 0,
                    jovenes: Number(item.jovenes) || Number(item.jóvenes) || 0,
                    ninos: Number(item.ninos) || Number(item.niños) || 0,
                    nuevos: Number(item.nuevos) || Number(item.nuevo) || 0,
                    diaLabel: diaLabel,
                    mes: fecha.getMonth() + 1
                  };
                });
                mesesData[mes] = datosTransformados;
              } else {
                mesesData[mes] = [];
              }
            } else {
              mesesData[mes] = [];
            }
          } else {
            mesesData[mes] = [];
          }
        }
        
        setAllMonthsData(mesesData);
        const datosDelMesActual = mesesData[mesActual] || [];
        setChartData(datosDelMesActual);

        // Inicializar estructura limpia para datos anuales
        const mesesDataAnual = {};
        mesesNombresArray.forEach((nombre, index) => {
          mesesDataAnual[index + 1] = {
            mes: nombre,
            visitantes: 0
          };
        });

        // Nueva lógica de acumulación segura con tipado numérico estricto
        Object.keys(mesesData).forEach((mesKey) => {
          const datosDelMes = mesesData[mesKey];
          
          if (Array.isArray(datosDelMes)) {
            datosDelMes.forEach(item => {
              const adultos = Number(item.adultos) || 0;
              const jovenes = Number(item.jovenes) || Number(item.jóvenes) || 0;
              const ninos = Number(item.ninos) || Number(item.niños) || 0;
              const nuevos = Number(item.nuevos) || Number(item.nuevo) || 0;
              
              const totalPersonas = adultos + jovenes + ninos + nuevos;
              mesesDataAnual[mesKey].visitantes += totalPersonas;
            });
          }
        });

        const visitasAnuales = Object.values(mesesDataAnual);
        setMonthlyVisits(visitasAnuales);
      } catch (error) {
        console.error('Error cargando gráficas:', error);
      }

      setLoading(false);
    };
    
    iniciar();
  }, [navigate, mesActual, anoActual]);

  useEffect(() => {
    if (selectedMonth && allMonthsData[selectedMonth]) {
      setChartData(allMonthsData[selectedMonth]);
    } else if (mesActual && allMonthsData[mesActual]) {
      setChartData(allMonthsData[mesActual]);
    } else {
      setChartData([]);
    }
  }, [selectedMonth, allMonthsData, mesActual]);

  // Sincronización con comandos del ChatBot / LocalStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== 'chatBotGraphicRequest') return;
      
      const graphicRequest = localStorage.getItem('chatBotGraphicRequest');
      if (!graphicRequest) return;

      try {
        const grafica = JSON.parse(graphicRequest);
        const requestId = Date.now();
        localStorage.setItem('graphicProcessing', requestId.toString());

        if (grafica.tipo === 'mensual' && grafica.datos && grafica.datos.length > 0) {
          const datosDelMes = grafica.datos.map(item => ({
            diaLabel: new Date(item.dia).getDate().toString(),
            adultos: Number(item.adultos) || 0,
            jovenes: Number(item.jovenes) || 0,
            ninos: Number(item.ninos) || 0,
            nuevos: Number(item.nuevos) || 0
          }));
          setChartData(datosDelMes);
          if (grafica.mes) {
            setSelectedMonth(grafica.mes);
          }
        } else if ((grafica.tipo === 'anual' || grafica.tipo === 'circular') && grafica.datos) {
          const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const datosAnuales = grafica.datos.map(item => ({
            mes: meses[parseInt(item.mes, 10) - 1],
            visitantes: Number(item.total) || 0
          }));
          setMonthlyVisits(datosAnuales);
        }
        
        setTimeout(() => {
          const currentId = localStorage.getItem('graphicProcessing');
          if (currentId === requestId.toString()) {
            localStorage.setItem('graphicUpdatedConfirm', 'true');
            localStorage.removeItem('chatBotGraphicRequest');
            localStorage.removeItem('graphicProcessing');
          }
        }, 300);
        
      } catch (error) {
        console.error('Error procesando comando de gráfica:', error);
        localStorage.removeItem('chatBotGraphicRequest');
        localStorage.removeItem('graphicProcessing');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const handleCustomEvent = () => {
      const graphicRequest = localStorage.getItem('chatBotGraphicRequest');
      if (graphicRequest) handleStorageChange({ key: 'chatBotGraphicRequest' });
    };
    window.addEventListener('chatBotGraphicUpdate', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chatBotGraphicUpdate', handleCustomEvent);
    };
  }, []);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate('/login', { replace: true });
    } else {
      alert('Error al cerrar sesión');
    }
  };

  const descargarGrafica = async (ref, nombre) => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        ignoreElements: (elemento) => elemento.tagName === 'BUTTON'
      });
      
      const imagen = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imagen;
      link.download = `grafica-${nombre}-${new Date().toISOString().split('T')[0]}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar la gráfica:', error);
    }
  };

  if (!session || loading) return <div className="graficas-loading">Cargando métricas...</div>;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-logo" src="/favicon.png" alt="Logo Iglesia Remanente" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Remanente</span>
            <span className="sidebar-brand-sub">Cali</span>
          </div>
        </div>
        <span className="sidebar-label">Menú General</span>
        <nav className="sidebar-nav">
          <a href="/asistencia/listado" className="nav-item">
            <i className="fas fa-check-square"></i> Registrar Asistencias
          </a>
          <a href="/asistencia/registros" className="nav-item">
            <i className="fas fa-clipboard-list"></i> Listado de Registros
          </a>
          <a href="/asistencia/graficas" className="nav-item active">
            <i className="fas fa-chart-bar"></i> Gráficas
          </a>
        </nav>

        <span className="sidebar-label">Herramientas para el Camino</span>
        <nav className="sidebar-nav">
          <a href="/asistencia/herramientas/listado" className="nav-item">
            <i className="fas fa-check-square"></i> Registrar Asistencia
          </a>
          <a href="/asistencia/herramientas/registros" className="nav-item">
            <i className="fas fa-clipboard-list"></i> Listado de Registros
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{session.nombre}</div>
              <div className="sidebar-user-role">{session.rol} · Remanente</div>
            </div>
          </div>
        </div>
      </aside>

      <header className="navbar">
        <div style={{ flex: 1 }}></div>
        <div className="graficas-navbar-right">
          <div className="user-avatar graficas-user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
            {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
          </div>
          {showUserMenu && (
            <div className="graficas-user-menu">
              <div className="graficas-user-menu-content">
                <a href="#" className="graficas-user-menu-item">
                  <i className="fas fa-user graficas-user-menu-icon"></i> <span>Mi Perfil</span>
                </a>
                <div className="graficas-user-menu-divider"></div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="graficas-user-menu-item danger">
                  <i className="fas fa-arrow-right-from-bracket graficas-user-menu-icon"></i> <span>Cerrar Sesión</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Gráficas</h1>
            <p className="page-subtitle">Análisis y reportes visuales</p>
          </div>
        </div>

        {/* CONTENEDOR GRÁFICA MENSUAL */}
        <div className="graficas-empty-container" ref={chartMonthRef}>
          <div style={{ paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const base = selectedMonth !== null ? selectedMonth : mesActual;
                  if (base > 1) setSelectedMonth(base - 1);
                }}
                style={{ padding: '6px 10px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
              >
                ← Anterior
              </button>
              <span style={{ fontSize: '17px', color: '#666', fontWeight: '500', minWidth: '120px', textAlign: 'center' }}>
                Mes: {mesNombre}
              </span>
              <button
                onClick={() => {
                  const base = selectedMonth !== null ? selectedMonth : mesActual;
                  if (base < 12) setSelectedMonth(base + 1);
                }}
                style={{ padding: '6px 10px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
              >
                Siguiente →
              </button>
            </div>
            <button onClick={() => descargarGrafica(chartMonthRef, mesNombre)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
              <i className="fas fa-download"></i> Descargar
            </button>
          </div>

          <div style={{ height: '400px', width: '100%' }}>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" />
                  <XAxis dataKey="diaLabel" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
                  <Bar dataKey="adultos" name="Adultos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jovenes" name="Jóvenes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ninos" name="Niños" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="nuevos" name="Nuevos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                <p>No hay datos de asistencias registrados para {mesNombre}</p>
              </div>
            )}
          </div>
        </div>

        {/* CONTENEDOR GRÁFICA ANUAL */}
        <div className="graficas-empty-container" style={{ marginTop: '40px' }} ref={chartYearRef}>
          <div style={{ paddingBottom: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: '17px', color: '#666', fontWeight: '500' }}>
              Visitas del año {anoActual}
            </span>
            <button onClick={() => descargarGrafica(chartYearRef, 'anual')} style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
              <i className="fas fa-download"></i> Descargar
            </button>
          </div>

          <div style={{ height: '400px', width: '100%' }}>
            {monthlyVisits.length > 0 && monthlyVisits.some(m => m.visitantes > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVisits} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px' }} />
                  <Bar dataKey="visitantes" name="Total de Visitantes" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    <Label dataKey="visitantes" position="top" fill="#1F2937" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                <p>No hay datos de visitas registrados para {anoActual}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}