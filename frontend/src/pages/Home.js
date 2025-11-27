// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Home = () => {
  return (
    <section className="home-page">
      {/* 1. Hero Section */}
      <div className="hero-section">
        <h1>Fenet Cafe</h1>
        <p className="tagline">Your Taste of Ethiopia, Light and Fresh.</p>
        
      </div>

      {/* 2. About Us Section */}
      <div className="about-us-section">
        <h2>Our Story: Buna and Beyond</h2>
        <p>
          Fenet Cafe brings the warmth and rich cultural flavors of Ethiopian cuisine to your community. 
          We focus on light, healthy, and satisfying meals for breakfast and lunch, rooted in tradition. 
          Every cup of our Buna (traditional coffee) is brewed with care, honoring the time-old Ethiopian coffee ceremony.
        </p>
      </div>
      
      {/* 3. Featured Items (Highlights) */}
      <div className="highlights-section">
        <h2>Today's Highlights</h2>
        <div className="highlight-cards">
            <div className="card">
                <h3>Featured: Shiro Sandwich</h3>
                <p>Our popular vegan chickpea stew wrapped in soft injera.</p>
            </div>
            <div className="card">
                <h3>Must Try: Spriss Juice</h3>
                <p>A vibrant, layered blend of mango, avocado, and papaya.</p>
            </div>
        </div>
      </div>

      {/* 4. Call to Action */}
      <div className="cta-section">
        <Link to="/menu" className="cta-button">View Our Full Menu 🍽️</Link>
      </div>
    </section>
  );
};

export default Home;