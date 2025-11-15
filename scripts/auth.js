// Модуль авторизации

class AuthManager {
	constructor() {
		this.init()
	}

	init() {
		if (window.location.pathname.includes('login.html')) {
			if (AuthManager.checkAuth()) {
				window.location.href = '../index.html'
				return
			}
			this.setupLoginForm()
		}
	}

	setupLoginForm() {
		const loginForm = document.getElementById('loginForm')

		if (loginForm) {
			loginForm.addEventListener('submit', e => {
				e.preventDefault()
				this.handleLogin()
			})
		}
	}

	async handleLogin() {
		const loginInput = document.getElementById('login')
		const passwordInput = document.getElementById('password')
		const errorDiv = document.getElementById('loginError')

		const login = SecurityUtils.sanitizeHTML(loginInput.value.trim())
		const password = passwordInput.value

		if (errorDiv) {
			errorDiv.classList.add('hidden')
		}

		// Валидация входных данных
		if (!login || !password) {
			this.showError('Заполните все поля')
			return
		}

		if (!SecurityUtils.validateLogin(login)) {
			this.showError(
				'Логин должен содержать 3-20 символов (буквы, цифры, подчеркивание)'
			)
			return
		}

		if (!SecurityUtils.validatePassword(password)) {
			this.showError('Пароль должен содержать минимум 6 символов')
			return
		}

		try {
			const authResult = await this.mockAuthRequest(login, password)

			if (authResult.success) {
				// Безопасное хранение токена
				SecurityUtils.setAuthToken(authResult.token)
				localStorage.setItem(
					'userData',
					JSON.stringify(SecurityUtils.sanitizeObject(authResult.userData))
				)

				window.location.href = '../index.html'
			} else {
				this.showError(authResult.message || 'Ошибка авторизации')
			}
		} catch (error) {
			console.error('Ошибка авторизации:', error)
			this.showError('Ошибка соединения с сервером')
		}
	}

	async mockAuthRequest(login, password) {
		await new Promise(resolve => setTimeout(resolve, 1000))

		const mockUsers = {
			petrov: {
				password: 'password123',
				userData: {
					employee: {
						name: 'Петров Алексей Владимирович',
						position: 'инженер-программист',
						department: 'IT-отдел',
						email: 'a.petrov@technoline.ru',
					},
				},
			},
			ivanov: {
				password: 'password123',
				userData: {
					employee: {
						name: 'Иванов Сергей Петрович',
						position: 'ведущий разработчик',
						department: 'IT-отдел',
						email: 's.ivanov@technoline.ru',
					},
				},
			},
		}

		const user = mockUsers[login.toLowerCase()]

		if (user && user.password === password) {
			return {
				success: true,
				token: 'mock-jwt-token-' + Date.now(),
				userData: user.userData,
			}
		} else {
			return {
				success: false,
				message: 'Неверный логин или пароль',
			}
		}
	}

	showError(message) {
		const errorDiv = document.getElementById('loginError')

		if (errorDiv) {
			errorDiv.textContent = message
			errorDiv.classList.remove('hidden')
		} else {
			const errorElement = document.createElement('div')
			errorElement.className = 'notification error'
			errorElement.innerHTML = `
                <div class="notification-icon">⚠️</div>
                <div class="notification-content">
                    <h4>Ошибка авторизации</h4>
                    <p>${message}</p>
                </div>
            `

			const form = document.getElementById('loginForm')
			if (form) {
				form.prepend(errorElement)

				setTimeout(() => {
					errorElement.remove()
				}, 5000)
			}
		}
	}
	static checkAuth() {
		const token = localStorage.getItem('authToken')
		return !!token
	}

	static getUserData() {
		try {
			return JSON.parse(localStorage.getItem('userData'))
		} catch {
			return null
		}
	}

	/**
	 * Обновляет имя пользователя в header на всех страницах
	 */
	static updateUserNameInHeader() {
		const userData = AuthManager.getUserData()
		const userNameElement = document.getElementById('userName')

		if (userNameElement && userData && userData.employee) {
			const fullName = userData.employee.name
			const nameParts = fullName.split(' ')

			// Форматируем имя в формате "Фамилия И."
			if (nameParts.length >= 2) {
				const lastName = nameParts[0]
				const firstNameInitial = nameParts[1].charAt(0) + '.'
				userNameElement.textContent = `${lastName} ${firstNameInitial}`
			} else {
				userNameElement.textContent = fullName
			}
		}
	}
}

if (window.location.pathname.includes('login.html')) {
	document.addEventListener('DOMContentLoaded', () => {
		new AuthManager()
	})
}
