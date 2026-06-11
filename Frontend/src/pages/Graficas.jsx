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
  Label,
  LineChart,
  Line
} from 'recharts';
import '../styles/graficas.css';

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
        const response = await fetch('/api/session', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          if (data.rol !== 'Asistencias') {
            navigate('/admin');
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
        // Cargar datos de todos los meses
        const mesesData = {};
        const mesesNombresArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        for (let mes = 1; mes <= 12; mes++) {
          const mesStr = String(mes).padStart(2, '0');
          const resGraficas = await fetch(`/api/asistencia/graficas/${anoActual}-${mesStr}`, { credentials: 'include' });
          if (resGraficas.ok) {
            const datos = await resGraficas.json();
            const datosTransformados = datos.map(item => {
              const fecha = new Date(item.fecha + 'T00:00:00');
              const diaLabel = fecha.toLocaleDateString('es-ES', { 
                day: 'numeric',
                month: 'short'
              });
              
              return {
                ...item,
                adultos: item.adultos || 0,
                jovenes: item.jóvenes || 0,
                ninos: item.niños || 0,
                diaLabel: diaLabel,
                mes: fecha.getMonth() + 1
              };
            });
            mesesData[mes] = datosTransformados;
          }
        }
        
        setAllMonthsData(mesesData);
        const datosDelMesActual = mesesData[mesActual] || [];
        setChartData(datosDelMesActual);

        // Procesar datos anuales
        const mesesDataAnual = {};
        mesesNombresArray.forEach((nombre, index) => {
          mesesDataAnual[index + 1] = {
            mes: nombre,
            visitantes: 0
          };
        });

        Object.values(mesesData).forEach((datosDelMes, mesIndex) => {
          datosDelMes.forEach(item => {
            const totalPersonas = (item.adultos || 0) + (item.jovenes || 0) + (item.ninos || 0);
            mesesDataAnual[mesIndex + 1].visitantes += totalPersonas;
          });
        });

        const visitasAnuales = Object.values(mesesDataAnual);
        setMonthlyVisits(visitasAnuales);
      } catch (error) {
        console.error('Error cargando gráficas:', error);
      }

      setLoading(false);
    };
    
    iniciar();
  }, [navigate]);

  useEffect(() => {
    // Actualizar chartData cuando cambia selectedMonth
    if (selectedMonth && allMonthsData[selectedMonth]) {
      setChartData(allMonthsData[selectedMonth]);
    } else if (mesActual && allMonthsData[mesActual]) {
      setChartData(allMonthsData[mesActual]);
    }
  }, [selectedMonth, allMonthsData, mesActual]);

  // Escuchar cambios en localStorage para comandos de gráficas desde el ChatBot
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Solo procesar si la clave es 'chatBotGraphicRequest'
      if (event.key !== 'chatBotGraphicRequest') return;
      
      const graphicRequest = localStorage.getItem('chatBotGraphicRequest');
      if (!graphicRequest) return;

      try {
        const grafica = JSON.parse(graphicRequest);
        console.log('📊 Solicitud de gráfica recibida:', grafica);
        
        // Generar ID único para esta solicitud
        const requestId = Date.now();
        localStorage.setItem('graphicProcessing', requestId.toString());

        if (grafica.tipo === 'mensual' && grafica.datos && grafica.datos.length > 0) {
          // Actualizar gráfica mensual
          const datosDelMes = grafica.datos.map(item => ({
            diaLabel: new Date(item.dia).getDate().toString(),
            adultos: item.adultos || 0,
            jovenes: item.jovenes || 0,
            ninos: item.ninos || 0
          }));
          console.log('📅 Datos del mes actualizados:', datosDelMes);
          setChartData(datosDelMes);
          
          // Actualizar mes seleccionado
          if (grafica.mes) {
            setSelectedMonth(grafica.mes);
          }
        } else if ((grafica.tipo === 'anual' || grafica.tipo === 'circular') && grafica.datos) {
          // Actualizar gráfica anual/circular
          const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const datosAnuales = grafica.datos.map(item => ({
            mes: meses[parseInt(item.mes) - 1],
            visitantes: item.total || 0
          }));
          console.log('📈 Datos anuales actualizados:', datosAnuales);
          setMonthlyVisits(datosAnuales);
        }
        
        // Confirmar procesamiento
        setTimeout(() => {
          const currentId = localStorage.getItem('graphicProcessing');
          if (currentId === requestId.toString()) {
            localStorage.setItem('graphicUpdatedConfirm', 'true');
            localStorage.removeItem('chatBotGraphicRequest');
            localStorage.removeItem('graphicProcessing');
            console.log('✅ Gráfica actualizada exitosamente');
          }
        }, 300);
        
      } catch (error) {
        console.error('Error procesando comando de gráfica:', error);
        localStorage.removeItem('chatBotGraphicRequest');
        localStorage.removeItem('graphicProcessing');
      }
    };

    // Escuchar cambios en storage desde otras pestañas
    window.addEventListener('storage', handleStorageChange);

    // También escuchar evento personalizado
    const handleCustomEvent = () => {
      const graphicRequest = localStorage.getItem('chatBotGraphicRequest');
      if (graphicRequest) {
        handleStorageChange({ key: 'chatBotGraphicRequest' });
      }
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
        // Filtra directamente por el tipo de etiqueta HTML
        ignoreElements: (elemento) => {
          return elemento.tagName === 'BUTTON'; 
        }
      });
      
      const imagen = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = imagen;
      link.download = `grafica-${nombre}-${new Date().toISOString().split('T')[0]}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error descargando gráfica:', error);
      alert('Error al descargar la gráfica');
    }
  };

  if (!session || loading) return <div className="graficas-loading">Cargando...</div>;

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
          <a href="/asistencia/graficas" className="nav-item active">
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
        <div className="graficas-navbar-right">
          <div 
            className="user-avatar graficas-user-avatar"
            title="Mi perfil"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {session.nombre ? session.nombre[0].toUpperCase() : 'A'}
          </div>
          
          {showUserMenu && (
            <div className="graficas-user-menu">
              <div className="graficas-user-menu-content">
                <a href="#" className="graficas-user-menu-item">
                  <i className="fas fa-user graficas-user-menu-icon"></i>
                  <span>Mi Perfil</span>
                </a>
                <a href="#" className="graficas-user-menu-item">
                  <i className="fas fa-gear graficas-user-menu-icon"></i>
                  <span>Configuración</span>
                </a>
                <div className="graficas-user-menu-divider"></div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="graficas-user-menu-item danger">
                  <i className="fas fa-arrow-right-from-bracket graficas-user-menu-icon"></i>
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
            <h1 className="page-title">Gráficas</h1>
            <p className="page-subtitle">Análisis y reportes visuales</p>
          </div>
        </div>

        <div className="graficas-empty-container" ref={chartMonthRef}>
          <div style={{ paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const nuevoMes = selectedMonth ? selectedMonth - 1 : mesActual - 1;
                  if (nuevoMes >= 1) {
                    setSelectedMonth(nuevoMes);
                    const datosDelMes = Object.values(chartData).length > 0 
                      ? chartData 
                      : [];
                  }
                }}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#e5e7eb',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                ← Anterior
              </button>
              <span style={{ fontSize: '17px', color: '#666', fontWeight: '500', minWidth: '120px', textAlign: 'center' }}>
                Mes: {mesNombre}
              </span>
              <button
                onClick={() => {
                  const nuevoMes = selectedMonth ? selectedMonth + 1 : mesActual + 1;
                  if (nuevoMes <= 12) {
                    setSelectedMonth(nuevoMes);
                  }
                }}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#e5e7eb',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                Siguiente →
              </button>
            </div>
            <button 
              onClick={() => descargarGrafica(chartMonthRef, mesNombre)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <i className="fas fa-download" style={{ fontSize: '13px' }}></i>
              Descargar
            </button>
          </div>

          <div style={{ height: '400px', width: '100%' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" />
                  <XAxis 
                    dataKey="diaLabel" 
                    label={{ value: 'Fechas de Registro', position: 'insideBottomRight', offset: -10 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Cantidad de Personas', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
                  <Bar dataKey="adultos" name="Adultos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="jovenes" name="Jóvenes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ninos" name="Niños" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                <p>No hay datos de asistencias registrados para {mesNombre}</p>
              </div>
            )}
          </div>
        </div>

        <div className="graficas-empty-container" style={{ marginTop: '40px' }} ref={chartYearRef}>
          <div style={{ paddingBottom: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ fontSize: '17px', color: '#666', fontWeight: '500' }}>
              Visitas del año {anoActual}
            </span>
            <button 
              onClick={() => descargarGrafica(chartYearRef, 'anual')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                position: 'absolute',
                right: 0
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <i className="fas fa-download" style={{ fontSize: '13px' }}></i>
              Descargar
            </button>
          </div>

          <div style={{ height: '400px', width: '100%' }}>
            {monthlyVisits.length > 0 && monthlyVisits.some(m => m.visitantes > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVisits} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e6ea" />
                  <XAxis 
                    dataKey="mes" 
                    label={{ value: 'Meses', position: 'insideBottomRight', offset: -10 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Total de Personas', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e4e6ea', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar dataKey="visitantes" name="Total de Visitantes" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    <Label 
                      dataKey="visitantes"
                      position="top"
                      fill="#1F2937"
                      fontSize={12}
                    />
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
