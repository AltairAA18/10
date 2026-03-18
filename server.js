const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API работает',
        version: '1.0.0',
        docs: '/api-docs'
    });
});

app.use('/api/users', userRoutes);
app.use('/api/articles', itemRoutes);

// 404 обработчик
app.use((req, res) => {
    res.status(404).json({
        message: 'Маршрут не найден',
        requestedPath: req.originalUrl
    });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Внутренняя ошибка сервера',
        status: err.status || 500
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});