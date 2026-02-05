// frontend/src/pages/Admin.js

import React, { useEffect, useState } from 'react';
import '../App.css';
import { apiUrl, resolveImageUrl } from '../lib/api';
import { setPageMeta } from '../lib/meta';

const categories = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch_dinner', label: 'Lunch & Dinner' },
  { value: 'baked_goods', label: 'Baked Goods' },
  { value: 'drinks', label: 'Drinks' },
];

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [menuError, setMenuError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'breakfast',
    price: '',
    imageUrl: '',
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setPageMeta('Admin | Fenet Cafe', 'Admin tools for managing menu items and messages.');
  }, []);

  const refreshMenu = async () => {
    setMenuError('');
    setLoadingMenu(true);
    try {
      const response = await fetch(apiUrl('/api/menu'));
      if (!response.ok) {
        throw new Error('Failed to load menu items.');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setMenuError(err.message);
    } finally {
      setLoadingMenu(false);
    }
  };

  const refreshMessages = async () => {
    setMessageError('');
    setLoadingMessages(true);
    try {
      const response = await fetch(apiUrl('/api/admin/messages'), {
        cache: 'no-store',
        credentials: 'include',
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Failed to load messages.');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setMessageError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const validateSession = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/session'), {
        cache: 'no-store',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Unable to verify session.');
      }
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthed(true);
        setAuthError('');
        return true;
      }
      setIsAuthed(false);
      return false;
    } catch (err) {
      setIsAuthed(false);
      setAuthError(err.message);
      return false;
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed.');
      }
      setPassword('');
      setIsAuthed(true);
      refreshMenu();
    } catch (err) {
      setAuthError(err.message);
      setIsAuthed(false);
    }
  };

  const handleLogout = () => {
    fetch(apiUrl('/api/admin/logout'), {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      setIsAuthed(false);
      setMenuItems([]);
      setMessages([]);
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      imageUrl: item.imageUrl || '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      category: 'breakfast',
      price: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMenuError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    const endpoint = editingId ? `/api/admin/menu/${editingId}` : '/api/admin/menu';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl(endpoint), {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save menu item.');
      }
      resetForm();
      refreshMenu();
    } catch (err) {
      setMenuError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) {
      return;
    }
    setMenuError('');
    try {
      const response = await fetch(apiUrl(`/api/admin/menu/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete menu item.');
      }
      refreshMenu();
    } catch (err) {
      setMenuError(err.message);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploadSuccess('');

    try {
      setUploading(true);
      const body = new FormData();
      body.append('image', file);
      const response = await fetch(apiUrl('/api/admin/upload'), {
        method: 'POST',
        credentials: 'include',
        body,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Image upload failed.');
      }
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
      setUploadSuccess('Image uploaded. URL added to the form.');
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthed) {
    return (
      <section className="admin-page">
        <h1>Admin Access</h1>
        <p className="admin-subtitle">Enter your admin username and password to continue.</p>
        <div className="admin-login-card">
          {authError && <p className="error-message">{authError}</p>}
          <form className="admin-form" onSubmit={handleLogin}>
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
            <button type="submit" className="submit-button">
              Enter Dashboard
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>
      <p className="admin-subtitle">Manage menu items, uploads, and contact messages.</p>

      <div className="admin-toolbar">
        <button type="button" className="secondary-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Menu Manager</h2>
          <button type="button" className="secondary-button" onClick={refreshMenu}>
            Refresh
          </button>
        </div>
        {menuError && <p className="error-message">{menuError}</p>}
        {loadingMenu ? (
          <p>Loading menu items...</p>
        ) : (
          <div className="admin-grid">
            <div className="admin-card">
              <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
              <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleFormChange} required />

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleFormChange} required />

                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleFormChange}>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="price">Price (ETB)</label>
                <input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleFormChange} required />

                <label htmlFor="imageUrl">Image URL</label>
                <input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} placeholder="/images/example.jpg" />

                <label htmlFor="imageUpload">Upload Image</label>
                <input id="imageUpload" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
                {uploadError && <p className="error-message">{uploadError}</p>}
                {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}

                <div className="admin-actions">
                  <button type="submit" className="submit-button">
                    {editingId ? 'Update Item' : 'Create Item'}
                  </button>
                  {editingId && (
                    <button type="button" className="secondary-button" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-card">
              <h3>Menu Items</h3>
              <div className="admin-list">
                {menuItems.map((item) => (
                  <div key={item._id} className="admin-list-item">
                    <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                      <span className="admin-category">{item.category.replace('_', ' ')}</span>
                      <span className="admin-price">ETB {item.price?.toFixed(2)}</span>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Contact Messages</h2>
          <button type="button" className="secondary-button" onClick={refreshMessages}>
            Load Messages
          </button>
        </div>
        {messageError && <p className="error-message">{messageError}</p>}
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : (
          <div className="admin-messages">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="admin-message">
                  <div>
                    <strong>{msg.name}</strong>
                    <span>{msg.email}</span>
                  </div>
                  <p>{msg.message}</p>
                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Admin;
