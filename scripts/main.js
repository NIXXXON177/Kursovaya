class MainApp {
	constructor() {
		this.employeeData = null
		this.init()
	}

	async init() {
		if (!this.checkAuth()) {
			window.location.href = 'pages/login.html'
			return
		}

		this.createGlassEffect()

		await this.loadEmployeeData()

		// Инициализируем уведомления после загрузки данных
		if (typeof NotificationManager !== 'undefined') {
			new NotificationManager(this.employeeData)
		}

		this.renderEmployeeInfo()
		this.renderProgress()
		this.renderActiveCourses()

		// Lazy load дополнительных скриптов
		this.loadAdditionalScripts()
	}

	async loadAdditionalScripts() {
		try {
			// Загружаем modal.js асинхронно
			await loadScript('scripts/modal.js')
		} catch (error) {
			console.error('Ошибка загрузки дополнительных скриптов:', error)
		}
	}

	createGlassEffect() {
		const glassBg = document.createElement('div')
		glassBg.className = 'glass-bg'

		for (let i = 0; i < 4; i++) {
			const bubble = document.createElement('div')
			bubble.className = 'glass-bubble'
			glassBg.appendChild(bubble)
		}

		document.body.appendChild(glassBg)
	}

	checkAuth() {
		const token = SecurityUtils.getAuthToken()
		const userData = localStorage.getItem('userData')

		if (!token || !userData) {
			return false
		}

		try {
			this.employeeData = JSON.parse(userData)
			return true
		} catch (error) {
			console.error('Ошибка парсинга данных пользователя:', error)
			return false
		}
	}

	async loadEmployeeData() {
		try {
			// Сначала пытаемся загрузить данные из localStorage
			const savedUserData = localStorage.getItem('userData')
			if (savedUserData) {
				this.employeeData = JSON.parse(savedUserData)
				return
			}

			// Если данных нет, используем демо-данные для Петрова
			const mockData = {
				employee: {
					name: 'Петров Алексей Владимирович',
					position: 'инженер-программист',
					department: 'IT-отдел',
					email: 'a.petrov@technoline.ru',
				},
				courses: [
					{
						id: 1,
						title: 'IT-безопасность',
						status: 'пройден',
						start_date: '2024-01-15',
						due_date: '2025-01-15',
						certificate_date: '2024-01-20',
						progress: 100,
						description: 'Курс по основам информационной безопасности',
						modules: [
							{
								id: 1,
								title: 'Введение в информационную безопасность',
								type: 'video',
								duration: '15 мин',
								completed: true,
								content: 'Основные понятия информационной безопасности...',
							},
							{
								id: 2,
								title: 'Киберугрозы и атаки',
								type: 'text',
								duration: '20 мин',
								completed: true,
								content:
									'Типы киберугроз:\n- Фишинг\n- Вирусы\n- DDoS-атаки...',
							},
						],
						test: {
							questions: [
								{
									id: 1,
									question: 'Что такое фишинг?',
									options: [
										'Вид спорта',
										'Кибермошенничество',
										'Тип программирования',
										'Метод шифрования',
									],
									correct: 1,
								},
							],
							passed: true,
							score: 100,
						},
					},
					{
						id: 2,
						title: 'Работа с Laravel',
						status: 'в процессе',
						start_date: '2025-03-01',
						due_date: '2025-06-01',
						progress: 45,
						description: 'Изучение фреймворка Laravel для веб-разработки',
						modules: [
							{
								id: 1,
								title: 'Установка и настройка Laravel',
								type: 'video',
								duration: '25 мин',
								completed: true,
								content:
									'# Установка\n\nКоманда: composer create-project laravel/laravel project-name',
							},
							{
								id: 2,
								title: 'Маршрутизация и контроллеры',
								type: 'text',
								duration: '30 мин',
								completed: true,
								content:
									"## Маршруты\n\nRoute::get('/home', [HomeController::class, 'index']);",
							},
							{
								id: 3,
								title: 'Работа с базой данных',
								type: 'video',
								duration: '40 мин',
								completed: false,
								content:
									'## Миграции\n\nphp artisan make:migration create_users_table',
							},
							{
								id: 4,
								title: 'Eloquent ORM',
								type: 'text',
								duration: '35 мин',
								completed: false,
								content: '## Модели\n\nclass User extends Model {...}',
							},
						],
						test: {
							questions: [
								{
									id: 1,
									question: 'Какая команда создает новый проект Laravel?',
									options: [
										'npm create laravel',
										'composer create-project laravel/laravel',
										'laravel new project',
										'php artisan new',
									],
									correct: 1,
								},
							],
							passed: false,
							score: 0,
						},
					},
				],
				progress: 60,
			}

			this.employeeData = mockData
			localStorage.setItem('userData', JSON.stringify(mockData))
		} catch (error) {
			console.error('Ошибка загрузки данных:', error)
			this.showError('Не удалось загрузить данные')
		}
	}

	renderEmployeeInfo() {
		const container = document.getElementById('employeeInfo')
		if (!container || !this.employeeData) return

		const { employee } = this.employeeData

		while (container.firstChild) {
			container.removeChild(container.firstChild)
		}

		const detailsDiv = document.createElement('div')
		detailsDiv.className = 'employee-details'

		const fields = [
			{ label: 'ФИО', value: employee.name },
			{ label: 'Должность', value: employee.position },
			{ label: 'Подразделение', value: employee.department },
			{ label: 'Email', value: employee.email },
		]

		fields.forEach(field => {
			const p = document.createElement('p')
			const strong = document.createElement('strong')
			strong.textContent = `${field.label}: `
			p.appendChild(strong)
			p.appendChild(document.createTextNode(field.value))
			detailsDiv.appendChild(p)
		})

		container.appendChild(detailsDiv)
	}

	renderProgress() {
		const progressPercent = document.getElementById('progressPercent')
		const progressFill = document.getElementById('progressFill')

		if (!progressPercent || !progressFill || !this.employeeData) return

		const progress = this.employeeData.progress || 0

		progressPercent.textContent = `${progress}%`
		progressFill.style.width = `${progress}%`
	}

	renderActiveCourses() {
		const container = document.getElementById('activeCourses')
		if (!container || !this.employeeData) return

		const activeCourses = this.employeeData.courses.slice(0, 3)

		while (container.firstChild) {
			container.removeChild(container.firstChild)
		}

		if (activeCourses.length === 0) {
			const emptyMessage = document.createElement('p')
			emptyMessage.className = 'text-center'
			emptyMessage.textContent = 'Нет активных курсов'
			container.appendChild(emptyMessage)
			return
		}

		activeCourses.forEach(course => {
			const courseCard = this.createCourseCard(course)
			container.appendChild(courseCard)
		})
	}

	createCourseCard(course) {
		const card = document.createElement('div')
		card.className = 'card course-card'
		card.addEventListener('click', () => {
			window.location.href = `pages/course-details.html?id=${course.id}`
		})

		const title = document.createElement('h3')
		title.className = 'course-title'
		title.textContent = course.title

		const status = document.createElement('div')
		status.className = `course-status ${this.getStatusClass(course.status)}`
		status.textContent = this.getStatusText(course.status)

		const meta = document.createElement('div')
		meta.className = 'course-meta'

		const startDate = document.createElement('p')
		const startStrong = document.createElement('strong')
		startStrong.textContent = 'Дата начала: '
		startDate.appendChild(startStrong)
		startDate.appendChild(
			document.createTextNode(this.formatDate(course.start_date))
		)

		const dueDate = document.createElement('p')
		const dueStrong = document.createElement('strong')
		dueStrong.textContent = 'Срок окончания: '
		dueDate.appendChild(dueStrong)
		dueDate.appendChild(
			document.createTextNode(this.formatDate(course.due_date))
		)

		meta.appendChild(startDate)
		meta.appendChild(dueDate)

		if (course.progress > 0) {
			const progress = document.createElement('p')
			const progressStrong = document.createElement('strong')
			progressStrong.textContent = 'Прогресс: '
			progress.appendChild(progressStrong)
			progress.appendChild(document.createTextNode(`${course.progress}%`))
			meta.appendChild(progress)
		}

		card.appendChild(title)
		card.appendChild(status)
		card.appendChild(meta)

		return card
	}

	getStatusClass(status) {
		switch (status) {
			case 'пройден':
				return 'status-completed'
			case 'в процессе':
				return 'status-in-progress'
			case 'назначен':
				return 'status-upcoming'
			case 'просрочен':
				return 'status-expired'
			default:
				return ''
		}
	}

	getStatusText(status) {
		switch (status) {
			case 'пройден':
				return 'Пройден'
			case 'в процессе':
				return 'В процессе'
			case 'назначен':
				return 'Назначен'
			case 'просрочен':
				return 'Просрочен'
			default:
				return status
		}
	}

	formatDate(dateString) {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU')
	}

	showError(message) {
		const notification = document.createElement('div')
		notification.className = 'notification error'

		const icon = document.createElement('div')
		icon.className = 'notification-icon'
		icon.textContent = '⚠️'

		const content = document.createElement('div')
		content.className = 'notification-content'

		const title = document.createElement('h4')
		title.textContent = 'Ошибка'

		const text = document.createElement('p')
		text.textContent = message

		content.appendChild(title)
		content.appendChild(text)
		notification.appendChild(icon)
		notification.appendChild(content)

		const container =
			document.getElementById('notificationsContainer') || document.body
		container.appendChild(notification)

		setTimeout(() => {
			notification.remove()
		}, 5000)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new MainApp()

	const logoutBtn = document.getElementById('logoutBtn')
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			SecurityUtils.clearAuthToken()
			localStorage.removeItem('userData')
			window.location.href = 'pages/login.html'
		})
	}

	const navToggle = document.getElementById('navToggle')
	const navMenu = document.getElementById('navMenu')

	if (navToggle && navMenu) {
		navToggle.addEventListener('click', () => {
			navMenu.classList.toggle('active')
		})
	}
})
