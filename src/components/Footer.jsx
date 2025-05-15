import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to={''}>
            <i className="fa-solid fa-paw nav-bar-brand fa-2x"></i>
          </Link>
          <Link to={''} style={{ textDecoration: 'none', color: 'white' }}>
            <h3>PawConnect</h3>
          </Link>

        </div>
        {/* <ul className="footer-links">
          <li><a href="">About Us</a></li>
          <li><a href="">Contact</a></li>
          <li><a href="">Privacy Policy</a></li>
        </ul> */}
        <p className="footer-text">&copy; 2025 PawConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
