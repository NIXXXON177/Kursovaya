// Общие функции для всех страниц

/**
 * Функция для lazy loading скриптов
 * @param {string} src - путь к скрипту
 * @returns {Promise} - промис, который резолвится при загрузке
 */
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = resolve
		script.onerror = reject
		document.head.appendChild(script)
	})
}

/**
 * Инициализация навигации и общих элементов
 */
function initCommon() {
	// Обновляем имя пользователя в header
	if (typeof AuthManager !== 'undefined') {
		AuthManager.updateUserNameInHeader()
	}

	// Обработчик выхода
	const logoutBtn = document.getElementById('logoutBtn')
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			localStorage.removeItem('authToken')
			localStorage.removeItem('userData')
			// Определяем правильный путь в зависимости от текущей страницы
			const isMainPage =
				window.location.pathname.endsWith('index.html') ||
				window.location.pathname.endsWith('/')
			window.location.href = isMainPage ? 'pages/login.html' : 'login.html'
		})
	}

	// Мобильное меню
	const navToggle = document.getElementById('navToggle')
	const navMenu = document.getElementById('navMenu')
	if (navToggle && navMenu) {
		navToggle.addEventListener('click', () => {
			navMenu.classList.toggle('active')
			navToggle.classList.toggle('active')
		})
	}
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initCommon)
