const mongoose = require('mongoose');
const config = require('../app/config'); // Mengimpor konfigurasi

// Membentuk URL Koneksi
const dbURI = `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`;

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const db = mongoose.connection;

module.exports = db;