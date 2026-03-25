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
              <span className="dim">hola</span> Cali
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
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="platform-name">Facebook</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <svg viewBox="0 0 24 24">
                  <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                  <polygon fill="#FFFFFF" points="9.545,15.568 15.818,12 9.545,8.432"/>
                </svg>
              </div>
              <span className="platform-name">YouTube</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <svg viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fcb045"/>
                      <stop offset="40%" stopColor="#fd1d1d"/>
                      <stop offset="100%" stopColor="#833ab4"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#ig-g)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="platform-name">Instagram</span>
            </a>

            <a href="#" className="platform-card">
              <div className="platform-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" fill="#000000"/>
                </svg>
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
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
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
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="info-row-content">
                <div className="info-row-label">Domingo</div>
                <div className="info-row-value">10:00 AM — Culto General</div>
              </div>
            </li>

            {/* Miércoles */}
            <li className="info-row">
              <div className="info-row-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="info-row-content">
                <div className="info-row-label">Miércoles</div>
                <div className="info-row-value">7:00 PM — Herramientas para el Camino</div>
              </div>
            </li>

            {/* Sábado */}
            <li className="info-row">
              <div className="info-row-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
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
            <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        </div>
        <h2 className="nuevo-title">¿Eres Nuevo?</h2>
        <p className="nuevo-sub">Nos encantaría conocerte. Ven y sé parte de nuestra familia.</p>
        <Link to="/contacto" className="btn-nuevo">Soy Nuevo</Link>
      </section>

    </main>
  )
}

export default Inicio