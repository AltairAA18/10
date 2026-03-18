# Архитектура Blog API

## Обзор

Blog API представляет собой REST-приложение по архитектуре Model-View-Controller (MVC), адаптированной для backend API, где нет "View" слоя.

## Архитектурные слои

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
├─────────────────────────────────────────────────────────┤
│                     HTTP/REST API                        │
├─────────────────────────────────────────────────────────┤
│                    ROUTES LAYER                          │
│  (userRoutes.js, itemRoutes.js)                          │
├─────────────────────────────────────────────────────────┤
│                  MIDDLEWARE LAYER                        │
│  (authMiddleware - JWT verification)                     │
├─────────────────────────────────────────────────────────┤
│                 CONTROLLERS LAYER                        │
│  (userController, itemController)                        │
├─────────────────────────────────────────────────────────┤
│                    MODELS LAYER                          │
│  (User, Article - Mongoose schemas)                      │
├─────────────────────────────────────────────────────────┤
│                  CONFIG LAYER                            │
│  (Database connection)                                   │
├─────────────────────────────────────────────────────────┤
│                 DATABASE (MongoDB)                       │
└─────────────────────────────────────────────────────────┘
```

## Компоненты системы

### 1. Entry Point: server.js

**Назначение**: Инициализация приложения, подключение middleware, запуск сервера

**Структура**:
- Импорт зависимостей
- Подключение базы данных
- CORS и JSON middleware
- Регистрация маршрутов
- 404 и Error handlers
- Запуск сервера

**Ответственность**: 
- Конфигурация Express приложения
- Централизованная обработка ошибок

### 2. Models Layer (models/)

**User.js**
```javascript
- name: String (обязательно)
- email: String (обязательно, уникальное)
- password: String (обязательно, хеширован)
- timestamps: автоматические createdAt, updatedAt
```

**Item.js (Article)**
```javascript
- title: String (обязательно, max 200)
- content: String (обязательно)
- excerpt: String (краткое описание)
- category: String (обязательно)
- tags: Array (по умолчанию пустой массив)
- views: Number (счетчик просмотров)
- likes: Number (счетчик лайков)
- author: ObjectId (ссылка на User)
- published: Boolean (опубликована ли статья)
- timestamps: createdAt, updatedAt
```

**Особенности**:
- Валидация на уровне schema
- Автоматические timestamps
- Связь между User и Article через `author`

### 3. Controllers Layer (controllers/)

**userController.js**
- `registerUser`: Регистрация с проверкой email, хеширование пароля
- `loginUser`: Аутентификация и выдача JWT токена
- `getCurrentUser`: Получение данных текущего пользователя

**itemController.js (articleController)**
- `getArticles`: Все опубликованные статьи
- `getAllArticles`: Статьи пользователя + опубликованные
- `getArticleById`: Одна статья с увеличением просмотров
- `createArticle`: Создание новой статьи (требует авторизацию)
- `updateArticle`: Редактирование (только автор)
- `deleteArticle`: Удаление (только автор)
- `likeArticle`: Добавление лайка
- `getArticlesByCategory`: Фильтрация по категориям

**Ответственность**:
- Обработка бизнес-логики
- Валидация данных
- Проверка авторизации
- Взаимодействие с БД через модели
- Формирование ответов

### 4. Routes Layer (routes/)

**userRoutes.js**
```
POST   /api/users/register     → registerUser
POST   /api/users/login        → loginUser  
GET    /api/users/profile      → getCurrentUser (защищен)
```

**itemRoutes.js**
```
GET    /api/articles           → getArticles (все опубликованные)
GET    /api/articles/:id       → getArticleById
POST   /api/articles           → createArticle (защищен)
PUT    /api/articles/:id       → updateArticle (защищен)
DELETE /api/articles/:id       → deleteArticle (защищен)
POST   /api/articles/:id/like  → likeArticle
GET    /api/articles/category/:category → getArticlesByCategory
```

**Особенности**:
- Разделение защищенных и публичных маршрутов
- Применение middleware для защиты
- Точная регистрация контроллеров

### 5. Middleware Layer (middleware/)

**authMiddleware.js**
```javascript
- Получает токен из заголовка Authorization
- Проверяет валидность токена
- Извлекает user ID из токена
- Добавляет req.user для дальнейшего использования
- Возвращает 401 при ошибке
```

**Использование**:
- Защита маршрутов создания/редактирования/удаления
- Подтверждение личности пользователя

### 6. Config Layer (config/)

**db.js**
```javascript
- Подключение к MongoDB через Mongoose
- Обработка ошибок подключения
- Логирование статуса подключения
```

## Поток обработки запроса

### Пример: Создание статьи

```
1. CLIENT отправляет:
   POST /api/articles
   Authorization: Bearer <token>
   { title, content, category, tags }

2. SERVER получает запрос → server.js

3. Маршрутизация → itemRoutes.js
   ↓
   Проверка: protect middleware (проверка JWT)
   ↓
   Вызов: createArticle controller

4. CONTROLLER (itemController.js)
   ↓
   Валидация данных
   ↓
   Создание объекта Article.create()
   ↓
   Сохранение в MongoDB
   ↓
   Заполнение данных автора (populate)
   ↓
   Возврат успешного ответа

5. CLIENT получает:
   {
       "message": "Статья успешно создана",
       "article": { ... }
   }
```

## Безопасность

### 1. Аутентификация
- JWT токены (7 дней действия)
- Токен в заголовке `Authorization: Bearer <token>`

### 2. Авторизация
- Проверка принадлежности статьи пользователю
- Ограничение операций для не-авторов

### 3. Хеширование паролей
- bcryptjs с солью (10 раундов)
- Пароли никогда не передаются в открытом виде

### 4. Валидация
- Проверка типов данных (Mongoose schema)
- Проверка обязательных полей
- Проверка формата email

### 5. CORS
- Включен для фронтенд интеграции
- Контролирует кроссдоменные запросы

## Обработка ошибок

### Уровни обработки

1. **Controlller level**: Try-catch блоки
2. **Route level**: Middleware для ошибок (в server.js)
3. **Global level**: Финальный обработчик ошибок в server.js

### HTTP Статус коды

| Код | Ситуация |
|-----|----------|
| 200 | ✅ Успешно |
| 201 | ✅ Создано |
| 400 | ❌ Плохой запрос (неверные данные) |
| 401 | ❌ Не авторизован |
| 403 | ❌ Доступ запрещен |
| 404 | ❌ Не найдено |
| 500 | ❌ Ошибка сервера |

## Масштабируемость

### Принципы МОдульности

1. **Разделение ответственности**
   - Controllers - бизнес-логика
   - Models - схемы данных
   - Routes - связи между ними

2. **Добавление нового функционала**
   ```
   Хотим добавить Comments → 
   1. Создаем models/Comment.js
   2. Создаем controllers/commentController.js
   3. Создаем routes/commentRoutes.js
   4. Регистрируем в server.js
   ```

3. **Переиспользование кода**
   - authMiddleware можно применить к любому маршруту
   - Паттерны контроллеров скопированы для новых сущностей

## Зависимости между компонентами

```
server.js
├── config/db.js (подключение)
├── routes/userRoutes.js
│   └── controllers/userController.js
│       └── models/User.js
├── routes/itemRoutes.js
│   ├── middleware/authMiddleware.js (JWT)
│   └── controllers/itemController.js
│       └── models/Item.js (со ссылкой на User)
└── middleware/authMiddleware.js
    └── jsonwebtoken
```

## Конфигурация и переменные окружения

```
.env
├── MONGO_URI (подключение к БД)
├── JWT_SECRET (ключ для подписания токенов)
├── PORT (порт сервера)
└── NODE_ENV (режим работы)
```

## Примеры интеграции

### Добавление новой модели (например, Comments)

1. **Создать модель** (models/Comment.js)
2. **Создать контроллер** (controllers/commentController.js)
3. **Создать маршруты** (routes/commentRoutes.js)
4. **Зарегистрировать в server.js**

```javascript
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);
```

### Добавление нового middleware

```javascript
// middleware/customMiddleware.js
const customMiddleware = (req, res, next) => {
    // Логика
    next();
};

// Использование в route
router.post('/path', customMiddleware, controller);
```

## Performance Оптимизация

1. **Indexing** на часто запрашиваемых полях (email, category)
2. **Pagination** для больших списков
3. **Caching** популярных статей
4. **Lean queries** в Mongoose для чтения

## Тестирование архитектуры

Архитектура позволяет легко тестировать:
- Модели - проверка валидации
- Контроллеры - mock данные
- Маршруты - API тесты
- Middleware - цепочка функций

## Заключение

Архитектура Blog API следует компромиссу между:
- **Простотой** (для учебного проекта)
- **Модульностью** (для расширения)
- **Безопасностью** (JWT, хеширование)
- **Масштабируемостью** (разделение слоев)
