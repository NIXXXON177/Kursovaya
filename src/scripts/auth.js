// Модуль авторизации

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Проверяем, находимся ли мы на странице логина
        if (window.location.pathname.includes('login.html')) {
            this.setupLoginForm();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');
        const errorDiv = document.getElementById('loginError');

        const login = loginInput.value.trim();
        const password = passwordInput.value;

        // Очистка предыдущих ошибок
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }

        // Базовая валидация
        if (!login || !password) {
            this.showError('Заполните все поля');
            return;
        }

        try {
            // Имитация запроса к серверу
            const authResult = await this.mockAuthRequest(login, password);
            
            if (authResult.success) {
                // Сохраняем токен и данные пользователя
                localStorage.setItem('authToken', authResult.token);
                localStorage.setItem('userData', JSON.stringify(authResult.userData));
                
                // Перенаправляем на главную страницу
                window.location.href = '../index.html';
            } else {
                this.showError(authResult.message || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            this.showError('Ошибка соединения с сервером');
        }
    }

    async mockAuthRequest(login, password) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock данные для демонстрации
        const mockUsers = {
            'petrov': {
                password: 'password123',
                userData: {
                    employee: {
                        name: "Петров Алексей Владимирович",
                        position: "инженер-программист",
                        department: "IT-отдел",
                        email: "a.petrov@technoline.ru"
                    }
                }
            },
            'ivanov': {
                password: 'password123',
                userData: {
                    employee: {
                        name: "Иванов Сергей Петрович",
                        position: "ведущий разработчик",
                        department: "IT-отдел",
                        email: "s.ivanov@technoline.ru"
                    }
                }
            }
        };

        const user = mockUsers[login.toLowerCase()];

        if (user && user.password === password) {
            return {
                success: true,
                token: 'mock-jwt-token-' + Date.now(),
                userData: user.userData
            };
        } else {
            return {
                success: false,
                message: 'Неверный логин или пароль'
            };
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        } else {
            // Создаем элемент для ошибки, если его нет
            const errorElement = document.createElement('div');
            errorElement.className = 'notification error';
            errorElement.innerHTML = `
                <div class="notification-icon">⚠️</div>
                <div class="notification-content">
                    <h4>Ошибка авторизации</h4>
                    <p>${message}</p>
                </div>
            `;
            
            const form = document.getElementById('loginForm');
            if (form) {
                form.prepend(errorElement);
                
                // Автоматическое удаление через 5 секунд
                setTimeout(() => {
                    errorElement.remove();
                }, 5000);
            }
        }
    }

    // Проверка авторизации (для других страниц)
    static checkAuth() {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    // Получение данных пользователя
    static getUserData() {
        try {
            return JSON.parse(localStorage.getItem('userData'));
        } catch {
            return null;
        }
    }
}

// Инициализация на странице логина
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        new AuthManager();
    });
}