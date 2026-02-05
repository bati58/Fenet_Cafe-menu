// frontend/src/components/Header.js (Updated Code)

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/about">About Us</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
};

export default Header;
