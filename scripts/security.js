// Модуль безопасности

class SecurityUtils {
    /**
     * Санитизация HTML - удаление потенциально опасных тегов
     * @param {string} input - Входная строка
     * @returns {string} - Очищенная строка
     */
    static sanitizeHTML(input) {
        if (typeof input !== 'string') return '';

        // Создаем временный элемент для парсинга
        const temp = document.createElement('div');
        temp.textContent = input;

        return temp.innerHTML;
    }

    /**
     * Экранирование HTML сущностей
     * @param {string} input - Входная строка
     * @returns {string} - Экранированная строка
     */
    static escapeHTML(input) {
        if (typeof input !== 'string') return '';

        const entityMap = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": ''',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return input.replace(/[&<>"'`=\/]/g, s => entityMap[s]);
    }

    /**
     * Валидация email
     * @param {string} email - Email для проверки
     * @returns {boolean} - Валиден ли email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Валидация логина (только буквы, цифры, подчеркивание)
     * @param {string} login - Логин для проверки
     * @returns {boolean} - Валиден ли логин
     */
    static validateLogin(login) {
        const loginRegex = /^[a-zA-Z0-9_]+$/;
        return loginRegex.test(login) && login.length >= 3 && login.length <= 20;
    }

    /**
     * Валидация пароля (минимум 6 символов)
     * @param {string} password - Пароль для проверки
     * @returns {boolean} - Валиден ли пароль
     */
    static validatePassword(password) {
        return typeof password === 'string' && password.length >= 6;
    }

    /**
     * Генерация CSRF токена
     * @returns {string} - CSRF токен
     */
    static generateCSRFToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    /**
     * Получение CSRF токена (создание если не существует)
     * @returns {string} - CSRF токен
     */
    static getCSRFToken() {
        let token = sessionStorage.getItem('csrf_token');
        if (!token) {
            token = this.generateCSRFToken();
            sessionStorage.setItem('csrf_token', token);
        }
        return token;
    }

    /**
     * Безопасное хранение токена авторизации
     * @param {string} token - Токен для хранения
     */
    static setAuthToken(token) {
        if (typeof token === 'string' && token.length > 0) {
            // В реальном приложении использовать httpOnly cookies
            // Пока используем localStorage с дополнительной защитой
            const secureToken = btoa(token + '|' + Date.now()); // Простое обфускация
            localStorage.setItem('authToken', secureToken);
        }
    }

    /**
     * Получение токена авторизации
     * @returns {string|null} - Токен или null
     */
    static getAuthToken() {
        const secureToken = localStorage.getItem('authToken');
        if (secureToken) {
            try {
                const decoded = atob(secureToken);
                const [token, timestamp] = decoded.split('|');

                // Проверка на истечение (24 часа)
                const age = Date.now() - parseInt(timestamp);
                if (age < 24 * 60 * 60 * 1000) {
                    return token;
                } else {
                    this.clearAuthToken();
                }
            } catch (e) {
                this.clearAuthToken();
            }
        }
        return null;
    }

    /**
     * Очистка токена авторизации
     */
    static clearAuthToken() {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('csrf_token');
    }

    /**
     * Валидация и очистка объекта данных
     * @param {Object} data - Объект для валидации
     * @returns {Object} - Очищенный объект
     */
    static sanitizeObject(data) {
        if (typeof data !== 'object' || data === null) return {};

        const sanitized = {};

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeHTML(value);
            } else if (typeof value === 'object') {
                sanitized[key] = this.sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }
}

// Экспорт для использования в других модулях
window.SecurityUtils = SecurityUtils;