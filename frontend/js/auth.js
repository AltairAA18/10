// Аутентификация
const auth = {
    // Текущий пользователь
    currentUser: null,

    // Инициализация
    init() {
        const token = api.getToken();
        if (token) {
            this.loadUserProfile();
        } else {
            this.updateUI();
        }
    },

    // Загрузить профиль пользователя
    async loadUserProfile() {
        try {
            const response = await api.getProfile();
            this.currentUser = response.user;
            this.updateUI();
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            api.removeToken();
            this.currentUser = null;
            this.updateUI();
        }
    },

    // Регистрация
    async register(event) {
        event.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            showNotification('Заполните все поля', 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Пароль должен быть минимум 6 символов', 'error');
            return;
        }

        try {
            const response = await api.register(name, email, password);
            api.setToken(response.token);
            this.currentUser = response.user;

            // Очистить форму
            document.getElementById('registerForm').reset();

            showNotification('Регистрация успешна!', 'success');
            this.updateUI();

            // Перейти на страницу статей
            setTimeout(() => {
                app.showPage('articles');
            }, 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Вход
    async login(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showNotification('Заполните все поля', 'error');
            return;
        }

        try {
            const response = await api.login(email, password);
            api.setToken(response.token);
            this.currentUser = response.user;

            // Очистить форму
            document.getElementById('loginForm').reset();

            showNotification('Вход выполнен успешно!', 'success');
            this.updateUI();

            // Перейти на страницу статей
            setTimeout(() => {
                app.showPage('articles');
            }, 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Выход
    logout() {
        api.removeToken();
        this.currentUser = null;
        this.updateUI();
        app.showPage('articles');
        showNotification('Вы вышли из аккаунта', 'info');
    },

    // Обновить UI (показать/скрыть элементы в зависимости от статуса)
    updateUI() {
        const userNav = document.getElementById('userNav');
        const guestNav = document.getElementById('guestNav');
        const profileLink = document.getElementById('profileLink');

        if (this.currentUser) {
            userNav.style.display = 'flex';
            guestNav.style.display = 'none';

            if (profileLink) {
                profileLink.textContent = `👤 ${this.currentUser.name}`;
            }
        } else {
            userNav.style.display = 'none';
            guestNav.style.display = 'flex';
        }
    },

    // Проверить авторизацию
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Требовать авторизацию
    requireAuth() {
        if (!this.isAuthenticated()) {
            showNotification('Требуется авторизация', 'warning');
            app.showPage('login');
            return false;
        }
        return true;
    }
};