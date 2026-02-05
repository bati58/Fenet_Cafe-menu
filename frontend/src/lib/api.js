// frontend/src/lib/api.js

const defaultBase = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
const API_BASE = (process.env.REACT_APP_API_URL || defaultBase).replace(/\/$/, '');

export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export const resolveImageUrl = (url) => {
  if (!url) {
    return '/images/placeholder.jpg';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return apiUrl(url);
  }
  return url;
};
