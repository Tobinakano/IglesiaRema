import "../styles/global.css";
import "../styles/donaciones.css";

function Donaciones() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Donaciones</h1>
          <div className="page-hero-rule"></div>
          <p className="page-hero-text">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
      </section>

      {/* SECCIÓN */}
      <section className="donaciones-section">
        <div className="donaciones-inner">

          {/* QR CARDS */}
          <div className="qr-grid">

            {/* QR 1 */}
            <div className="qr-card">
              <p className="qr-label">Nequi</p>
              <div className="qr-placeholder">
                <i className="fas fa-qrcode" style={{ fontSize: '80px', color: '#1a1a1a' }}></i>
              </div>
              <hr className="qr-divider"/>
              <div className="qr-info">
                <div className="qr-info-row">
                  <div className="qr-info-icon">@</div>
                  <div className="qr-info-text">
                    <strong>Usuario / Cuenta</strong>
                    @xxxxxxxxxx
                  </div>
                </div>
                <div className="qr-info-row">
                  <div className="qr-info-icon">#</div>
                  <div className="qr-info-text">
                    <strong>Número</strong>
                    +57 311 111 1111
                  </div>
                </div>
              </div>
            </div>

            {/* QR 2 */}
            <div className="qr-card">
              <p className="qr-label">Davivienda</p>
              <div className="qr-placeholder">
                <i className="fas fa-qrcode" style={{ fontSize: '80px', color: '#1a1a1a' }}></i>
              </div>
              <hr className="qr-divider"/>
              <div className="qr-info">
                <div className="qr-info-row">
                  <div className="qr-info-icon">@</div>
                  <div className="qr-info-text">
                    <strong>Usuario / Cuenta</strong>
                    @xxxxxxxxxx
                  </div>
                </div>
                <div className="qr-info-row">
                  <div className="qr-info-icon">#</div>
                  <div className="qr-info-text">
                    <strong>Número</strong>
                    +57 311 111 1111
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SOPORTE */}
          <div className="soporte-box">
            <p className="soporte-title">Enviar soporte</p>
            <p className="soporte-number">+57 111 111 11</p>
            <p className="soporte-text">
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>
              xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>
            <a href="https://wa.me/573111111111" className="btn-soporte" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp" style={{ fontSize: '20px', marginRight: '8px' }}></i>
              Enviar soporte
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Donaciones;
