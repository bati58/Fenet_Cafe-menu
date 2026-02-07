// frontend/src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import homeHeroBg from '../assets/home_hero_bg.jpg';
import { apiUrl, resolveImageUrl } from '../lib/api';
import { setPageMeta } from '../lib/meta';

const Home = () => {
    // 1. State to hold the menu data
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setPageMeta('Fenet Cafe | Home', 'Ethiopian cafe serving fresh breakfast, lunch, drinks, and baked goods.');
    }, []);

    // 2. Fetch the full menu data from the API
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Uses the proxy in package.json to hit http://localhost:5000/api/menu
                const response = await fetch(apiUrl('/api/menu'));
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (e) {
                console.error("Error fetching menu:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, [refreshHighlights]);

    // 3. Pick random featured items dynamically
    const [highlights, setHighlights] = useState([]);

    const refreshHighlights = () => {
        if (!menuItems.length) {
            setHighlights([]);
            return;
        }
        const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
        setHighlights(shuffled.slice(0, 2));
    };

    useEffect(() => {
        refreshHighlights();
    }, [menuItems]);

    // Conditional render for loading
    if (isLoading) {
        return (
            <section className="home-page loading">
                <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Loading Cafe Data...</h1>
            </section>
        );
    }

    // ... (Top half of your Home.js file remains unchanged, including fetch logic)

    return (
        <section className="home-page">
            {/* 1. Hero Section */}
            <div
                className="hero-section"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${homeHeroBg})`
                }}
            >
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

            {/* 3. Featured Items (Highlights) - NOW DYNAMIC WITH IMAGES */}
            <div className="highlights-section">
                <h2>Today's Highlights</h2>
                <button className="secondary-button refresh-button" type="button" onClick={refreshHighlights}>
                    Refresh Highlights
                </button>
                <div className="highlight-cards">
                    {isLoading ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>Loading highlights...</p>
                    ) : highlights.length ? (
                        <>
                            {highlights.map((item, index) => (
                                <div key={item._id} className="card">
                                    <div className="highlight-image">
                                        <img
                                            src={resolveImageUrl(item.imageUrl)}
                                            alt={item.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
                                        />
                                    </div>
                                    <h3>{index === 0 ? 'Featured' : 'Must Try'}: {item.name}</h3>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', width: '100%' }}>Highlights coming soon!</p>
                    )}
                </div>
            </div>

            {/* 4. Call to Action */}
            <div className="cta-section">
                <Link to="/menu" className="cta-button">View Our Full Menu</Link>
            </div>
        </section>
    );
};

export default Home;
