// backend/server.js

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

const MenuItem = require('./models/MenuItem'); // Import the model
const ContactMessage = require('./models/ContactMessage');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'fenet-cafe';
const CLOUDINARY_ENABLED = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
);

if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Avoid cached 304 responses for API validation routes
app.disable('etag');

// Middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '100kb' })); // Allows parsing of JSON request bodies

const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const rawOrigins = process.env.CORS_ORIGIN;
const allowedOrigins = (rawOrigins
  ? rawOrigins.split(',')
  : (NODE_ENV === 'production' ? [] : devOrigins))
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error('Not allowed by CORS');
      err.status = 403;
      return callback(err);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

app.use('/api/', apiLimiter);
app.use(
  '/api/admin',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many admin requests, please try again later.' },
  })
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

const uploadDir = path.join(__dirname, 'uploads');
if (!CLOUDINARY_ENABLED) {
  fs.mkdirSync(uploadDir, { recursive: true });
  app.use('/uploads', express.static(uploadDir));
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${safeName}`);
  },
});

const upload = multer({
  storage: CLOUDINARY_ENABLED ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image uploads are allowed.'));
  },
});

const requireAdmin = (req, res, next) => {
  if (req.session?.admin?.username) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Session (stored in MongoDB) ---
if (!SESSION_SECRET) {
  console.warn('SESSION_SECRET is not set. Set it in backend/.env for secure sessions.');
}
app.use(
  session({
    name: 'fenet.sid',
    secret: SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 6,
    },
  })
);

// --- API Routes ---

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Get All Menu Items (READ operation)
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

app.post('/api/contact', contactLimiter, async (req, res) => {
  const name = (req.body?.name || '').trim();
  const email = (req.body?.email || '').trim();
  const message = (req.body?.message || '').trim();

  if (!name || name.length < 2 || name.length > 80) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
  }
  if (/\d/.test(name)) {
    return res.status(400).json({ message: 'Name cannot contain numbers.' });
  }
  if (!email || email.length > 254 || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (!message || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ message: 'Message must be between 10 and 2000 characters.' });
  }

  try {
    await ContactMessage.create({ name, email, message });
    return res.status(201).json({ message: 'Message received.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving message', error: error.message });
  }
});

// --- Admin Routes ---
app.post('/api/admin/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded.' });
  }
  if (!CLOUDINARY_ENABLED) {
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: CLOUDINARY_FOLDER },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    return res.status(201).json({ url: uploadResult.secure_url });
  } catch (error) {
    return res.status(500).json({ message: 'Cloud upload failed', error: error.message });
  }
});

app.get('/api/admin/validate', requireAdmin, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok' });
});

app.get('/api/admin/session', (req, res) => {
  if (req.session?.admin?.username) {
    return res.status(200).json({ authenticated: true, username: req.session.admin.username });
  }
  return res.status(200).json({ authenticated: false });
});

app.post('/api/admin/login', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');

  if (!ADMIN_USERNAME || (!ADMIN_PASSWORD && !ADMIN_PASSWORD_HASH)) {
    return res.status(500).json({ message: 'Admin credentials are not configured.' });
  }
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  let passwordOk = false;
  if (ADMIN_PASSWORD_HASH) {
    passwordOk = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } else {
    passwordOk = password === ADMIN_PASSWORD;
  }

  if (!passwordOk) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  req.session.admin = { username };
  return res.status(200).json({ authenticated: true, username });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('fenet.sid');
    res.status(200).json({ authenticated: false });
  });
});

app.get('/api/admin/messages', requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

app.post('/api/admin/menu', requireAdmin, async (req, res) => {
  const { name, description, category, price, imageUrl } = req.body || {};
  if (!name || !description || !category || price === undefined) {
    return res.status(400).json({ message: 'Name, description, category, and price are required.' });
  }
  try {
    const item = await MenuItem.create({
      name: String(name).trim(),
      description: String(description).trim(),
      category,
      price: Number(price),
      imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
    });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
});

app.put('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, imageUrl } = req.body || {};
  try {
    const updated = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: name ? String(name).trim() : name,
        description: description ? String(description).trim() : description,
        category,
        price: price !== undefined ? Number(price) : price,
        imageUrl: imageUrl ? String(imageUrl).trim() : imageUrl,
      },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
});

app.delete('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }
    return res.status(200).json({ message: 'Menu item deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

// --- Not Found & Error Handler ---
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ message });
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
