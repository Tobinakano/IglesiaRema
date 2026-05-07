// ============================================
// SERVICIO DE CHATBOT INTELIGENTE
// ============================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'personas.db');
const db = new sqlite3.Database(dbPath);

// ============================================
// MAPEO DE INFORMACIÓN DISPONIBLE POR PÁGINA
// ============================================
const pageContexts = {
  graficas: {
    nombre: "Gráficas de Asistencias",
    descripcion: "Página con estadísticas de asistencia mensual y anual",
    datosDisponibles: ["gráfica mensual", "gráfica anual", "estadísticas de asistencia", "datos de visitas"],
    comandosEspeciales: ["gráfica de [mes]", "gráfica [tipo] de [mes]", "gráfica circular", "cambiar mes", "mes de"]
  },
  asistencias: {
    nombre: "Registro de Asistencias",
    descripcion: "Página para registrar asistencias por grupo",
    datosDisponibles: ["registro de asistencia", "grupos (Niños, Jóvenes, Adultos)", "control de asistencias"],
    comandosEspeciales: []
  },
  listado: {
    nombre: "Listado de Asistencias",
    descripcion: "Página con historial de registros de asistencia",
    datosDisponibles: ["historial de asistencias", "registros por fecha", "detalles de asistencias"],
    comandosEspeciales: []
  },
  personas: {
    nombre: "Personas Registradas",
    descripcion: "Lista de miembros registrados en la iglesia",
    datosDisponibles: ["directorio de personas", "información de miembros", "control de registros"],
    comandosEspeciales: []
  },
  flayers: {
    nombre: "Administración de Flayers",
    descripcion: "Gestión de carruseles (flayers) de la iglesia",
    datosDisponibles: ["información de flayers", "carrusel de imágenes"],
    comandosEspeciales: []
  }
};

// ============================================
// DETECTAR COMANDOS DE GRÁFICA (CON APRENDIZAJE)
// ============================================

// Almacenar patrones aprendidos en memoria (durante la sesión)
const learnedPatterns = [];

function detectarComandoGrafica(mensaje) {
  const msg = mensaje.toLowerCase().trim();
  
  // 1. Intentar con patrones aprendidos primero (más rápido)
  const resultadoAprendido = buscarPatronAprendido(msg);
  if (resultadoAprendido) {
    console.log('✅ Comando reconocido por patrón aprendido:', resultadoAprendido);
    return resultadoAprendido;
  }
  
  // 2. Intentar con regex mejorado (palabras clave expandidas)
  const resultado = detectarComandoGraficaConRegex(msg);
  if (resultado) {
    console.log('✅ Comando detectado por regex:', resultado);
    // Guardar este patrón para aprender
    guardarPatronAprendido(msg, resultado);
    return resultado;
  }
  
  console.log('❌ Comando no detectado:', msg);
  return null;
}

// ============================================
// BÚSQUEDA POR PATRONES APRENDIDOS
// ============================================
function buscarPatronAprendido(mensaje) {
  for (let patron of learnedPatterns) {
    // Verificar similitud simple: si el patrón está contenido en el mensaje
    if (mensaje.includes(patron.patrón)) {
      return {
        esComandoGrafica: true,
        tipo: patron.tipo,
        mes: patron.mes,
        comando: mensaje,
        fuente: 'patrón aprendido'
      };
    }
  }
  return null;
}

// ============================================
// GUARDAR PATRONES APRENDIDOS
// ============================================
function guardarPatronAprendido(mensaje, resultado) {
  // Extraer palabras clave del mensaje para crear patrón
  const palabrasClave = extraerPalabrasClavé(mensaje);
  
  if (resultado.mes) {
    learnedPatterns.push({
      patrón: palabrasClave,
      mes: resultado.mes,
      tipo: resultado.tipo || 'mensual',
      contador: 1
    });
    
    // Limitar a 50 patrones máximo
    if (learnedPatterns.length > 50) {
      learnedPatterns.shift();
    }
    
    console.log('📚 Nuevo patrón aprendido:', palabrasClave, '→ mes:', resultado.mes);
  }
}

// ============================================
// EXTRAER PALABRAS CLAVE COMUNES
// ============================================
function extraerPalabrasClavé(mensaje) {
  // Extraer la parte más representativa del mensaje
  // Por ej: "dame la gráfica de asistencias del mes de abril" → "gráfica asistencias mes"
  const palabrasImportantes = [
    'gráfica', 'grafica', 'asistencias', 'visitas', 'registros',
    'mes', 'mensual', 'anual', 'año',
    'dame', 'muestra', 'dime', 'quiero', 'necesito', 'ver', 'mostrar'
  ];
  
  const palabras = mensaje.split(/\s+/).filter(p => 
    palabrasImportantes.some(imp => p.includes(imp))
  );
  
  return palabras.slice(0, 3).join(' '); // Primeras 3 palabras importantes
}

// ============================================
// DETECCIÓN CON REGEX MEJORADO
// ============================================
function detectarComandoGraficaConRegex(msg) {
  // Patrones MUCHO más flexibles y naturales
  const patronComando = /gráfica|grafica|chart|gráfico|grafico|asistencia|asistencias|visita|visitas|registro|registros|datos|informe|reporte|reportes/i;
  const patronMes = /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|mes de|de (\d+))/i;
  const patronTipo = /(mensual|anual|circular|pie|barras|lineal|line|bar|donut|dona|año|mes)/i;
  
  // Debe contener una palabra de comando
  if (!patronComando.test(msg)) {
    return null;
  }
  
  // Extraer tipo de gráfica
  let tipo = 'mensual'; // default
  const matchTipo = msg.match(patronTipo);
  if (matchTipo) {
    const tipoEncontrado = matchTipo[1].toLowerCase();
    if (tipoEncontrado.includes('anual') || tipoEncontrado.includes('año')) tipo = 'anual';
    if (tipoEncontrado.includes('circular') || tipoEncontrado.includes('pie') || tipoEncontrado.includes('donut') || tipoEncontrado.includes('dona')) tipo = 'circular';
    if (tipoEncontrado.includes('mensual') || tipoEncontrado.includes('mes')) tipo = 'mensual';
  }
  
  // Extraer mes
  let mes = null;
  const mesesMap = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
    julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
  };
  
  const matchMes = msg.match(patronMes);
  if (matchMes) {
    const mesEncontrado = matchMes[1].toLowerCase();
    for (let [mesNombre, mesNum] of Object.entries(mesesMap)) {
      if (mesEncontrado.includes(mesNombre)) {
        mes = mesNum;
        break;
      }
    }
    // Si encontró número de mes
    if (!mes && /\d+/.test(mesEncontrado)) {
      mes = parseInt(mesEncontrado);
    }
  }
  
  // Solo retornar si encontró un mes válido
  if (mes && mes >= 1 && mes <= 12) {
    return {
      esComandoGrafica: true,
      tipo,
      mes,
      comando: msg
    };
  }
  
  return null;
}

// ============================================
// OBTENER DATOS PARA GRÁFICAS
// ============================================
function obtenerDatosGrafica(tipo, mes, ano) {
  return new Promise((resolve, reject) => {
    let query;
    let params;
    
    if (tipo === 'mensual' && mes) {
      // Gráfica mensual de un mes específico - desglose por grupo
      query = `
        SELECT 
          DATE(fecha) as dia,
          SUM(CASE WHEN grupo = 'Adultos' THEN 1 ELSE 0 END) as adultos,
          SUM(CASE WHEN grupo = 'Jóvenes' THEN 1 ELSE 0 END) as jovenes,
          SUM(CASE WHEN grupo = 'Niños' THEN 1 ELSE 0 END) as ninos,
          COUNT(*) as total
        FROM asistencia_registros
        WHERE strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?
        GROUP BY DATE(fecha)
        ORDER BY dia ASC
      `;
      params = [String(mes).padStart(2, '0'), String(ano)];
    } else if (tipo === 'anual') {
      // Gráfica anual - total por mes
      query = `
        SELECT 
          strftime('%m', fecha) as mes,
          COUNT(*) as total
        FROM asistencia_registros
        WHERE strftime('%Y', fecha) = ?
        GROUP BY strftime('%m', fecha)
        ORDER BY mes ASC
      `;
      params = [String(ano)];
    } else if (tipo === 'circular') {
      // Gráfica circular - total por mes
      query = `
        SELECT 
          strftime('%m', fecha) as mes,
          COUNT(*) as total
        FROM asistencia_registros
        WHERE strftime('%Y', fecha) = ?
        GROUP BY strftime('%m', fecha)
        ORDER BY mes ASC
      `;
      params = [String(ano)];
    }
    
    if (!query) {
      resolve([]);
      return;
    }
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error obteniendo datos gráfica:', err);
        console.error('Query:', query);
        console.error('Params:', params);
        resolve([]);
      } else {
        console.log('📊 Datos obtenidos para gráfica:', rows);
        resolve(rows || []);
      }
    });
  });
}

// ============================================
// CONSTRUIR SYSTEM PROMPT CONTEXTUALIZADO
// ============================================
function construirSystemPrompt(page, ano) {
  const contexto = pageContexts[page] || pageContexts.graficas;
  
  let prompt = `Eres un asistente inteligente de la Iglesia Remanente. 
Estás ayudando a un usuario que se encuentra en la página: "${contexto.nombre}".

CONTEXTO DE PÁGINA:
- ${contexto.descripcion}
- Datos disponibles: ${contexto.datosDisponibles.join(', ')}

INSTRUCCIONES:
1. Si el usuario pregunta sobre información de la página actual, proporciona respuestas útiles.
2. Si el usuario pide una gráfica, responde amablemente que le mostrarás la gráfica en la página.
3. Sé breve y conciso (máximo 2 párrafos).
4. Habla en español de manera amigable y profesional.
5. Si no sabes algo específico, sugiere al usuario verificar en la página o en el administrador.

Año actual para contexto: ${ano}`;

  return prompt;
}

// ============================================
// PROCESAR MENSAJE DEL CHATBOT
// ============================================
async function procesarMensajeChat(mensaje, page = 'graficas', ano = new Date().getFullYear()) {
  try {
    // Detectar si es comando de gráfica
    const comandoGrafica = detectarComandoGrafica(mensaje);
    
    // Construir system prompt
    const systemPrompt = construirSystemPrompt(page, ano);
    
    // Obtener contexto de página
    const contexto = pageContexts[page] || pageContexts.graficas;
    
    // Si es un comando de gráfica, obtener datos
    let datosGrafica = null;
    if (comandoGrafica && comandoGrafica.esComandoGrafica) {
      const mes = comandoGrafica.mes || new Date().getMonth() + 1;
      datosGrafica = await obtenerDatosGrafica(comandoGrafica.tipo, mes, ano);
    }
    
    return {
      esComandoGrafica: comandoGrafica ? comandoGrafica.esComandoGrafica : false,
      tipoGrafica: comandoGrafica ? comandoGrafica.tipo : null,
      mesGrafica: comandoGrafica ? comandoGrafica.mes : null,
      datosGrafica: datosGrafica,
      systemPrompt: systemPrompt,
      contexto: contexto
    };
  } catch (error) {
    console.error('Error procesando mensaje:', error);
    return {
      esComandoGrafica: false,
      error: error.message
    };
  }
}

// ============================================
// GENERAR NOMBRE DE MES
// ============================================
function obtenerNombreMes(numeroMes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[numeroMes - 1] || 'Mes desconocido';
}

module.exports = {
  procesarMensajeChat,
  detectarComandoGrafica,
  obtenerDatosGrafica,
  construirSystemPrompt,
  pageContexts,
  obtenerNombreMes
};
