// frontend/src/components/Footer.js

import React from 'react';
import { FaTiktok, FaInstagram, FaTelegram } from 'react-icons/fa';
import '../App.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Fenet Cafe. All rights reserved.</p>

      {/* --- NEW SOCIAL MEDIA LINKS --- */}
      <div className="social-links">
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
      {/* --- END SOCIAL MEDIA LINKS --- */}

      <p>Made with Bati Jano and Kumeshi Beshada.</p>
    </footer>
  );
};

export default Footer;