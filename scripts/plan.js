class PlanManager {
	constructor() {
		this.learningPlan = null
		this.init()
	}

	init() {
		this.loadLearningPlan()
		this.renderPlan()
	}

	loadLearningPlan() {
		const userData = JSON.parse(localStorage.getItem('userData'))

		if (userData && userData.learning_plan) {
			this.learningPlan = userData.learning_plan
		} else {
			this.learningPlan = {
				upcoming_courses: [
					{
						id: 5,
						title: 'Основы DevOps',
						scheduled_date: '2025-04-01',
						type: 'обязательный',
						priority: 'высокий',
						description: 'Введение в практики DevOps для разработчиков',
						duration: '40 часов',
						category: 'Технические навыки',
					},
					{
						id: 6,
						title: 'Agile методики',
						scheduled_date: '2025-05-25',
						type: 'рекомендованный',
						priority: 'средний',
						description: 'Изучение гибких методологий разработки',
						duration: '24 часа',
						category: 'Управление проектами',
					},
					{
						id: 7,
						title: 'Cloud Computing',
						scheduled_date: '2025-06-10',
						type: 'рекомендованный',
						priority: 'средний',
						description: 'Работа с облачными платформами',
						duration: '36 часов',
						category: 'Технические навыки',
					},
					{
						id: 8,
						title: 'IT-безопасность продвинутый',
						scheduled_date: '2025-07-01',
						type: 'обязательный',
						priority: 'высокий',
						description: 'Продвинутые методы защиты информации',
						duration: '48 часов',
						category: 'Безопасность',
					},
				],
				recommendations: [
					"Рекомендуем пройти курс 'Cloud Computing' для развития навыков работы с облачными технологиями",
					"На основе вашей должности советуем изучить 'Контейнеризация приложений'",
					"Для карьерного роста рекомендуем освоить 'Управление IT-проектами'",
				],
				statistics: {
					total_planned: 4,
					completion_rate: 25,
					high_priority_count: 2,
					medium_priority_count: 2,
				},
			}

			if (userData) {
				userData.learning_plan = this.learningPlan
				localStorage.setItem('userData', JSON.stringify(userData))
			}
		}
	}

	renderPlan() {
		this.renderTimeline()
		this.renderRecommendations()
		this.renderStatistics()
	}

	renderTimeline() {
		const container = document.getElementById('coursesTimeline')
		if (!container || !this.learningPlan) return

		const coursesByMonth = this.groupCoursesByMonth(
			this.learningPlan.upcoming_courses
		)

		if (this.learningPlan.upcoming_courses.length === 0) {
			container.innerHTML =
				'<p class="text-center">Нет запланированных курсов</p>'
			return
		}

		let timelineHTML = ''

		Object.keys(coursesByMonth)
			.sort()
			.forEach(month => {
				timelineHTML += this.createMonthSection(month, coursesByMonth[month])
			})

		container.innerHTML = timelineHTML

		this.addCourseCardEventListeners()
	}

	groupCoursesByMonth(courses) {
		const groups = {}

		courses.forEach(course => {
			const date = new Date(course.scheduled_date)
			const monthKey = date
				.toLocaleDateString('ru-RU', {
					year: 'numeric',
					month: 'long',
				})
				.toUpperCase()

			if (!groups[monthKey]) {
				groups[monthKey] = []
			}
			groups[monthKey].push(course)
		})

		return groups
	}

	createMonthSection(month, courses) {
		return `
            <div class="timeline-month">
                <h3 class="month-title">${month}</h3>
                <div class="month-courses">
                    ${courses
											.map(course => this.createCourseCard(course))
											.join('')}
                </div>
            </div>
        `
	}

	createCourseCard(course) {
		const formattedDate = this.formatDate(course.scheduled_date)
		const priorityClass = `priority-${course.priority}`

		return `
            <div class="course-plan-card ${priorityClass}" data-course-id="${
			course.id
		}">
                <div class="course-plan-main">
                   	<div class="course-plan-header">
                       	<h4 class="course-plan-title">${course.title}</h4>
                       	<div class="course-badges">
                           	<span class="course-badge type-${
															course.type
														}">${this.getTypeText(course.type)}</span>
                           	<span class="course-badge priority-${
															course.priority
														}">${this.getPriorityText(course.priority)}</span>
                       	</div>
                   	</div>
                   	<p class="course-plan-description">${course.description}</p>
                   	<div class="course-plan-meta">
                       	<span class="meta-item">📅 ${formattedDate}</span>
                       	<span class="meta-item">⏱️ ${course.duration}</span>
                       	<span class="meta-item">📚 ${course.category}</span>
                   	</div>
                </div>
            </div>
        `
	}

	renderRecommendations() {
		const container = document.getElementById('recommendationsList')
		if (!container || !this.learningPlan) return

		if (this.learningPlan.recommendations.length === 0) {
			container.innerHTML =
				'<p class="text-center">Рекомендации отсутствуют</p>'
			return
		}

		container.innerHTML = this.learningPlan.recommendations
			.map(
				rec => `
            <div class="recommendation-item">
                <div class="recommendation-icon">💡</div>
                <div class="recommendation-text">${rec}</div>
            </div>
        `
			)
			.join('')
	}

	renderStatistics() {
		if (!this.learningPlan || !this.learningPlan.statistics) return

		const stats = this.learningPlan.statistics

		document.getElementById('plannedCourses').textContent = stats.total_planned
		document.getElementById(
			'completionRate'
		).textContent = `${stats.completion_rate}%`

		const avgPriority = this.calculateAveragePriority(stats)
		document.getElementById('avgPriority').textContent = avgPriority
	}

	calculateAveragePriority(stats) {
		const total = stats.high_priority_count + stats.medium_priority_count
		if (total === 0) return 'Нет данных'

		const score =
			(stats.high_priority_count * 3 + stats.medium_priority_count * 2) / total

		if (score >= 2.5) return 'Высокий'
		if (score >= 1.5) return 'Средний'
		return 'Низкий'
	}

	addCourseCardEventListeners() {
		document.querySelectorAll('.course-plan-card').forEach(card => {
			card.addEventListener('click', e => {
				const courseId = card.dataset.courseId
				this.viewCourseDetails(courseId)
			})
		})
	}

	async viewCourseDetails(courseId) {
		const course = this.learningPlan.upcoming_courses.find(
			c => c.id == courseId
		)
		if (course) {
			const message = `Детали курса: ${course.title}\n\nОписание: ${
				course.description
			}\nДата: ${this.formatDate(
				course.scheduled_date
			)}\nПриоритет: ${this.getPriorityText(course.priority)}`

			if (typeof modal !== 'undefined') {
				await modal.show(message, 'info', 'Детали курса')
			} else if (typeof NotificationManager !== 'undefined') {
				NotificationManager.showTempNotification(message, 'info')
			}
		}
	}

	formatDate(dateString) {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU')
	}

	getTypeText(type) {
		const types = {
			обязательный: 'Обязательный',
			рекомендованный: 'Рекомендованный',
		}
		return types[type] || type
	}

	getPriorityText(priority) {
		const priorities = {
			высокий: 'Высокий',
			средний: 'Средний',
			низкий: 'Низкий',
		}
		return priorities[priority] || priority
	}
}
