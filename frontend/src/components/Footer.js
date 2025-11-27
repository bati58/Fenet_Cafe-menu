// frontend/src/components/Footer.js

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Fenet Cafe. All rights reserved.</p>
      <p>Made with ❤️ and Kumeshi Beshada .</p>
    </footer>
  );
};

export default Footer;