
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo-wrap">
          <img src="/favicon.png" alt="Logo Iglesia Remanente Cali" className="logo-img" />
          <span className="logo-name">Iglesia Cristiana Remanente Cali</span>
        </div>

        <button className="mobile-toggle" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
            <li>
              <Link to="/familia" className="nav-link">Familia Remanente</Link>
            </li>
            <li>
              <Link to="/equipos" className="nav-link">Equipos</Link>
            </li>
            <li>
              <Link to="/donaciones" className="nav-link">Donaciones</Link>
            </li>
            <li>
              <Link to="/contacto" className="nav-link">Contáctanos</Link>
            </li>
            {/* No incluir Login ni otros enlaces */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;