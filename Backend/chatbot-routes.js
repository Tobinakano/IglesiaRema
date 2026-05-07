// ============================================
// RUTAS DEL CHATBOT INTELIGENTE
// ============================================

const express = require('express');
const router = express.Router();
const { callOpenAI } = require('./openai-config');
const { 
  procesarMensajeChat, 
  detectarComandoGrafica,
  obtenerNombreMes 
} = require('./chatbot-service');

// ============================================
// Middleware de autenticación
// ============================================
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

// ============================================
// POST /api/chat - Procesar mensaje del chatbot
// ============================================
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, page = 'graficas', year = new Date().getFullYear() } = req.body;
    
    // Validar input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }
    
    // Procesar mensaje y detectar comandos
    const procesamiento = await procesarMensajeChat(message, page, year);
    
    if (procesamiento.error) {
      return res.status(500).json({ error: procesamiento.error });
    }
    
    // Llamar a OpenAI con context
    let respuestaIA;
    let respuestaCompleta = '';
    
    try {
      respuestaIA = await callOpenAI(message, procesamiento.systemPrompt);
      respuestaCompleta = respuestaIA.content;
    } catch (error) {
      console.error('Error llamando OpenAI:', error);
      respuestaCompleta = "Disculpa, tengo un problema técnico. Por favor intenta de nuevo.";
    }
    
    // Respuesta para gráficas
    let grafica = null;
    if (procesamiento.esComandoGrafica && procesamiento.datosGrafica) {
      grafica = {
        tipo: procesamiento.tipoGrafica,
        mes: procesamiento.mesGrafica,
        nombreMes: procesamiento.mesGrafica ? obtenerNombreMes(procesamiento.mesGrafica) : null,
        datos: procesamiento.datosGrafica,
        year: year
      };
    }
    
    // Enviar respuesta
    res.json({
      success: true,
      mensaje: respuestaCompleta,
      isComandoGrafica: procesamiento.esComandoGrafica,
      grafica: grafica,
      contexto: {
        pagina: page,
        year: year
      }
    });
    
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ 
      error: 'Error procesando mensaje',
      details: error.message 
    });
  }
});

// ============================================
// GET /api/chat/stats - Obtener estadísticas de uso
// ============================================
router.get('/stats', requireAuth, (req, res) => {
  try {
    const { getStats } = require('./openai-config');
    const stats = getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

module.exports = router;
