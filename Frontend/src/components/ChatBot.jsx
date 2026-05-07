import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/chatbot.css';
import ChartRenderer from './ChartRenderer';

export default function ChatBot() {
  const location = useLocation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola! ¿En qué te puedo ayudar hoy? Puedo responderte sobre la página actual o generar gráficas personalizadas.', time: 'ahora' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Limpiar localStorage al montar
  useEffect(() => {
    localStorage.removeItem('chatBotGraphicRequest');
    localStorage.removeItem('graphicUpdatedConfirm');
  }, []);

  // Detectar página actual
  const getPageContext = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('graficas')) return 'graficas';
    if (path.includes('listado')) return 'listado';
    if (path.includes('asistencia') && !path.includes('listado')) return 'asistencias';
    if (path.includes('personas')) return 'personas';
    if (path.includes('flayers')) return 'flayers';
    return 'graficas';
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // Agregar mensaje del usuario
    const userMessage = { type: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Enviar al endpoint del chatbot
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          page: getPageContext(),
          year: new Date().getFullYear()
        })
      });

      if (!response.ok) {
        throw new Error('Error comunicándose con el servidor');
      }

      const data = await response.json();

      // Si es comando de gráfica y estamos en la página de Gráficas
      if (data.isComandoGrafica && data.grafica && getPageContext() === 'graficas') {
        // Mostrar mensaje de procesamiento
        const processingMsg = {
          type: 'bot',
          text: '⏳ Actualizando gráfica...',
          time: getTime()
        };
        setMessages(prev => [...prev, processingMsg]);

        // Guardar en localStorage para que Graficas.jsx lo procese
        localStorage.setItem('chatBotGraphicRequest', JSON.stringify(data.grafica));
        
        // Disparar evento
        window.dispatchEvent(new Event('chatBotGraphicUpdate'));

        // Esperar confirmación (max 2s)
        await new Promise(resolve => {
          let resolved = false;
          const checkConfirm = () => {
            const updated = localStorage.getItem('graphicUpdatedConfirm');
            if (updated === 'true' && !resolved) {
              resolved = true;
              localStorage.removeItem('graphicUpdatedConfirm');
              resolve();
            }
          };
          const interval = setInterval(checkConfirm, 100);
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              clearInterval(interval);
              resolve();
            }
          }, 2000);
        });

        // Mostrar confirmación
        const confirmMsg = {
          type: 'bot',
          text: '✅ Gráfica actualizada',
          time: getTime()
        };
        setMessages(prev => [...prev, confirmMsg]);
      } else {
        // Mensaje normal
        const botMessage = {
          type: 'bot',
          text: data.mensaje,
          time: getTime()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        text: '❌ Error: ' + error.message,
        time: getTime()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSend = (text) => {
    setInputValue(text);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Botón flotante */}
      {!isPanelOpen && (
        <button
          className="chat-fab"
          onClick={() => setIsPanelOpen(true)}
          title="Abrir chat"
          aria-label="Abrir chat"
        >
          <img src="/favicon.png" alt="Chat" className="chat-fab-icon" />
        </button>
      )}

      {/* Panel del chat */}
      <div className={`chat-panel ${isPanelOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-avatar">
            <img src="/logo-negro.png" alt="Asistente" className="chat-avatar-img" />
          </div>
          <div className="chat-header-info">
            <div className="chat-header-name">Asistente</div>
            <div className="chat-header-status">
              <span className="status-dot"></span>En línea
            </div>
          </div>
          <button
            className="chat-close-btn"
            onClick={() => setIsPanelOpen(false)}
            aria-label="Cerrar chat"
          >
            ×
          </button>
        </div>

        {/* Mensajes */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`msg msg-${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="msg-avatar">
                  <img src="/logo-negro.png" alt="Bot" className="chat-avatar-img" />
                </div>
              )}
              <div className="msg-content">
                <div className={`msg-bubble msg-bubble-${msg.type}`}>
                  {msg.text}
                </div>
                {msg.grafica && <ChartRenderer grafica={msg.grafica} />}
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="msg msg-bot">
              <div className="msg-avatar">
                <img src="/logo-negro.png" alt="Bot" className="chat-avatar-img" />
              </div>
              <div className="msg-content">
                <div className="msg-bubble msg-bubble-bot">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones rápidos */}
        <div className="quick-btns">
          <button className="quick-btn" onClick={() => handleQuickSend('¿Cómo funciona?')}>
            ¿Cómo funciona?
          </button>
          <button className="quick-btn" onClick={() => handleQuickSend('Ayuda')}>
            Ayuda
          </button>
          <button className="quick-btn" onClick={() => handleQuickSend('Contáctanos')}>
            Contacto
          </button>
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <textarea
            className="chat-input"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // Auto-resize textarea
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            rows="1"
          />
          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Enviar mensaje"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
