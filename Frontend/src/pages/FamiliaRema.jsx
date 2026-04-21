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
              <i className="fas fa-bullseye" style={{ fontSize: '28px' }}></i>
            </div>
            <div className="mv-card-title">Misión</div>
            <p className="mv-card-text">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">
              <i className="fas fa-eye" style={{ fontSize: '28px' }}></i>
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
                  <i className="fas fa-user-large" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
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
                <i className="fas fa-layer-group" style={{ fontSize: '28px' }}></i>
              </div>
              <div className="servicio-name">Servicio Familiar</div>
              <div className="servicio-day">Domingo</div>
              <div className="servicio-time">10:00</div>
              <div className="servicio-ampm">AM</div>
            </div>
            <div className="servicio-card">
              <div className="servicio-icon">
                <i className="fas fa-book-open" style={{ fontSize: '28px' }}></i>
              </div>
              <div className="servicio-name">Herramientas Para El Camino</div>
              <div className="servicio-day">Miércoles</div>
              <div className="servicio-time">7:00</div>
              <div className="servicio-ampm">PM</div>
            </div>
            <div className="servicio-card">
              <div className="servicio-icon">
                <i className="fas fa-people-group" style={{ fontSize: '28px' }}></i>
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