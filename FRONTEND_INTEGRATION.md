# Интеграция с Frontend

Этот документ описывает, как интегрировать frontend-приложение с Blog API.

## Базовый URL

Все запросы должны быть отправлены на:
```
http://localhost:5000
```

Для production: замените на ваш URL сервера.

## Установка CORS

API уже настроен для работы с CORS. Frontend может отправлять запросы с любого домена.

## Примеры интеграции

### JavaScript/Fetch API

```javascript
// 1. Регистрация
async function register(name, email, password) {
    const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } else {
        throw new Error(data.message);
    }
}

// 2. Вход
async function login(email, password) {
    const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    } else {
        throw new Error(data.message);
    }
}

// 3. Получить профиль пользователя
async function getProfile() {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
}

// 4. Получить все статьи
async function getArticles() {
    const response = await fetch('http://localhost:5000/api/articles');
    return await response.json();
}

// 5. Получить одну статью
async function getArticleById(id) {
    const response = await fetch(`http://localhost:5000/api/articles/${id}`);
    return await response.json();
}

// 6. Создать статью
async function createArticle(title, content, category, tags, published) {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            content,
            category,
            tags,
            published
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message);
    }
    
    return data.article;
}

// 7. Обновить статью
async function updateArticle(id, updates) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message);
    }
    
    return data.article;
}

// 8. Удалить статью
async function deleteArticle(id) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
    }
    
    return await response.json();
}

// 9. Добавить лайк
async function likeArticle(id) {
    const response = await fetch(`http://localhost:5000/api/articles/${id}/like`, {
        method: 'POST'
    });
    
    return await response.json();
}

// 10. Получить статьи по категории
async function getArticlesByCategory(category) {
    const response = await fetch(`http://localhost:5000/api/articles/category/${category}`);
    return await response.json();
}

// 11. Выход
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// 12. Проверка авторизации
function isAuthenticated() {
    return !!localStorage.getItem('token');
}
```

### React пример

```jsx
import React, { useState, useEffect } from 'react';

// Хук для работы с API
function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const register = async (name, email, password) => {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        }
        
        return data;
    };

    const login = async (email, password) => {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        }
        
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return { user, token, register, login, logout, isAuthenticated: !!token };
}

// Компонент для списка статей
function ArticlesList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Загрузка...</div>;

    return (
        <div>
            {articles.map(article => (
                <div key={article._id} className="article-card">
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <p>Автор: {article.author.name}</p>
                    <p>👁️ {article.views} просмотров</p>
                    <p>❤️ {article.likes} лайков</p>
                </div>
            ))}
        </div>
    );
}

export { useAuth, ArticlesList };
```

### Vue.js пример

```vue
<template>
    <div class="articles">
        <div v-if="loading">Загрузка...</div>
        <div v-else>
            <article v-for="article in articles" :key="article._id">
                <h2>{{ article.title }}</h2>
                <p>{{ article.excerpt }}</p>
                <p>Автор: {{ article.author.name }}</p>
                <button @click="likeArticle(article._id)">
                    ❤️ {{ article.likes }}
                </button>
            </article>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            articles: [],
            loading: true
        };
    },
    mounted() {
        this.fetchArticles();
    },
    methods: {
        async fetchArticles() {
            const response = await fetch('http://localhost:5000/api/articles');
            this.articles = await response.json();
            this.loading = false;
        },
        async likeArticle(id) {
            const response = await fetch(
                `http://localhost:5000/api/articles/${id}/like`,
                { method: 'POST' }
            );
            const data = await response.json();
            
            const idx = this.articles.findIndex(a => a._id === id);
            if (idx >= 0) {
                this.articles[idx].likes = data.article.likes;
            }
        }
    }
};
</script>
```

## Сохранение токена

Рекомендуется сохранять токен в:
1. **localStorage** - простое решение, уязвимо для XSS
2. **sessionStorage** - удаляется при закрытии браузера
3. **Cookie** (HttpOnly) - более безопасно, требует настройки CORS

```javascript
// Пример с httpOnly Cookie (требует настройки на backend)
// Сервер отправляет токен в Set-Cookie заголовке
// Frontend не нужно сохранять токен вручную - он отправляется автоматически
```

## Обработка ошибок

```javascript
async function handleApiError(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
}

// Использование
try {
    const articles = await fetch('/api/articles')
        .then(handleApiError);
} catch (error) {
    console.error('Ошибка:', error.message);
    // Показать пользователю сообщение об ошибке
}
```

## Переменные окружения в Frontend

В production обычно используются переменные окружения:

**.env**
```
REACT_APP_API_URL=https://api.example.com
```

**Использование**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

fetch(`${API_URL}/api/articles`);
```

## Проверка безопасности

- ✅ Токен хранится безопасно
- ✅ Токен отправляется в заголовке Authorization
- ✅ HTTPS используется в production
- ✅ CORS правильно настроен
- ✅ Sensitive данные не отправляются в параметрах URL

## Debugging

### DevTools Network tab
- Проверьте запросы и ответы
- Убедитесь, что статус коды правильные
- Проверьте заголовки Authorization

### Console errors
```javascript
// Включить логирование
const IS_DEV = process.env.NODE_ENV === 'development';

async function makeFetch(url, options) {
    if (IS_DEV) console.log('Request:', url, options);
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (IS_DEV) console.log('Response:', data);
    
    return data;
}
```
