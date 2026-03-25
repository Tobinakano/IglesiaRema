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
                {/* QR decorativo SVG */}
                <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                  <rect width="140" height="140" fill="#fafafa"/>
                  {/* esquina sup izq */}
                  <rect x="10" y="10" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="18" y="18" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  {/* esquina sup der */}
                  <rect x="94" y="10" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="102" y="18" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  {/* esquina inf izq */}
                  <rect x="10" y="94" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="18" y="102" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  {/* puntos centro */}
                  <rect x="54" y="10" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="10" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="10" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="20" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="20" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="30" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="30" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="10" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="20" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="30" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="10" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="30" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="10" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="20" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="30" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="124" width="6" height="6" fill="#1a1a1a"/>
                </svg>
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
                <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                  <rect width="140" height="140" fill="#fafafa"/>
                  <rect x="10" y="10" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="18" y="18" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  <rect x="94" y="10" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="102" y="18" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  <rect x="10" y="94" width="36" height="36" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                  <rect x="18" y="102" width="20" height="20" rx="2" fill="#1a1a1a"/>
                  <rect x="54" y="10" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="10" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="20" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="30" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="30" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="10" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="30" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="20" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="10" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="30" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="54" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="64" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="74" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="84" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="54" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="64" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="74" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="114" y="94" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="104" y="104" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="94" y="114" width="6" height="6" fill="#1a1a1a"/>
                  <rect x="124" y="114" width="6" height="6" fill="#1a1a1a"/>
                </svg>
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
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Enviar soporte
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Donaciones;
