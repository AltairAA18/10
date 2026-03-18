# Инструкция по запуску проекта

## Предварительные требования

Убедитесь, что у вас установлены:

1. **Node.js** (версия 14 или выше)
   - Скачайте с https://nodejs.org/
   - Проверьте установку: `node -v` и `npm -v`

2. **MongoDB**
   - **Вариант 1**: Локальная установка
     - Скачайте с https://www.mongodb.com/try/download/community
     - Установите и запустите MongoDB
   
   - **Вариант 2**: MongoDB Atlas (облачное решение, рекомендуется)
     - Создайте аккаунт на https://www.mongodb.com/cloud/atlas
     - Создайте бесплатный кластер
     - Получите connection string

3. **Git** (для управления версиями)
   - Скачайте с https://git-scm.com/

## Шаги установки

### 1. Скачайте код проекта

```bash
# Если у вас есть GitHub репозиторий
git clone <ваш-репозиторий>
cd blog-api

# Или просто скопируйте папку проекта
cd путь/к/проекту
```

### 2. Установите зависимости

```bash
npm install
```

Это установит все необходимые пакеты из `package.json`:
- express - веб-фреймворк
- mongoose - ODM для MongoDB
- jsonwebtoken - JWT аутентификация
- bcryptjs - хеширование паролей
- cors - кроссдоменные запросы
- nodemon - автоперезагрузка при разработке

### 3. Создайте файл .env

Скопируйте пример:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл с вашими данными:

```env
# Для локальной MongoDB
MONGO_URI=mongodb://localhost:27017/blog_db

# Для MongoDB Atlas - используйте ваш connection string:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority

# Генерируйте надежный JWT Secret
JWT_SECRET=your_super_secret_key_change_this_in_production

PORT=5000
NODE_ENV=development
```

### 4. Запустите MongoDB

**Вариант 1: Локальная MongoDB**

```bash
# На Windows (если MongoDB установлена)
mongod

# На macOS/Linux
mongod
```

**Вариант 2: MongoDB Atlas**
- Связь уже настроена в `MONGO_URI`

### 5. Запустите сервер

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Режим production
npm start
```

Вы должны увидеть:
```
🚀 Сервер запущен на http://localhost:5000
MongoDB подключена
```

## Проверка работоспособности

### Через браузер

1. Откройте http://localhost:5000
   - Должно отобразиться: `{"message":"Blog API работает","version":"1.0.0"}`

### Через cURL

```bash
# 1. Регистрация
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Получить статьи
curl http://localhost:5000/api/articles
```

### Через REST Client в VS Code

1. Установите расширение "REST Client"
2. Откройте файл `requests.rest`
3. Нажмите "Send Request" на нужный запрос

## Структура проекта

```
blog-api/
├── config/
│   └── db.js                # Подключение к MongoDB
├── controllers/
│   ├── userController.js   # Логика пользователей
│   └── itemController.js   # Логика статей
├── models/
│   ├── User.js             # Модель User
│   └── Item.js             # Модель Article (статьи)
├── routes/
│   ├── userRoutes.js       # Маршруты /api/users
│   └── itemRoutes.js       # Маршруты /api/articles
├── middleware/
│   └── authMiddleware.js   # Проверка JWT токена
├── server.js               # Главный файл приложения
├── package.json            # Зависимости проекта
├── .env                    # Переменные окружения (не коммитить!)
├── .env.example            # Пример переменных окружения
├── .gitignore              # Файлы для исключения из Git
├── README.md               # Основная документация
└── requests.rest           # Примеры API запросов
```

## Команды npm

```bash
# Запуск в режиме разработки
npm run dev

# Запуск в режиме production
npm start

# Проверка и установка обновлений
npm update

# Удаление всех зависимостей и переустановка
rm -rf node_modules package-lock.json
npm install

# Скрипт для тестирования (если добавлен)
npm test
```

## Возможные проблемы

### "MongoDB недоступна"

**Проблема**: `MongoServerSelectionError`

**Решение**:
1. Убедитесь, что MongoDB запущена
2. Проверьте MONGO_URI в .env
3. Если используете MongoDB Atlas, проверьте:
   - IP адрес whitelisted
   - Правильный пароль в connection string
   - Интернет соединение

### "Порт 5000 уже используется"

**Решение**:
```bash
# Измените PORT в .env на другой, например 5001
PORT=5001

# Или найдите процесс и завершите его
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### "Ошибка при запуске: Cannot find module"

**Решение**:
```bash
# Переустановите зависимости
npm install
```

### "JWT_SECRET не определен"

**Решение**:
1. Убедитесь, что .env файл существует
2. Проверьте, что в .env есть строка `JWT_SECRET=...`
3. Переустартуйте сервер после изменения .env

## Интеграция с Frontend

Если у вас уже есть frontend приложение:

1. Обновите API URL в frontend коде:
```javascript
const API_URL = 'http://localhost:5000';
```

2. Запросы из frontend должны использовать этот URL

3. Убедитесь, что CORS включен (по умолчанию включен)

Подробнее в [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

## Git использование

```bash
# Инициализация репозитория (если еще не инициализирован)
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: Blog API setup"

# Добавьте удаленный репозиторий
git remote add origin https://github.com/yourusername/blog-api.git

# Загрузите на GitHub
git branch -M main
git push -u origin main
```

## Development лучшие практики

1. **Логирование**: Используйте `console.log()` для отладки
2. **Validation**: Проверяйте входные данные перед обработкой
3. **Error Handling**: Используйте try-catch для асинхронного кода
4. **Comments**: Добавляйте комментарии для сложной логики
5. **Testing**: Протестируйте API перед коммитом

## Production развертывание

При развертывании на production сервер:

1. Установите NODE_ENV=production
2. Используйте надежный JWT_SECRET (минимум 32 символа)
3. Используйте HTTPS
4. Настройте переменные окружения на хостинге
5. Используйте процесс менеджер (PM2, Forever)

Пример с PM2:
```bash
npm install -g pm2
pm2 start server.js --name "blog-api"
pm2 save
pm2 startup
```

## Дополнительные ресурсы

- [Express.js документация](https://expressjs.com/)
- [MongoDB документация](https://docs.mongodb.com/)
- [Mongoose документация](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Node.js документация](https://nodejs.org/docs/)

## Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь в правильности настроек в .env
3. Проверьте соединение с базой данных
4. Обратитесь к документации указанных технологий
