// Модуль фильтрации и поиска

class FilterManager {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.currentFilters = {
            status: 'all',
            search: ''
        };
        this.init();
    }

    init() {
        
        this.loadCourses();
        this.setupEventListeners();
        this.applyFilters();
        
    }

    loadCourses() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && userData.courses) {
            this.courses = userData.courses;
        } else {
            this.courses = [
                {
                    id: 1,
                    title: "IT-безопасность",
                    status: "пройден",
                    start_date: "2024-01-15",
                    due_date: "2025-01-15",
                    progress: 100,
                    description: "Курс по основам информационной безопасности"
                },
                {
                    id: 2,
                    title: "Работа с Laravel",
                    status: "в процессе",
                    start_date: "2025-03-01",
                    due_date: "2025-06-01",
                    progress: 45,
                    description: "Изучение фреймворка Laravel для веб-разработки"
                },
                {
                    id: 3,
                    title: "Основы DevOps",
                    status: "назначен",
                    start_date: "2025-04-01",
                    due_date: "2025-07-01",
                    progress: 0,
                    description: "Введение в практики DevOps"
                },
                {
                    id: 4,
                    title: "Управление проектами",
                    status: "в процессе",
                    start_date: "2025-02-01",
                    due_date: "2025-05-01",
                    progress: 30,
                    description: "Методологии управления IT-проектами"
                }
            ];
        }
        
        this.filteredCourses = [...this.courses];
    }

    setupEventListeners() {
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredCourses = this.courses.filter(course => {
            if (this.currentFilters.status !== 'all' && course.status !== this.currentFilters.status) {
                return false;
            }

            if (this.currentFilters.search && !course.title.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }

            return true;
        });

        this.renderCourses();
        this.updateResultsCount();
    }

    renderCourses() {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (this.filteredCourses.length === 0) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'card text-center';
            
            const title = document.createElement('h3');
            title.textContent = 'Курсы не найдены';
            
            const message = document.createElement('p');
            message.textContent = 'Попробуйте изменить параметры фильтрации';
            
            emptyCard.appendChild(title);
            emptyCard.appendChild(message);
            container.appendChild(emptyCard);
            return;
        }

        this.filteredCourses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            container.appendChild(courseCard);
        });
    }

    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'card course-card';
        card.addEventListener('click', () => {
            window.location.href = `course-details.html?id=${course.id}`;
        });

        const title = document.createElement('h3');
        title.className = 'course-title';
        title.textContent = course.title;

        const status = document.createElement('div');
        status.className = `course-status ${this.getStatusClass(course.status)}`;
        status.textContent = this.getStatusText(course.status);

        const meta = document.createElement('div');
        meta.className = 'course-meta';

        const startDate = document.createElement('p');
        const startStrong = document.createElement('strong');
        startStrong.textContent = 'Дата начала: ';
        startDate.appendChild(startStrong);
        startDate.appendChild(document.createTextNode(this.formatDate(course.start_date)));

        const dueDate = document.createElement('p');
        const dueStrong = document.createElement('strong');
        dueStrong.textContent = 'Срок окончания: ';
        dueDate.appendChild(dueStrong);
        dueDate.appendChild(document.createTextNode(this.formatDate(course.due_date)));

        meta.appendChild(startDate);
        meta.appendChild(dueDate);

        if (course.progress > 0) {
            const progress = document.createElement('p');
            const progressStrong = document.createElement('strong');
            progressStrong.textContent = 'Прогресс: ';
            progress.appendChild(progressStrong);
            progress.appendChild(document.createTextNode(`${course.progress}%`));
            meta.appendChild(progress);
        }

        const description = document.createElement('p');
        description.className = 'course-description';
        description.textContent = course.description;

        meta.appendChild(description);

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(meta);

        return card;
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            countElement.textContent = `Найдено курсов: ${this.filteredCourses.length}`;
        }
    }

    getStatusClass(status) {
        switch(status) {
            case 'пройден': return 'status-completed';
            case 'в процессе': return 'status-in-progress';
            case 'назначен': return 'status-upcoming';
            case 'просрочен': return 'status-expired';
            default: return '';
        }
    }

    getStatusText(status) {
        switch(status) {
            case 'пройден': return 'Пройден';
            case 'в процессе': return 'В процессе';
            case 'назначен': return 'Назначен';
            case 'просрочен': return 'Просрочен';
            default: return status;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    resetFilters() {
        this.currentFilters = {
            status: 'all',
            search: ''
        };

        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');

        if (statusFilter) statusFilter.value = 'all';
        if (searchInput) searchInput.value = '';

        this.applyFilters();
    }
}

// Инициализация на странице курсов
if (window.location.pathname.includes('courses.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!AuthManager.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        const filterManager = new FilterManager();

        const filtersContainer = document.querySelector('.filters');
        if (filtersContainer) {
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Сбросить фильтры';
            resetButton.className = 'btn btn-secondary';
            resetButton.addEventListener('click', () => {
                filterManager.resetFilters();
            });
            filtersContainer.appendChild(resetButton);

            window.filterManager = filterManager;
        }
    });
}