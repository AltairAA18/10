// Главное приложение
const app = {
    // Инициализация приложения
    init() {
        // Инициализировать аутентификацию
        auth.init();

        // Загрузить статьи
        articles.loadArticles();

        // Добавить слушатели событий
        this.attachEventListeners();

        console.log('Приложение инициализировано');
    },

    // Показать страницу
    showPage(pageName) {
        // Скрыть все страницы
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Показать нужную страницу
        const page = document.getElementById(`${pageName}Page`);
        if (page) {
            page.classList.add('active');

            //특별한обработка для разных страниц
            if (pageName === 'articles') {
                this.currentCategory = '';
                articles.loadArticles();
                this.updateCategoryButtons();
            } else if (pageName === 'profile') {
                this.loadProfile();
            }

            // Scroll to top
            window.scrollTo(0, 0);
        }
    },

    // Фильтровать по категориям
    filterByCategory(category) {
        this.currentCategory = category;
        articles.currentCategory = category;

        // Обновить активную кнопку
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(category) || (category === '' && btn.textContent === 'Все')) {
                btn.classList.add('active');
            }
        });

        // Загрузить статьи
        articles.loadArticles();
    },

    // Обновить кнопки категорий
    updateCategoryButtons() {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            if (btn.textContent === 'Все') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    // Загрузить профиль пользователя
    async loadProfile() {
        if (!auth.isAuthenticated()) {
            app.showPage('login');
            return;
        }

        try {
            // Заполнить данные профиля
            document.getElementById('profileName').textContent = auth.currentUser.name;
            document.getElementById('profileEmail').textContent = auth.currentUser.email;

            // Загрузить статьи пользователя
            const userArticles = await articles.loadUserArticles();

            // Отрисовать статьи
            const container = document.getElementById('userArticles');

            if (userArticles.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <p>Вы еще не написали ни одной статьи</p>
                        <a href="#" onclick="app.showPage('create')" class="btn btn-primary" style="margin-top: 15px;">Написать статью</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = userArticles.map(article => `
                <div class="user-article-item">
                    <div class="user-article-info">
                        <h4>${article.title}</h4>
                        <div class="user-article-meta">
                            📁 ${article.category} • 👁️ ${article.views} просмотров • ❤️ ${article.likes} лайков
                            ${!article.published ? ' • ⏸ Черновик' : ' • ✓ Опубликовано'}
                        </div>
                    </div>
                    <div class="user-article-actions">
                        <button class="btn btn-secondary btn-small" onclick="articles.editArticle('${article._id}')">
                            Редактировать
                        </button>
                        <button class="btn btn-danger btn-small" onclick="articles.deleteArticle('${article._id}')">
                            Удалить
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            showNotification('Ошибка загрузки профиля', 'error');
        }
    },

    // Добавить слушатели событий
    attachEventListeners() {
        // Проверить нажатие Enter в поле поиска (если будет)
        // добавить при необходимости
    },

    // Текущая категория
    currentCategory: ''
};

// Показывать уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Скрыть через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Инициализировать приложение при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});