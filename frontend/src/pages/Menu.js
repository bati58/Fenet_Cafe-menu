// frontend/src/pages/Menu.js

import React, { useState, useEffect } from 'react';
import '../App.css'; 

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the Express API endpoint /api/menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Proxy in package.json redirects this to http://localhost:5000/api/menu
        const response = await fetch('/api/menu'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setMenuItems(data); 
      } catch (e) {
        console.error("Error fetching menu:", e);
        setError("Failed to load menu. Please ensure the backend server is running on port 5000.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchMenu();
  }, []); 

  // --- Display Logic ---

  if (isLoading) {
    return (
      <section className="menu-page loading">
        <h1>Loading Fenet Cafe Menu... ⏳</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="menu-page error">
        <h1 style={{color: 'red'}}>Data Error</h1>
        <p>{error}</p>
      </section>
    );
  }
  
  // Helper function to group items by category
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const categoryKey = item.category.replace('_', ' & ').replace(/\b\w/g, c => c.toUpperCase());
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(item);
      return acc;
    }, {});
  };

  const groupedMenu = groupByCategory(menuItems);
  
  return (
    <section className="menu-page">
      <h1>Fenet Cafe Menu 📜</h1>
      <p className="menu-intro">Fresh Ethiopian light meals, drinks, and baked goods, served with a smile.</p>
      
      {/* Map through the categories and display menu items */}
      {Object.keys(groupedMenu).map((category) => (
        <div key={category} className="menu-category">
          <h2>{category}</h2> 
          <hr/>
          
          <div className="menu-items-grid">
            {groupedMenu[category].map((item) => (
              <div key={item._id} className="menu-item-card">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                </div>
                <div className="item-price">
                  <span>ETB {item.price ? item.price.toFixed(2) : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Menu;