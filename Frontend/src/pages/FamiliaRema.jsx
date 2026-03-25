import "../styles/global.css";
import "../styles/familiarema.css";

function FamiliaRema() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Familia Remanente</h1>
          <div className="page-hero-rule"></div>
          <p className="page-hero-text">
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="intro-section">
        <div className="intro-inner">
          <div className="section-heading">
            <h2>¿Quiénes somos?</h2>
            <div className="heading-rule"></div>
          </div>
          <p className="intro-body">
            Somos <strong>Iglesia Cristiana Remanente Cali</strong>, xxxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
          <p className="intro-body" style={{ marginTop: "20px" }}>
            Desde Cali, Colombia, xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
        </div>
      </section>
      <hr />
      <section className="mv-section">
        <div className="section-heading">
          <h2>Misión & Visión</h2>
          <div className="heading-rule"></div>
        </div>
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="12" x2="14.5" y2="14.5" />
              </svg>
            </div>
            <div className="mv-card-title">Misión</div>
            <p className="mv-card-text">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="mv-card-title">Visión</div>
            <p className="mv-card-text">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
        </div>
      </section>

      {/* Pastores */}
      <section className="pastores-section">
        <div className="pastores-inner">
          <div className="section-heading light">
            <h2>Nuestros Pastores</h2>
            <div className="heading-rule"></div>
          </div>
          <div className="pastores-grid">
            {/* Columna izquierda: imagen */}
            <div className="pastores-img-wrap">
              <div className="pastores-img-frame">
                <div className="pastores-img-placeholder">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Foto de los pastores</span>
                </div>
              </div>
            </div>

            {/* Columna derecha: info */}
            <div className="pastores-info">

              <div className="pastor-name">Pastor Jonh Jairo</div>
              <div className="pastor-name">Pastora Ana Maria</div>

              <div className="pastores-divider"></div>

              <p className="pastores-bio">
                <strong></strong>
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </p>
              <p className="pastores-bio" style={{ marginTop: "16px" }}>
                Juntos pastorean a la familia Remanente Cali con el corazón puesto en ver cada vida transformada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="servicios-section">
        <div className="servicios-inner">
          <div className="section-heading">
            <h2>Nuestros Servicios</h2>
            <div className="heading-rule"></div>
          </div>
          <div className="platforms-grid">
            <div className="servicio-card">
              <div className="servicio-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="servicio-name">Servicio Familiar</div>
              <div className="servicio-day">Domingo</div>
              <div className="servicio-time">10:00</div>
              <div className="servicio-ampm">AM</div>
            </div>
            <div className="servicio-card">
              <div className="servicio-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div className="servicio-name">Herramientas Para El Camino</div>
              <div className="servicio-day">Miércoles</div>
              <div className="servicio-time">7:00</div>
              <div className="servicio-ampm">PM</div>
            </div>
            <div className="servicio-card">
              <div className="servicio-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="servicio-name">Reunión De Jóvenes CNXN</div>
              <div className="servicio-day">Sábado</div>
              <div className="servicio-time">5:30</div>
              <div className="servicio-ampm">PM</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FamiliaRema;