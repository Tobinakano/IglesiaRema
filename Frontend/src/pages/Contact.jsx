import "../styles/global.css";
import "../styles/contact.css";

function Contact() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Contáctanos</h1>
          <div className="page-hero-rule"></div>
          <p className="page-hero-text">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
      </section>

      <section className="contacto-section">
        <div className="contacto-inner">
          <div className="contacto-grid">

            {/* FORMULARIO */}
            <div className="form-card">
              <p className="form-subtitle">Petición de oración</p>

              <textarea className="textarea-field" placeholder="Escribe tu petición de oración aquí..."></textarea>

              <div className="form-row">
                <div className="input-group half">
                  <input type="text" className="input-field" placeholder="Nombre"/>
                  <span className="required-mark">*</span>
                </div>
                <div className="input-group half">
                  <input type="text" className="input-field" placeholder="Apellido"/>
                  <span className="required-mark">*</span>
                </div>
              </div>

              <div className="input-group">
                <input type="tel" className="input-field" placeholder="Teléfono"/>
                <span className="required-mark">*</span>
              </div>

              <div className="input-group">
                <input type="email" className="input-field" placeholder="Correo"/>
                <span className="required-mark">*</span>
              </div>

              <p className="campos-nota"><span>*</span> Campos obligatorios</p>

              <button className="btn-registrar">Registrar</button>

              <p className="privacy-text">
                Tus datos serán tratados de forma segura, solo los necesitamos para conocerte y contactarte.
              </p>
            </div>

            {/* INFO DE CONTACTO */}
            <div className="info-card">
              <p className="info-title">Información de contacto</p>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="info-text">
                  <strong>Teléfono</strong>
                  +57 311 111 1111
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="info-text">
                  <strong>Correo</strong>
                  contacto@iglesia.com
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="info-text">
                  <strong>Dirección</strong>
                  Cali, Valle del Cauca
                </div>
              </div>

              <hr className="info-divider"/>

              <p className="mensaje-corto-label">Mensaje rápido</p>
              <div className="mensaje-corto-box">
                ¿Tienes una pregunta rápida? Escríbenos por WhatsApp y te respondemos pronto.
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact;
