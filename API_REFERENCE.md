# API Reference - Полное описание всех маршрутов

## Содержание

1. [Аутентификация](#аутентификация)
2. [Профиль пользователя](#профиль-пользователя)
3. [Статьи](#статьи)
4. [Категории](#категории)
5. [Коды ошибок](#коды-ошибок)
6. [Форматы ответов](#форматы-ответов)

---

## Аутентификация

### Регистрация пользователя

**Endpoint**
```
POST /api/users/register
```

**Request**
```json
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Success Response (201)**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": "64a7b2c...",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Пустые поля | 400 | `{"message": "Все поля обязательны"}` |
| Короткий пароль | 400 | `{"message": "Пароль должен быть не менее 6 символов"}` |
| Некорректный email | 400 | `{"message": "Введите корректный email"}` |
| Email уже существует | 400 | `{"message": "Пользователь с таким email уже существует"}` |
| Ошибка сервера | 500 | `{"message": "Ошибка сервера при регистрации"}` |

**Пример cURL**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

---

### Вход (Логин)

**Endpoint**
```
POST /api/users/login
```

**Request**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Success Response (200)**
```json
{
  "message": "Вход выполнен успешно",
  "user": {
    "id": "64a7b2c...",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Пустые поля | 400 | `{"message": "Email и пароль обязательны"}` |
| User не найден | 401 | `{"message": "Неверный email или пароль"}` |
| Неверный пароль | 401 | `{"message": "Неверный email или пароль"}` |
| Ошибка сервера | 500 | `{"message": "Ошибка сервера при входе"}` |

**Пример cURL**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

**Сохранение токена**
```javascript
// После успешного входа:
const token = response.token;
localStorage.setItem('token', token);

// При последующих запросах используйте токен:
headers: {
    'Authorization': `Bearer ${token}`
}
```

---

## Профиль пользователя

### Получить профиль текущего пользователя

**Endpoint**
```
GET /api/users/profile
```

**Headers**
```
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "user": {
    "id": "64a7b2c...",
    "name": "Иван Петров",
    "email": "ivan@example.com",
    "createdAt": "2023-12-01T10:30:00.000Z"
  }
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Нет токена | 401 | `{"message": "Нет токена, доступ запрещён"}` |
| Неверный токен | 401 | `{"message": "Неверный токен"}` |
| User не найден | 404 | `{"message": "Пользователь не найден"}` |

**Пример cURL**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/profile
```

---

## Статьи

### Получить все опубликованные статьи

**Endpoint**
```
GET /api/articles
```

**Query Parameters**
```
Нет параметров - возвращает все опубликованные статьи,
отсортированные по дате создания (самые новые первыми)
```

**Success Response (200)**
```json
[
  {
    "_id": "64a7b2c1...",
    "title": "Введение в Node.js",
    "excerpt": "Node.js - это среда выполнения JavaScript...",
    "content": "Полный текст статьи...",
    "category": "Технология",
    "tags": ["javascript", "nodejs", "backend"],
    "views": 42,
    "likes": 10,
    "author": {
      "_id": "64a7b2b1...",
      "name": "Иван Петров",
      "email": "ivan@example.com"
    },
    "published": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-05T15:45:30.000Z"
  }
]
```

**Пример cURL**
```bash
curl http://localhost:5000/api/articles
```

---

### Получить статью по ID

**Endpoint**
```
GET /api/articles/:id
```

**Path Parameters**
- `id` - MongoDB ID статьи

**Success Response (200)**
```json
{
  "_id": "64a7b2c1...",
  "title": "Введение в Node.js",
  "excerpt": "Node.js - это среда выполнения JavaScript...",
  "content": "Полный текст статьи...",
  "category": "Технология",
  "tags": ["javascript", "nodejs", "backend"],
  "views": 43,
  "likes": 10,
  "author": {
    "_id": "64a7b2b1...",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  },
  "published": true,
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-05T15:45:30.000Z"
}
```

**Особенность**: При получении опубликованной статьи счетчик `views` увеличивается на 1.

**Error Response**

| Условие | Код | Ответ |
|---------|-----|-------|
| Статья не найдена | 404 | `{"message": "Статья не найдена"}` |

**Пример cURL**
```bash
curl http://localhost:5000/api/articles/64a7b2c1...
```

---

### Получить статьи по категории

**Endpoint**
```
GET /api/articles/category/:category
```

**Path Parameters**
- `category` - название категории (например: "Технология", "Жизнь", "Путешествия")

**Success Response (200)**
```json
[
  {
    "_id": "64a7b2c1...",
    "title": "Введение в Node.js",
    "excerpt": "...",
    "content": "...",
    "category": "Технология",
    "tags": [...],
    "views": 42,
    "likes": 10,
    "author": {...},
    "published": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-05T15:45:30.000Z"
  }
]
```

**Пример cURL**
```bash
curl http://localhost:5000/api/articles/category/Технология
```

---

### Создать новую статью

**Endpoint**
```
POST /api/articles
```

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "Мой первый пост",
  "content": "Это содержание моей первой статьи...",
  "excerpt": "Краткое описание",
  "category": "Технология",
  "tags": ["javascript", "web"],
  "published": true
}
```

**Обязательные поля**: title, content, category

**Optional поля**:
- `excerpt` - если не указан, берется первые 500 символов content
- `tags` - массив строк, по умолчанию пустой массив
- `published` - по умолчанию false (черновик)

**Success Response (201)**
```json
{
  "message": "Статья успешно создана",
  "article": {
    "_id": "64a7b2d1...",
    "title": "Мой первый пост",
    "content": "Это содержание моей первой статьи...",
    "excerpt": "Краткое описание",
    "category": "Технология",
    "tags": ["javascript", "web"],
    "views": 0,
    "likes": 0,
    "author": {
      "_id": "64a7b2b1...",
      "name": "Иван Петров",
      "email": "ivan@example.com"
    },
    "published": true,
    "createdAt": "2023-12-06T10:30:00.000Z",
    "updatedAt": "2023-12-06T10:30:00.000Z"
  }
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Нет токена | 401 | `{"message": "Нет токена, доступ запрещён"}` |
| Неверный токен | 401 | `{"message": "Неверный токен"}` |
| Отсутствуют обязательные поля | 400 | `{"message": "Поля title, content и category обязательны"}` |

**Пример cURL**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Мой первый пост",
    "content": "Содержание...",
    "category": "Технология",
    "tags": ["javascript"],
    "published": true
  }'
```

---

### Обновить статью

**Endpoint**
```
PUT /api/articles/:id
```

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters**
- `id` - MongoDB ID статьи

**Request Body** (все поля optional)
```json
{
  "title": "Обновленное название",
  "content": "Новое содержание...",
  "excerpt": "Новое описание",
  "category": "Новая категория",
  "tags": ["новые", "теги"],
  "published": true
}
```

**Success Response (200)**
```json
{
  "message": "Статья успешно обновлена",
  "article": {
    "_id": "64a7b2d1...",
    "title": "Обновленное название",
    "content": "Новое содержание...",
    "excerpt": "Новое описание",
    "category": "Новая категория",
    "tags": ["новые", "теги"],
    "views": 42,
    "likes": 10,
    "author": {...},
    "published": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-06T14:20:00.000Z"
  }
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Нет токена | 401 | `{"message": "Нет токена, доступ запрещён"}` |
| Статья не найдена | 404 | `{"message": "Статья не найдена"}` |
| Не ваша статья | 403 | `{"message": "Нет доступа к редактированию этой статьи"}` |

**Пример cURL**
```bash
curl -X PUT http://localhost:5000/api/articles/64a7b2d1... \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Обновленное название",
    "published": true
  }'
```

---

### Удалить статью

**Endpoint**
```
DELETE /api/articles/:id
```

**Headers**
```
Authorization: Bearer <token>
```

**Path Parameters**
- `id` - MongoDB ID статьи

**Success Response (200)**
```json
{
  "message": "Статья успешно удалена"
}
```

**Error Responses**

| Условие | Код | Ответ |
|---------|-----|-------|
| Нет токена | 401 | `{"message": "Нет токена, доступ запрещён"}` |
| Статья не найдена | 404 | `{"message": "Статья не найдена"}` |
| Не ваша статья | 403 | `{"message": "Нет доступа к удалению этой статьи"}` |

**Пример cURL**
```bash
curl -X DELETE http://localhost:5000/api/articles/64a7b2d1... \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Добавить лайк к статье

**Endpoint**
```
POST /api/articles/:id/like
```

**Path Parameters**
- `id` - MongoDB ID статьи

**Success Response (200)**
```json
{
  "message": "Лайк добавлен",
  "article": {
    "_id": "64a7b2d1...",
    "title": "Введение в Node.js",
    "content": "...",
    "category": "Технология",
    "tags": [...],
    "views": 42,
    "likes": 11,
    "author": {...},
    "published": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-05T15:45:30.000Z"
  }
}
```

**Error Response**

| Условие | Код | Ответ |
|---------|-----|-------|
| Статья не найдена | 404 | `{"message": "Статья не найдена"}` |

**Особенность**: Лайк может добавить кто угодно, без авторизации. Каждый запрос увеличивает счетчик на 1.

**Пример cURL**
```bash
curl -X POST http://localhost:5000/api/articles/64a7b2d1.../like
```

---

## Категории

### Еще нет отдельного endpoint для управления категориями

Категории определяются при создании статей. Список всех категорий можно получить, обработав ответ `GET /api/articles` на стороне клиента.

**Возможные категории** (рекомендуемые):
- Технология
- Жизнь
- Путешествия
- Бизнес
- Здоровье
- Развлечение
- Образование

---

## Коды ошибок

| Код | Неймполнение | Действие |
|-----|----------|----------|
| **200** | ✅ OK | Запрос выполнен успешно |
| **201** | ✅ Created | Ресурс создан |
| **400** | ❌ Bad Request | Проверьте синтаксис и обязательные поля |
| **401** | ❌ Unauthorized | Обновите токен или переавторизуйтесь |
| **403** | ❌ Forbidden | У вас нет прав на это действие |
| **404** | ❌ Not Found | Ресурс не существует |
| **500** | ❌ Server Error | Проблема на сервере, попробуйте позже |

---

## Форматы ответов

### Успешный ответ с данными

```json
{
  "message": "Успешная операция",
  "data": { ... },
  "token": "eyJ..." // если требуется
}
```

### Успешный ответ, список

```json
[
  { "item": 1 },
  { "item": 2 }
]
```

### Ошибка

```json
{
  "message": "Описание ошибки",
  "status": 400 // httpл код
}
```

---

## Аутентификация в заголовках

Все защищенные endpoints требуют заголовок:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTdiMWMwZDQ4NDA5MDAxYWJjZGVmMSIsImlhdCI6MTY4ODU0NTIzMiwiZXhwIjoxNjg5MTUwMDMyfQ.vL-S5W0V3K0l7_jN8pQ0J2k8mE1sR9tU3vW0xY2zZ3a
```

Формат: `Bearer <token>`

---

## Limites и лучшие практики

1. **Лимиты запросов**: На данный момент не установлены (можно добавить)
2. **Timeout**: 30 секунд для всех запросов
3. **Размер payload**: Max 10MB
4. **Токен**: Действует 7 дней
5. **Кэширование**: Запросы GET можно кэшировать на клиенте

---

## Примеры типичных операций

### Полный цикл: Регистрация → Создание → Просмотр

```javascript
// 1. Регистрация
const registerResponse = await fetch('http://localhost:5000/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Иван',
        email: 'ivan@test.com',
        password: 'password123'
    })
});
const {token} = await registerResponse.json();
localStorage.setItem('token', token);

// 2. Создание статьи
const createResponse = await fetch('http://localhost:5000/api/articles', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        title: 'Моя первая статья',
        content: 'Содержание...',
        category: 'Технология',
        published: true
    })
});
const {article} = await createResponse.json();

// 3. Получение статьи
const getResponse = await fetch(`http://localhost:5000/api/articles/${article._id}`);
const fullArticle = await getResponse.json();
console.log(`Просмотров: ${fullArticle.views}`);
```
