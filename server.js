const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Also serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running', status: 'OK' });
});

// Ensure Contact URL works from footer links
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Ensure friendly aliases exist
app.get('/shipping', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shipping.html'));
});
app.get('/returns', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'returns.html'));
});
app.get('/refund', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'returns.html'));
});
app.get('/exchange', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'returns.html'));
});

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const supportRoutes = require('./routes/supportRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
