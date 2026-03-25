import "../styles/global.css";
import "../styles/equipos.css";

function Equipos() {
  return (
    <main>

      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-hero-title">Equipos Remanente</h1>
          <div className="page-hero-rule"></div>
          <p className="page-hero-text">
            Cada equipo es una expresión del cuerpo de Cristo en acción.
            Encuentra tu lugar y sirve con propósito.
          </p>
        </div>
      </section>

      {/* EQUIPOS */}
      
      <section className="ministerios-section">
        <div class="section-heading">
                <h2>Nuestros Equipos</h2>
                <div class="heading-rule"></div>
            </div>
        <div className="ministerios-grid">
          {/* Intercesión */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Intercesión</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* CNXN */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">CNXN</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* RemaKids */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">RemaKids</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Pastoral */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Pastoral</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Alabanza */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Alabanza</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Servicio */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Servicio</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Evangelismo */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Evangelismo</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Creativo */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Creativo</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Danza */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="ministerio-name">Danza</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Equipos