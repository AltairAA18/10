# Blog API - Backend

Серверная часть веб-приложения "Блог" на Node.js с использованием Express.js и MongoDB.

## 📋 Описание проекта

Это полноценный REST API для управления блогом со статьями. Приложение поддерживает:
- Регистрацию и авторизацию пользователей
- Управление статьями (создание, редактирование, удаление)
- Систему лайков и просмотров
- Категоризацию статей
- Контроль доступа с использованием JWT токенов

## 🛠 Технологический стек

- **Backend**: Node.js с Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Безопасность**: bcryptjs для хеширования паролей
- **CORS**: для кроссдоменных запросов
- **Переменные окружения**: dotenv

## 📦 Установка

### Требования
- Node.js (v14+)
- MongoDB (локально или облачная версия)
- npm или yarn

### Шаги установки

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd blog-api
```

2. **Установите зависимости**
```bash
npm install
```

3. **Создайте файл .env**
```bash
cp .env.example .env
```

4. **Отредактируйте .env с вашими данными**
```env
MONGO_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=your_secure_secret_key_here
PORT=5000
NODE_ENV=development
```

5. **Убедитесь, что MongoDB запущен**
```bash
# Если MongoDB установлена локально
mongod
```

6. **Запустите сервер**
```bash
# Режим разработки с автоперезагрузкой
npm run dev

# Режим production
npm start
```

Сервер будет доступен по адресу: `http://localhost:5000`

## 📚 API Документация

### 1. Аутентификация

#### Регистрация пользователя
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ответ успеха (201)**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": "64a7b2c...",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Вход пользователя
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ответ успеха (200)**
```json
{
  "message": "Вход выполнен успешно",
  "user": {
    "id": "64a7b2c...",
    "name": "Иван Петров",
    "email": "ivan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Статьи

#### Получить все опубликованные статьи
```http
GET /api/articles
```

**Ответ (200)**
```json
[
  {
    "_id": "64a7b2c...",
    "title": "Моя первая статья",
    "content": "Содержание статьи...",
    "excerpt": "Краткое описание...",
    "category": "Технология",
    "tags": ["javascript", "nodejs"],
    "views": 42,
    "likes": 10,
    "author": {
      "_id": "64a7b1a...",
      "name": "Иван Петров",
      "email": "ivan@example.com"
    },
    "published": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
]
```

#### Получить статью по ID
```http
GET /api/articles/:id
```

**Ответ (200)** - возвращает одну статью (увеличивает счетчик просмотров)

#### Получить статьи по категории
```http
GET /api/articles/category/:category
```

**Параметры**: `category` - название категории

#### Создать статью (требуется авторизация)
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Новая статья",
  "content": "Полное содержание статьи",
  "excerpt": "Краткое описание",
  "category": "Технология",
  "tags": ["javascript", "web"],
  "published": false
}
```

**Ответ успеха (201)**

#### Обновить статью (требуется авторизация)
```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Обновленное название",
  "content": "Обновленное содержание",
  "published": true
}
```

**Ответ успеха (200)**

#### Удалить статью (требуется авторизация)
```http
DELETE /api/articles/:id
Authorization: Bearer <token>
```

**Ответ успеха (200)**

#### Добавить лайк статье
```http
POST /api/articles/:id/like
```

**Ответ успеха (200)**

## 🔐 Аутентификация

Все защищенные маршруты требуют JWT токена в заголовке `Authorization`:

```http
Authorization: Bearer <your_jwt_token>
```

Токен получается при регистрации или входе и действует 7 дней.

## 📂 Структура проекта

```
├── config/
│   └── db.js              # Подключение к MongoDB
├── controllers/
│   ├── userController.js  # Логика регистрации и входа
│   └── itemController.js  # Логика работы со статьями
├── models/
│   ├── User.js            # Схема пользователя
│   └── Item.js            # Схема статьи
├── routes/
│   ├── userRoutes.js      # Маршруты аутентификации
│   └── itemRoutes.js      # Маршруты статей
├── middleware/
│   └── authMiddleware.js  # Middleware проверки JWT
├── server.js              # Главный файл приложения
├── package.json           # Зависимости проекта
├── .env                   # Переменные окружения
├── .env.example           # Пример переменных окружения
└── README.md              # Эта документация
```

## 🔄 CRUD операции

### Create (Создание)
- **POST /api/articles** - создать новую статью (требует авторизацию)

### Read (Чтение)
- **GET /api/articles** - получить все опубликованные статьи
- **GET /api/articles/:id** - получить одну статью по ID
- **GET /api/articles/category/:category** - получить статьи по категории

### Update (Обновление)
- **PUT /api/articles/:id** - обновить статью (требует авторизацию, только автор)

### Delete (Удаление)
- **DELETE /api/articles/:id** - удалить статью (требует авторизацию, только автор)

## ⚙️ Коды ответов

| Код | Значение |
|-----|----------|
| 200 | OK - Успешный запрос |
| 201 | Created - Ресурс успешно создан |
| 400 | Bad Request - Неправильные данные запроса |
| 401 | Unauthorized - Пользователь не авторизован |
| 403 | Forbidden - Доступ запрещен |
| 404 | Not Found - Ресурс не найден |
| 500 | Internal Server Error - Ошибка сервера |

## 🧪 Примеры использования

### С помощью cURL

```bash
# Регистрация
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван",
    "email": "ivan@example.com",
    "password": "password123"
  }'

# Получить статьи
curl http://localhost:5000/api/articles

# Создать статью (с токеном)
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Моя статья",
    "content": "Содержание...",
    "category": "Технология",
    "published": true
  }'
```

### С помощью Postman

1. Импортируйте коллекцию запросов из файла `postman_collection.json` (если предусмотрена)
2. Установите переменную окружения `base_url` = `http://localhost:5000`
3. При регистрации/входе токен автоматически сохраняется
4. Используйте сохраненный токен в защищенных запросах

## 🚀 Развертывание

### На Heroku

```bash
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

### На другие платформы

Убедитесь, что переменные окружения установлены правильно.

## 📝 Лучшие практики

1. **Никогда не коммитьте .env файл** - используйте .env.example
2. **Меняйте JWT_SECRET в production**
3. **Используйте HTTPS в production**
4. **Регулярно обновляйте зависимости**: `npm update`
5. **Логируйте ошибки для отладки**

## 🐛 Возможные проблемы

### MongoDB не подключается
- Убедитесь, что MongoDB запущена
- Проверьте правильность MONGO_URI в .env

### Ошибка "Нет токена"
- Убедитесь, что отправляете заголовок `Authorization: Bearer <token>`

### CORS ошибка
- Проверьте, что CORS включен на сервере
- Убедитесь в правильности адреса frontend приложения

## 📄 Лицензия

ISC

## 👤 Автор

Разработано для учебного проекта по веб-разработке.

## 📞 Контакты

При возникновении вопросов обратитесь к документации MongoDB и Express.js.
#   1 0  
 