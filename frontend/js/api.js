// API конфигурация
const API_URL = 'http://localhost:5000/api';

// API объект с функциями для работы с backend
const api = {
    // Получить токен из localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Установить токен
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // Удалить токен
    removeToken() {
        localStorage.removeItem('token');
    },

    // Получить заголовки для запроса
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    // Обработка ошибок
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка при обращении к серверу');
        }
        return response.json();
    },

    /* ========================
       АУТЕНТИФИКАЦИЯ
       ======================== */

    // Регистрация
    async register(name, email, password) {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return this.handleResponse(response);
    },

    // Вход
    async login(email, password) {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return this.handleResponse(response);
    },

    // Получить профиль
    async getProfile() {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    /* ========================
       СТАТЬИ
       ======================== */

    // Получить все статьи
    async getArticles() {
        const response = await fetch(`${API_URL}/articles`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    // Получить одну статью
    async getArticle(id) {
        const response = await fetch(`${API_URL}/articles/${id}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    // Получить статьи по категории
    async getArticlesByCategory(category) {
        const response = await fetch(`${API_URL}/articles/category/${category}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    // Создать статью
    async createArticle(data) {
        const response = await fetch(`${API_URL}/articles`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    },

    // Обновить статью
    async updateArticle(id, data) {
        const response = await fetch(`${API_URL}/articles/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse(response);
    },

    // Удалить статью
    async deleteArticle(id) {
        const response = await fetch(`${API_URL}/articles/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    // Лайкнуть статью
    async likeArticle(id) {
        const response = await fetch(`${API_URL}/articles/${id}/like`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }
};