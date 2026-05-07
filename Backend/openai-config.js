// ============================================
// CONFIGURACIÓN DE SEGURIDAD Y LÍMITES OPENAI
// ============================================

const OpenAI = require('openai');

// Configuración de límites
const CONFIG = {
  // Límite de caracteres por solicitud (evita requests masivas)
  MAX_INPUT_LENGTH: 2000,
  
  // Límite de tokens por día (aproximado: 1 token ≈ 4 caracteres)
  MAX_TOKENS_PER_DAY: 10000,
  
  // Límite de llamadas por minuto (rate limiting)
  MAX_CALLS_PER_MINUTE: 10,
  
  // Límite de tokens por call
  MAX_TOKENS_PER_CALL: 1000,
  
  // Modelo a usar (gpt-3.5-turbo es más barato que gpt-4)
  MODEL: 'gpt-4o-mini',
  
  // Temperatura (0-1): 0 = determinístico, 1 = creativo. Usar bajo para tareas específicas
  TEMPERATURE: 0.3,
  
  // Logs detallados
  ENABLE_LOGGING: true
};

// Tracker de uso diario
const usageTracker = {
  tokensUsedToday: 0,
  callsThisMinute: [],
  lastReset: new Date()
};

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ============================================
// VALIDACIÓN DE INPUT
// ============================================
function validateInput(texto) {
  const errors = [];
  
  // Verificar que existe y no está vacío
  if (!texto || texto.trim() === '') {
    errors.push('El texto de búsqueda es requerido');
  }
  
  // Verificar longitud máxima
  if (texto.length > CONFIG.MAX_INPUT_LENGTH) {
    errors.push(`El texto no puede exceder ${CONFIG.MAX_INPUT_LENGTH} caracteres. Actual: ${texto.length}`);
  }
  
  // Verificar que no contiene patrones sospechosos
  if (texto.toLowerCase().includes('ignore') || 
      texto.toLowerCase().includes('olvida') ||
      texto.toLowerCase().includes('system')) {
    errors.push('Solicitud contiene instrucciones sospechosas');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================
// RATE LIMITING
// ============================================
function checkRateLimit() {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Limpiar calls viejas (más de 1 minuto)
  usageTracker.callsThisMinute = usageTracker.callsThisMinute.filter(
    time => time > oneMinuteAgo
  );
  
  // Verificar límite
  if (usageTracker.callsThisMinute.length >= CONFIG.MAX_CALLS_PER_MINUTE) {
    return {
      allowed: false,
      message: `Límite de ${CONFIG.MAX_CALLS_PER_MINUTE} llamadas por minuto alcanzado`,
      callsThisMinute: usageTracker.callsThisMinute.length
    };
  }
  
  return { allowed: true };
}

// Registrar nueva llamada
function recordCall() {
  usageTracker.callsThisMinute.push(Date.now());
}

// ============================================
// CONTROL DE PRESUPUESTO
// ============================================
function checkDailyBudget(estimatedTokens) {
  // Resetear si es un nuevo día
  const now = new Date();
  const lastResetDate = usageTracker.lastReset.toDateString();
  
  if (now.toDateString() !== lastResetDate) {
    usageTracker.tokensUsedToday = 0;
    usageTracker.lastReset = now;
    log('🔄 Presupuesto de tokens reseteado para nuevo día');
  }
  
  const totalWouldBe = usageTracker.tokensUsedToday + estimatedTokens;
  
  if (totalWouldBe > CONFIG.MAX_TOKENS_PER_DAY) {
    return {
      allowed: false,
      message: `Presupuesto diario agotado. Usado: ${usageTracker.tokensUsedToday}, Límite: ${CONFIG.MAX_TOKENS_PER_DAY}`,
      tokensUsed: usageTracker.tokensUsedToday,
      tokensAvailable: CONFIG.MAX_TOKENS_PER_DAY - usageTracker.tokensUsedToday
    };
  }
  
  return { allowed: true };
}

// Estimar tokens (aproximado: 1 token ≈ 4 caracteres)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Registrar tokens usados
function recordTokenUsage(inputTokens, outputTokens) {
  usageTracker.tokensUsedToday += inputTokens + outputTokens;
}

// ============================================
// LOGGING DETALLADO
// ============================================
function log(message, data = null) {
  if (CONFIG.ENABLE_LOGGING) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🤖 OPENAI: ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
}

function logError(message, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ OPENAI ERROR: ${message}`);
  console.error(error);
}

// ============================================
// LLAMADA CONTROLADA A OPENAI
// ============================================
async function callOpenAI(userMessage, systemPrompt) {
  try {
    // 1. Validar input
    const validation = validateInput(userMessage);
    if (!validation.isValid) {
      log(`❌ Validación fallida: ${validation.errors.join(', ')}`);
      throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
    }
    
    // 2. Verificar rate limiting
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      log(`⏱️ Rate limit excedido`, rateLimit);
      throw new Error(rateLimit.message);
    }
    
    // 3. Estimar y verificar presupuesto
    const estimatedInputTokens = estimateTokens(userMessage + systemPrompt);
    const budgetCheck = checkDailyBudget(estimatedInputTokens);
    
    if (!budgetCheck.allowed) {
      log(`💰 Presupuesto excedido`, budgetCheck);
      throw new Error(budgetCheck.message);
    }
    
    // 4. Registrar que se va a hacer la llamada
    recordCall();
    log(`📤 Llamada a OpenAI`, {
      modelo: CONFIG.MODEL,
      inputLength: userMessage.length,
      estimatedTokens: estimatedInputTokens,
      tokensBudgetRemaining: CONFIG.MAX_TOKENS_PER_DAY - usageTracker.tokensUsedToday
    });
    
    // 5. Hacer la llamada
    const completion = await openai.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS_PER_CALL
    });
    
    // 6. Registrar tokens reales usados
    const inputTokens = completion.usage.prompt_tokens;
    const outputTokens = completion.usage.completion_tokens;
    recordTokenUsage(inputTokens, outputTokens);
    
    // 7. Log de éxito
    log(`✅ Llamada exitosa`, {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      tokensUsedToday: usageTracker.tokensUsedToday,
      tokensRemaining: CONFIG.MAX_TOKENS_PER_DAY - usageTracker.tokensUsedToday
    });
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens
      }
    };
    
  } catch (error) {
    logError('Error en callOpenAI', error);
    throw error;
  }
}

// ============================================
// OBTENER ESTADÍSTICAS
// ============================================
function getStats() {
  return {
    tokensUsedToday: usageTracker.tokensUsedToday,
    tokensAvailable: CONFIG.MAX_TOKENS_PER_DAY - usageTracker.tokensUsedToday,
    percentageUsed: ((usageTracker.tokensUsedToday / CONFIG.MAX_TOKENS_PER_DAY) * 100).toFixed(2),
    callsThisMinute: usageTracker.callsThisMinute.length,
    config: {
      maxInputLength: CONFIG.MAX_INPUT_LENGTH,
      maxTokensPerDay: CONFIG.MAX_TOKENS_PER_DAY,
      maxCallsPerMinute: CONFIG.MAX_CALLS_PER_MINUTE,
      model: CONFIG.MODEL
    }
  };
}

module.exports = {
  openai,
  callOpenAI,
  CONFIG,
  getStats,
  validateInput,
  checkRateLimit,
  checkDailyBudget
};
