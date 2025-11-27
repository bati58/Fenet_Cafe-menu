// frontend/src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        {/* Logo and Cafe Name */}
        <Link to="/">Fenet Cafe 🇪🇹</Link>
      </div>
      <nav className="nav-links">
        {/* Navigation Links */}
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;