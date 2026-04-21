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
              <i className="fas fa-hands-praying" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Intercesión</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* CNXN */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-users" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">CNXN</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* RemaKids */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-child" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">RemaKids</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Pastoral */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-heart" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Pastoral</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Alabanza */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-music" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Alabanza</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Servicio */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-handshake" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Servicio</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Evangelismo */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-bullhorn" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Evangelismo</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Creativo */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-palette" style={{ fontSize: '28px' }}></i>
            </div>
            <span className="ministerio-name">Creativo</span>
            <a href="#" className="ministerio-btn">Ver equipo →</a>
          </div>

          {/* Danza */}
          <div className="ministerio-card">
            <div className="ministerio-icon">
              <i className="fas fa-person-dancing" style={{ fontSize: '28px' }}></i>
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