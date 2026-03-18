const Article = require('../models/Item');

// Получить все статьи
const getArticles = async(req, res) => {
    try {
        const articles = await Article.find({ published: true })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить все статьи (включая неопубликованные для автора)
const getAllArticles = async(req, res) => {
    try {
        let query = {};

        if (req.user) {
            // Если пользователь авторизован, показываем его статьи и опубликованные
            query = {
                $or: [
                    { published: true },
                    { author: req.user.id }
                ]
            };
        } else {
            // Иначе только опубликованные
            query = { published: true };
        }

        const articles = await Article.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить статью по ID
const getArticleById = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'name email');

        if (!article) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        // Увеличить количество просмотров
        if (article.published) {
            article.views += 1;
            await article.save();
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Создать статью
const createArticle = async(req, res) => {
    try {
        const { title, content, excerpt, category, tags, published } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Поля title, content и category обязательны' });
        }

        const article = await Article.create({
            title,
            content,
            excerpt: excerpt || content.substring(0, 500),
            category,
            tags: tags || [],
            author: req.user.id,
            published: published || false
        });

        const populatedArticle = await article.populate('author', 'name email');

        res.status(201).json({
            message: 'Статья успешно создана',
            article: populatedArticle
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// Обновить статью
const updateArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Нет доступа к редактированию этой статьи' });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id, {...req.body, author: req.user.id }, { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.status(200).json({
            message: 'Статья успешно обновлена',
            article: updatedArticle
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

// Удалить статью
const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Нет доступа к удалению этой статьи' });
        }

        await article.deleteOne();

        res.status(200).json({ message: 'Статья успешно удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Лайкнуть статью
const likeArticle = async(req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id, { $inc: { likes: 1 } }, { new: true }
        ).populate('author', 'name email');

        if (!article) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.status(200).json({
            message: 'Лайк добавлен',
            article
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить статьи по категории
const getArticlesByCategory = async(req, res) => {
    try {
        const { category } = req.params;

        const articles = await Article.find({
                category,
                published: true
            })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getArticles,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    getArticlesByCategory
};