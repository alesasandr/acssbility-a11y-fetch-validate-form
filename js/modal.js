/* eslint-disable no-console */
// Лабораторная №4: модальное окно регистрации + валидация через Constraint Validation API.

;(function () {
	'use strict'

	// Элементы
	const openBtn = document.getElementById('open-register')
	const modal = document.getElementById('register-modal')
	const closeBtn = document.getElementById('close-modal')

	const form = document.getElementById('register-form')
	const nameInput = document.getElementById('reg-name')
	const emailInput = document.getElementById('reg-email')
	const passInput = document.getElementById('reg-pass')
	const showPassBtn = document.getElementById('show-pass')

	// Утилита: показать/скрыть ошибку у поля
	function setFieldError(input, message) {
		const errId = input.getAttribute('aria-describedby')
		if (!errId) return

		const errEl = document.getElementById(errId)
		if (!errEl) return

		if (message) {
			input.setAttribute('aria-invalid', 'true')
			errEl.textContent = message
			errEl.hidden = false
		} else {
			input.removeAttribute('aria-invalid')
			errEl.textContent = ''
			errEl.hidden = true
		}
	}

	// Текст ошибки по validity
	function getMessage(input) {
		const v = input.validity
		if (v.valid) return ''

		if (v.valueMissing) return 'Поле обязательно для заполнения.'
		if (v.typeMismatch && input.type === 'email')
			return 'Введите корректный email.'
		if (v.tooShort)
			return `Минимальная длина: ${input.getAttribute('minlength')} символов.`
		if (v.tooLong)
			return `Максимальная длина: ${input.getAttribute('maxlength')} символов.`
		if (v.rangeUnderflow)
			return `Значение должно быть не меньше ${input.getAttribute('min')}.`
		if (v.rangeOverflow)
			return `Значение должно быть не больше ${input.getAttribute('max')}.`
		if (v.patternMismatch)
			return 'Значение не соответствует требуемому шаблону.'
		return 'Проверьте корректность поля.'
	}

	// Валидация поля по blur
	function validateOnBlur(e) {
		const input = e.target
		if (!(input instanceof HTMLInputElement)) return

		const msg = getMessage(input)
		setFieldError(input, msg)
	}

	// Навешиваем blur на все контролы формы
	;[nameInput, emailInput, passInput].forEach(el => {
		el.addEventListener('blur', validateOnBlur)
	})

	// Submit формы
	form.addEventListener('submit', e => {
		e.preventDefault() // предотвращаем перезагрузку страницы

		const controls = [nameInput, emailInput, passInput]
		let firstInvalid = null

		controls.forEach(input => {
			const msg = getMessage(input)
			setFieldError(input, msg)
			if (!firstInvalid && msg) firstInvalid = input
		})

		if (firstInvalid) {
			firstInvalid.focus() // фокус на первое неверное поле
			return
		}

		// Все корректно — собираем FormData и выводим в консоль
		const data = new FormData(form)
		const result = Object.fromEntries(data.entries())
		console.log('FormData:', result)

		// Закрываем модалку
		modal.close()
	})

	// Открыть модалку
	openBtn?.addEventListener('click', () => {
		modal.showModal() // задание требует showModal()
	})

	// Закрыть модалку по кнопке
	closeBtn?.addEventListener('click', () => {
		modal.close()
	})

	// Закрытие по клику на бэкдроп (вне контента)
	modal.addEventListener('click', e => {
		if (e.target === modal) {
			modal.close()
		}
	})

	// Не даём клику внутри формы всплыть до <dialog>, чтобы не закрывать окно
	form.addEventListener('click', e => {
		e.stopPropagation() // демонстрация stopPropagation()
	})

	// Показ пароля по удержанию: pointerdown/pointerup
	function revealPassword() {
		passInput.type = 'text'
	}
	function hidePassword() {
		passInput.type = 'password'
	}

	showPassBtn.addEventListener('pointerdown', revealPassword)
	showPassBtn.addEventListener('pointerup', hidePassword)
	showPassBtn.addEventListener('pointercancel', hidePassword)
	showPassBtn.addEventListener('pointerleave', hidePassword)

	// Демонстрация фаз событий: capturing и bubbling
	document.addEventListener(
		'click',
		() => {
			// console.log('document CAPTURE click');
		},
		true // фаза погружения
	)

	document.addEventListener('click', () => {
		// console.log('document BUBBLE click');
	})
})()
