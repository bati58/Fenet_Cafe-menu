// frontend/src/pages/About.js

import React, { useEffect } from 'react';
import aboutHeroBg from '../assets/about_bg.png';
import { setPageMeta } from '../lib/meta';

const About = () => {
    useEffect(() => {
        setPageMeta('Fenet Cafe | About', 'Learn about Fenet Cafe, Ethiopian coffee tradition, and our community roots.');
    }, []);

    return (
        <div className="content about-page">
            <section
                className="about-hero about-hero-bg"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${aboutHeroBg})`
                }}
            >
                <h1>
                    Fenet Cafe: Where Tradition Meets Community
                </h1>
            </section>

            <section className="about-content" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', lineHeight: '1.6' }}>
                <p>
                    Founded in 2010, Fenet Cafe was conceived not just as a business,
                    but as a cultural heart for the community of Gelan, Oromia.
                    We chose the name 'Fenet', which in Afan Oromo means "We wished it" or "We wanted it."
                    This symbolizes the cafe itself as the realization of a shared dream and a deep aspiration to bring authentic Ethiopian hospitality to life.
                </p>

                <h3 style={{ color: '#b3523d', marginTop: '30px' }}>The Art of Buna (Coffee Ceremony)</h3>
                <p>
                    Our daily life centers on Buna, the traditional Ethiopian coffee ceremony.
                    This is more than just a drink; it's a social ritual of peace and gathering.
                    We begin by sourcing our beans directly from the high-altitude, fertile regions of Sidama and Yirgacheffe,
                    renowned globally for their complex, bright flavors. We meticulously roast them on-site,
                    grind them fresh, and brew every cup in a jebena, ensuring the profound aroma and pure taste of Ethiopia's finest gift.
                </p>

                <h3 style={{ color: '#b3523d', marginTop: '30px' }}>Wholesome Ethiopian Cuisine</h3>
                <p>
                    Beyond our authentic Buna, our kitchen is committed to wholesome, comforting Ethiopian cuisine:
                </p>
                <ul>
                    <li>Honoring the Morning Meal: Our breakfast and brunch offerings are deeply traditional,
                        featuring healthy staples like kinche (cracked wheat), ful (fava bean stew),
                        and fresh injera served with local accompaniments.
                        We believe in starting the day with sustained energy and flavor.</li>
                    <li>Wholesome Lunches and Snacks: Our menu provides satisfying,
                        flavorful options from savory, chickpea-based Shiro sandwiches to nourishing lentil dishes and vibrant,
                        freshly pressed juices. Everything is prepared with locally sourced ingredients whenever possible.</li>
                </ul>
                <p>
                    At Fenet Cafe, every visit is a journey back to the source - a connection to our heritage,
                    a moment of fellowship, and a commitment to quality. We invite you to sit, slow down,
                    and share in our tradition.
                </p>
            </section>
        </div>
    );
};

export default About;
