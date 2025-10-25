// Модуль уведомлений

class NotificationManager {
	constructor(employeeData) {
		this.employeeData = employeeData
		this.notifications = []
		this.init()
	}

	init() {
		this.checkCourseDeadlines()
		this.renderNotifications()
	}

	checkCourseDeadlines() {
		if (!this.employeeData || !this.employeeData.courses) return

		const now = new Date()
		const oneWeekMs = 7 * 24 * 60 * 60 * 1000

		this.employeeData.courses.forEach(course => {
			const dueDate = new Date(course.due_date)
			const timeDiff = dueDate - now

			if (timeDiff > 0 && timeDiff <= oneWeekMs) {
				const daysLeft = Math.ceil(timeDiff / (24 * 60 * 60 * 1000))

				this.notifications.push({
					type: 'warning',
					title: 'Срок сдачи курса',
					message: `Курс "${
						course.title
					}" истекает через ${daysLeft} ${this.getDayText(daysLeft)}`,
					courseId: course.id,
				})
			}

			if (timeDiff < 0 && course.status !== 'пройден') {
				this.notifications.push({
					type: 'error',
					title: 'Просроченный курс',
					message: `Курс "${course.title}" просрочен`,
					courseId: course.id,
				})
			}
		})

		if (this.notifications.length === 0) {
			this.notifications.push({
				type: 'info',
				title: 'Добро пожаловать!',
				message: 'Все курсы актуальны. Приятного обучения!',
			})
		}
	}

	getDayText(days) {
		if (days === 1) return 'день'
		if (days >= 2 && days <= 4) return 'дня'
		return 'дней'
	}

	renderNotifications() {
		const container = document.getElementById('notificationsContainer')
		if (!container) return

		while (container.firstChild) {
			container.removeChild(container.firstChild)
		}

		this.notifications.forEach(notification => {
			const notificationElement = this.createNotificationElement(notification)
			container.appendChild(notificationElement)
		})
	}

	createNotificationElement(notification) {
		const element = document.createElement('div')
		element.className = `notification ${notification.type} fade-in`

		const icon = document.createElement('div')
		icon.className = 'notification-icon'
		icon.textContent = this.getNotificationIcon(notification.type)

		const content = document.createElement('div')
		content.className = 'notification-content'

		const title = document.createElement('h4')
		title.textContent = notification.title

		const message = document.createElement('p')
		message.textContent = notification.message

		content.appendChild(title)
		content.appendChild(message)
		element.appendChild(icon)
		element.appendChild(content)

		if (notification.courseId) {
			element.style.cursor = 'pointer'
			element.addEventListener('click', () => {
				window.location.href = `pages/course-details.html?id=${notification.courseId}`
			})
		}

		return element
	}

	getNotificationIcon(type) {
		switch (type) {
			case 'warning':
				return '⚠️'
			case 'error':
				return '❌'
			case 'info':
				return 'ℹ️'
			default:
				return '📢'
		}
	}

	static showTempNotification(message, type = 'info', duration = 5000) {
		const notification = document.createElement('div')
		notification.className = `notification ${type} fade-in`
		notification.style.position = 'fixed'
		notification.style.top = '20px'
		notification.style.right = '20px'
		notification.style.zIndex = '10000'
		notification.style.maxWidth = '400px'

		const icon = document.createElement('div')
		icon.className = 'notification-icon'
		icon.textContent =
			type === 'warning'
				? '⚠️'
				: type === 'error'
				? '❌'
				: type === 'info'
				? 'ℹ️'
				: '📢'

		const content = document.createElement('div')
		content.className = 'notification-content'

		const messageElement = document.createElement('p')
		messageElement.textContent = message

		content.appendChild(messageElement)
		notification.appendChild(icon)
		notification.appendChild(content)

		document.body.appendChild(notification)

		setTimeout(() => {
			notification.remove()
		}, duration)

		return notification
	}
}
