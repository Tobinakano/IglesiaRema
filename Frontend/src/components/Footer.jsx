import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-top">

        <div className="footer-social-icons">

          {/* Facebook */}
          <a href="#">
            <i className="fab fa-facebook" style={{ fontSize: '24px' }}></i>
          </a>

          {/* Instagram */}
          <a href="#">
            <i className="fab fa-instagram" style={{ fontSize: '24px' }}></i>
          </a>

          {/* YouTube */}
          <a href="#">
            <i className="fab fa-youtube" style={{ fontSize: '24px' }}></i>
          </a>

          {/* TikTok */}
          <a href="#">
            <i className="fab fa-tiktok" style={{ fontSize: '24px' }}></i>
          </a>

        </div>
        
        <div className="footer-address-text">
          <i className="fas fa-map-marker-alt" style={{ fontSize: '18px', marginRight: '8px' }}></i>
          <span>Calle 10 #23-45, Cali, Colombia</span>
        </div>

      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 Iglesia Cristiana Remanente Cali
        </p>
      </div>

    </footer>
  )
}

export default Footer