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
                  <i className="fas fa-phone" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="info-text">
                  <strong>Teléfono</strong>
                  +57 311 111 1111
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-envelope" style={{ fontSize: '24px' }}></i>
                </div>
                <div className="info-text">
                  <strong>Correo</strong>
                  contacto@iglesia.com
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '24px' }}></i>
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
