// frontend/src/pages/NotFound.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { setPageMeta } from '../lib/meta';

const NotFound = () => {
  useEffect(() => {
    setPageMeta('Page Not Found | Fenet Cafe', 'The page you requested could not be found.');
  }, []);

  return (
    <section className="notfound-page">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="cta-button" to="/">
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;
