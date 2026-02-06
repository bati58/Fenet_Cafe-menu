// frontend/src/components/Footer.js

import React from 'react';
import { FaTiktok, FaInstagram, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../App.css';

const Footer = () => (
    <footer className="footer">
      <div className="footer-brand">
        <h3>Fenet Cafe</h3>
        <p>Fresh Ethiopian breakfast, lunch, drinks, and baked goods.</p>
      </div>

      <div className="footer-contact">
        <h4>Contact Us</h4>
        <p><strong>Phone:</strong> +251 921 906059</p>
        <p><strong>Address:</strong> Gelan Sub city, Oromia, Ethiopia</p>
        <p><strong>Hours:</strong> Mon - Sat: 7:00 AM - 9:00 PM</p>
        <p><strong>Sunday:</strong> 9:00 AM - 5:00 PM</p>
      </div>

      <div className="footer-links">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </div>

      {/* --- SOCIAL MEDIA LINKS --- */}
      <div className="social-links">
        <span className="social-title">Follow Us</span>
        <div className="social-icons">
          <a href="https://www.tiktok.com/@mulugetamulisa?lang=en" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" title="Fenet Cafe on Tiktok">
            <FaTiktok size={24} />
          </a>
          <a href="https://www.instagram.com/mulugeta_mulisa/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Fenet Cafe on Instagram">
            <FaInstagram size={24} />
          </a>
          <a href="https://t.me/@muler12m12" target="_blank" rel="noopener noreferrer" className="social-icon telegram" title="Fenet Cafe on Telegram">
            <FaTelegram size={24} />
          </a>
        </div>
      </div>
      {/* --- END SOCIAL MEDIA LINKS --- */}
      <div className="footer-bottom">&copy; 2026 Fenet Cafe. All rights reserved.</div>
    </footer>
);

export default Footer;
