// frontend/src/components/Header.js (Updated Code)

import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        {/* LOGO IMAGE REPLACING TEXT */}
        <Link to="/">
          <img
            src="/images/fenet_cafe_logo.png"
            alt="Fenet Cafe Logo"
            className="header-logo"
          />
        </Link>
      </div>
      <nav className="nav-links">
        {/* Navigation Links */}
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>

        {/* ADDED EXTERNAL LINK EXAMPLE */}
        <Link to="/about">About Us</Link>
      </nav>
    </header>
  );
};

export default Header;