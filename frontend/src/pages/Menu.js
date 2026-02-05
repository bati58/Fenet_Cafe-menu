// frontend/src/pages/Menu.js

import React, { useState, useEffect } from 'react';
import '../App.css';
import { apiUrl, resolveImageUrl } from '../lib/api';
import { setPageMeta } from '../lib/meta';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setPageMeta('Fenet Cafe | Menu', 'Browse the full Fenet Cafe menu with categories and prices.');
  }, []);

  // Fetch data from the Express API endpoint /api/menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Proxy in package.json redirects this to http://localhost:5000/api/menu
        const response = await fetch(apiUrl('/api/menu'));

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
        <h1>Loading Fenet Cafe Menu</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="menu-page error">
        <h1 style={{ color: 'red' }}>Data Error</h1>
        <p>{error}</p>
      </section>
    );
  }

  const formatCategory = (value) =>
    value.replace('_', ' & ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Helper function to group items by category
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const categoryKey = formatCategory(item.category);
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(item);
      return acc;
    }, {});
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categories = Array.from(new Set(menuItems.map((item) => item.category))).sort();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !normalizedSearch ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  const groupedMenu = groupByCategory(filteredItems);

  return (
    <section className="menu-page">
      <h1>Fenet Cafe Menu</h1>
      <p className="menu-intro">Fresh Ethiopian light meals, drinks, and baked goods, served with a smile.</p>

      <div className="menu-controls">
        <input
          className="menu-search"
          type="search"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search menu items"
        />
        <div className="menu-filters">
          <label htmlFor="menu-category">Category</label>
          <select
            id="menu-category"
            className="menu-filter-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategory(category)}
              </option>
            ))}
          </select>
        </div>
        <p className="menu-count">{filteredItems.length} items</p>
      </div>

      {/* Map through the categories and display menu items */}
      {filteredItems.length === 0 ? (
        <p className="menu-empty">No items match your search.</p>
      ) : (
        Object.keys(groupedMenu).map((category) => (
          <div key={category} className="menu-category">
            <h2>{category}</h2>
            <hr />

            <div className="menu-items-grid">
              {groupedMenu[category].map((item) => (
                <div key={item._id} className="menu-item-card">
                  {/* Image Display Block */}
                  <div className="item-image">
                    <img
                    src={resolveImageUrl(item.imageUrl)} // Retrieves the image path from the MongoDB document (e.g., /images/chechebsa.jpg)
                    alt={item.name}
                      // Optional: Fallback to a generic image if the specific image fails to load
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
                    />
                  </div>
                  {/* End Image Display Block */}
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
        ))
      )}
    </section>
  );
};

export default Menu;
