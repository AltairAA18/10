const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название статьи обязательно'],
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: [true, 'Содержание статьи обязательно'],
        trim: true
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: 500
    },
    category: {
        type: String,
        required: [true, 'Категория обязательна'],
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);