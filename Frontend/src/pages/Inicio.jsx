import "../styles/global.css";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

function Inicio() {
  return (
    <main>

      <section className="hero">
        <div className="hero-bg"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="line1">Iglesia Cristiana</span>
            <span className="line2">
              <span className="dim">Remanente</span> Cali
            </span>
          </h1>

          <p className="hero-verse">
            "Texto del versículo aquí"
          </p>
        </div>
      </section>

      <section className="live-section">
        <div className="live-inner">
          <div className="section-heading">
            <h2>Transmisión en Vivo</h2>
            <div className="heading-rule"></div>
          </div>

          <div className="player-wrap">
            <div className="play-btn">▶</div>
          </div>
        </div>
      </section>

      <hr />
      {/* Carrusel */}
      <div className="section-heading">
        <h2>Nuestro Eventos</h2>
        <div className="heading-rule"></div>
      </div>
      <Carousel />

      <section className="platforms-section">
        <div className="platforms-inner">
          <div className="section-heading">
            <h2>Nuestras Plataformas</h2>
            <div className="heading-rule"></div>
          </div>

          <div className="platforms-grid">
            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <i className="fab fa-facebook" style={{ fontSize: '32px', color: '#1877F2' }}></i>
              </div>
              <span className="platform-name">Facebook</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <i className="fab fa-youtube" style={{ fontSize: '32px', color: '#FF0000' }}></i>
              </div>
              <span className="platform-name">YouTube</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <i className="fab fa-instagram" style={{ fontSize: '32px', background: 'linear-gradient(45deg, #fcb045, #fd1d1d, #833ab4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
              </div>
              <span className="platform-name">Instagram</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <i className="fab fa-tiktok" style={{ fontSize: '32px' }}></i>
              </div>
              <span className="platform-name">TikTok</span>
            </a>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-inner">

          <img src="/favicon.png" alt="Logo Iglesia Remanente Cali" className="info-logo" />

          <h2 className="info-church-name">
            Iglesia Cristiana <span className="dim">Remanente</span>
          </h2>

          <p className="info-location">Cali, Colombia</p>

          <ul className="info-list">

            {/* Dirección */}
            <li className="info-row">
              <div className="info-row-icon">
                <i className="fas fa-map-marker-alt" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="info-row-content">
                <div className="info-row-value">
                  Calle 10 #23-45, Barrio El Refugio, Cali, Valle del Cauca
                </div>
              </div>
            </li>

            {/* Domingo */}
            <li className="info-row">
              <div className="info-row-icon">
                <i className="fas fa-clock" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="info-row-content">
                <div className="info-row-label">Domingo</div>
                <div className="info-row-value">10:00 AM — Culto General</div>
              </div>
            </li>

            {/* Miércoles */}
            <li className="info-row">
              <div className="info-row-icon">
                <i className="fas fa-clock" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="info-row-content">
                <div className="info-row-label">Miércoles</div>
                <div className="info-row-value">7:00 PM — Herramientas para el Camino</div>
              </div>
            </li>

            {/* Sábado */}
            <li className="info-row">
              <div className="info-row-icon">
                <i className="fas fa-clock" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="info-row-content">
                <div className="info-row-label">Sábado</div>
                <div className="info-row-value">5:30 PM — Reunión de Jovenes CNXN</div>
              </div>
            </li>

          </ul>
        </div>
      </section>

      <section className="nuevo-section">
        <div className="nuevo-icon">
            <i className="fas fa-heart" style={{ fontSize: '48px', color: '#c9a84c' }}></i>
        </div>
        <h2 className="nuevo-title">¿Eres Nuevo?</h2>
        <p className="nuevo-sub">Nos encantaría conocerte. Ven y sé parte de nuestra familia.</p>
        <Link to="/contacto" className="btn-nuevo">Soy Nuevo</Link>
      </section>

    </main>
  )
}

export default Inicio