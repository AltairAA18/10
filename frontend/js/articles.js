// Работа со статьями
const articles = {
        // Текущие статьи
        list: [],

        // Текущий фильтр категории
        currentCategory: '',

        // Загрузить статьи
        async loadArticles() {
            try {
                let response;

                if (this.currentCategory) {
                    response = await api.getArticlesByCategory(this.currentCategory);
                } else {
                    response = await api.getArticles();
                }

                this.list = Array.isArray(response) ? response : [];
                this.renderArticles();
            } catch (error) {
                console.error('Ошибка загрузки статей:', error);
                document.getElementById('articlesList').innerHTML =
                    '<div class="empty-state"><p>Ошибка при загрузке статей</p></div>';
            }
        },

        // Отрисовать список статей
        renderArticles() {
            const container = document.getElementById('articlesList');

            if (this.list.length === 0) {
                container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>Статьи не найдены</h3>
                    <p>Пока нет опубликованных статей в этой категории</p>
                </div>
            `;
                return;
            }

            container.innerHTML = this.list.map(article => this.renderArticleCard(article)).join('');
        },

        // Отрисовать карточку статьи
        renderArticleCard(article) {
            const date = new Date(article.createdAt).toLocaleDateString('ru-RU');

            return `
            <div class="article-card" onclick="articles.viewArticle('${article._id}')">
                <div class="article-card-header">
                    <div class="article-category">${article.category}</div>
                    <h3 class="article-card-title">${article.title}</h3>
                    <p class="article-card-excerpt">${article.excerpt || article.content.substring(0, 150)}</p>
                </div>
                <div class="article-stats">
                    <div class="article-stat-item">👁️ ${article.views}</div>
                    <div class="article-stat-item">❤️ ${article.likes}</div>
                    <div class="article-stat-item">${date}</div>
                </div>
                <div class="article-card-meta">
                    <span class="article-author">${article.author.name}</span>
                </div>
            </div>
        `;
        },

        // Просмотреть одну статью
        async viewArticle(id) {
            try {
                const article = await api.getArticle(id);
                this.renderFullArticle(article);
                app.showPage('article');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        },

        // Отрисовать полную статью
        renderFullArticle(article) {
            const date = new Date(article.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const tagsHtml = article.tags && article.tags.length > 0 ?
                `<div class="article-full-tags">
                 ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
               </div>`
            : '';

        let actionsHtml = `
            <button class="btn btn-primary" onclick="articles.likeArticle('${article._id}')">
                ❤️ Лайк (${article.likes})
            </button>
        `;

        // Если текущий пользователь - автор статьи
        if (auth.isAuthenticated() && auth.currentUser.id === article.author._id) {
            actionsHtml += ` 
                <button class="btn btn-secondary btn-small" onclick="articles.editArticle('${article._id}')">
                    ✏️ Редактировать
                </button>
                <button class="btn btn-danger btn-small" onclick="articles.deleteArticle('${article._id}')">
                    🗑️ Удалить
                </button>
            `;
        }

        const isPublished = article.published 
            ? '<span style="color: green;">✓ Опубликовано</span>'
            : '<span style="color: orange;">⏸ Черновик</span>';

        const content = `
            <div class="article-full-back">
                <a href="#" onclick="app.showPage('articles'); return false;">← Вернуться к статьям</a>
            </div>
            <div class="article-full-header">
                <h1 class="article-full-title">${article.title}</h1>
                <div class="article-full-meta">
                    <div class="article-full-author">
                        <span>${article.author.name}</span>
                    </div>
                    <div>${date}</div>
                    <span class="article-full-category">${article.category}</span>
                    <div>${isPublished}</div>
                </div>
            </div>
            <div class="article-full-content">
                ${article.content.replace(/\n/g, '<br>')}
            </div>
            ${tagsHtml}
            <div class="article-full-actions">
                ${actionsHtml}
            </div>
        `;

        document.getElementById('articleContent').innerHTML = content;
    },

    // Лайкнуть статью
    async likeArticle(id) {
        try {
            const response = await api.likeArticle(id);
            
            // Обновить текущую статью
            const article = response.article;
            this.renderFullArticle(article);
            
            showNotification('Лайк добавлен!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Создать статью
    async createArticle(event) {
        event.preventDefault();

        if (!auth.requireAuth()) return;

        const title = document.getElementById('articleTitle')?.value?.trim();
        const excerpt = document.getElementById('articleExcerpt')?.value?.trim();
        const content = document.getElementById('articleContent')?.value?.trim();
        const category = document.getElementById('articleCategory')?.value?.trim();
        const tagsString = document.getElementById('articleTags')?.value?.trim();
        const published = document.getElementById('articlePublished')?.checked;

        // Подробная валидация
        if (!title) {
            showNotification('Ошибка: заполните название статьи', 'error');
            console.log('Ошибка валидации: пусто название');
            return;
        }
        if (!content) {
            showNotification('Ошибка: заполните содержание статьи', 'error');
            console.log('Ошибка валидации: пусто содержание');
            return;
        }
        if (!category) {
            showNotification('Ошибка: выберите категорию', 'error');
            console.log('Ошибка валидации: пусто категория');
            return;
        }

        const tags = tagsString 
            ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
            : [];

        try {
            await api.createArticle({
                title,
                excerpt: excerpt || content.substring(0, 500),
                content,
                category,
                tags,
                published
            });

            showNotification('Статья успешно создана!', 'success');
            document.getElementById('createForm').reset();

            setTimeout(() => {
                app.showPage('articles');
                articles.loadArticles();
            }, 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Редактировать статью
    async editArticle(id) {
        try {
            const article = await api.getArticle(id);

            // Проверить авторство
            if (article.author._id !== auth.currentUser.id) {
                showNotification('Вы не можете редактировать чужую статью', 'error');
                return;
            }

            // Заполнить форму редактирования
            document.getElementById('editArticleId').value = article._id;
            document.getElementById('editTitle').value = article.title;
            document.getElementById('editExcerpt').value = article.excerpt || '';
            document.getElementById('editContent').value = article.content;
            document.getElementById('editCategory').value = article.category;
            document.getElementById('editTags').value = article.tags ? article.tags.join(', ') : '';
            document.getElementById('editPublished').checked = article.published;

            app.showPage('edit');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Обновить статью
    async updateArticle(event) {
        event.preventDefault();

        const id = document.getElementById('editArticleId')?.value?.trim();
        const title = document.getElementById('editTitle')?.value?.trim();
        const excerpt = document.getElementById('editExcerpt')?.value?.trim();
        const content = document.getElementById('editContent')?.value?.trim();
        const category = document.getElementById('editCategory')?.value?.trim();
        const tagsString = document.getElementById('editTags')?.value?.trim();
        const published = document.getElementById('editPublished')?.checked;

        if (!title) {
            showNotification('Ошибка: заполните название статьи', 'error');
            return;
        }
        if (!content) {
            showNotification('Ошибка: заполните содержание статьи', 'error');
            return;
        }
        if (!category) {
            showNotification('Ошибка: выберите категорию', 'error');
            return;
        }

        const tags = tagsString 
            ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
            : [];

        try {
            await api.updateArticle(id, {
                title,
                excerpt: excerpt || content.substring(0, 500),
                content,
                category,
                tags,
                published
            });

            showNotification('Статья успешно обновлена!', 'success');

            setTimeout(() => {
                app.showPage('articles');
                articles.loadArticles();
            }, 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Удалить статью
    async deleteArticle(id) {
        if (!confirm('Вы уверены? Это действие нельзя отменить.')) {
            return;
        }

        try {
            await api.deleteArticle(id);
            showNotification('Статья удалена!', 'success');

            setTimeout(() => {
                app.showPage('articles');
                articles.loadArticles();
            }, 1000);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    },

    // Загрузить статьи пользователя
    async loadUserArticles() {
        try {
            const response = await api.getArticles();
            
            // Фильтруем статьи текущего пользователя
            const userArticles = response.filter(article => 
                article.author._id === auth.currentUser.id
            );

            return userArticles;
        } catch (error) {
            console.error('Ошибка загрузки статей пользователя:', error);
            return [];
        }
    }
};