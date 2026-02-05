// frontend/src/App.js (Replace existing content)

import './App.css'; 
import { Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
