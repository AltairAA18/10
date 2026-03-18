const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
    getArticles,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    getArticlesByCategory
} = require('../controllers/itemController');

// Защищенные маршруты (должны быть выше параметризованных)
router.post('/', protect, createArticle);

// Публичные маршруты
router.get('/', getArticles);
router.get('/all', getAllArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/:id', getArticleById);
router.post('/:id/like', likeArticle);

// Защищенные маршруты для редактирования/удаления
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;