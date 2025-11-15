// Инициализация страницы курсов

document.addEventListener('DOMContentLoaded', function () {
	// Проверка авторизации уже выполняется в filters.js
	// Здесь только дополнительные инициализации, если нужны

	// Обработчик кнопки печати
	const printBtn = document.getElementById('printBtn')
	if (printBtn) {
		printBtn.addEventListener('click', function () {
			window.print()
		})
	}
})
