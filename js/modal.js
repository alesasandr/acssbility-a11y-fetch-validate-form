document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.querySelector(".registration");
  const passwordInput = document.getElementById("password");
  const showPasswordBtn = document.querySelector(".password__toggle");

  // Добавляем обработчики blur для всех полей ввода
  const inputs = registrationForm.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
  });

  // Обработчик показа/скрытия пароля
  if (showPasswordBtn && passwordInput) {
    showPasswordBtn.addEventListener("pointerdown", function () {
      passwordInput.type = "text";
    });

    showPasswordBtn.addEventListener("pointerup", function () {
      passwordInput.type = "password";
    });

    showPasswordBtn.addEventListener("pointerleave", function () {
      passwordInput.type = "password";
    });
  }

  // Обработчик отправки формы
  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Валидируем все поля перед отправкой
    let isValid = true;
    let firstInvalidField = null;

    inputs.forEach((input) => {
      const fieldValid = validateField({ target: input });
      if (!fieldValid && !firstInvalidField) {
        firstInvalidField = input;
        isValid = false;
      }
    });

    if (isValid) {
      // Собираем данные формы
      const formData = new FormData(registrationForm);
      console.log("Form Data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      alert(
        "Форма успешно отправлена! Проверьте консоль для просмотра данных."
      );
      // Здесь можно добавить отправку на сервер
      // registrationForm.submit();
    } else {
      firstInvalidField.focus();
    }
  });

  // Обработчик сброса формы
  registrationForm.addEventListener("reset", function () {
    // Сбрасываем все сообщения об ошибках
    const errorMessages = registrationForm.querySelectorAll(".error-message");
    errorMessages.forEach((error) => {
      error.hidden = true;
      error.textContent = "";
    });

    // Сбрасываем aria-invalid атрибуты
    inputs.forEach((input) => {
      input.setAttribute("aria-invalid", "false");
    });
  });

  // Функция валидации отдельного поля
  function validateField(event) {
    const input = event.target;
    const errorElement = document.getElementById(`${input.name}-error`);

    if (input.type === "radio") {
      return validateRadioGroup(input.name);
    }

    const isValid = validateInput(input);

    if (!isValid) {
      input.setAttribute("aria-invalid", "true");
      if (errorElement) {
        errorElement.textContent = getErrorMessage(input);
        errorElement.hidden = false;
      }
    } else {
      input.setAttribute("aria-invalid", "false");
      if (errorElement) {
        errorElement.hidden = true;
        errorElement.textContent = "";
      }
    }

    return isValid;
  }

  // Функция валидации группы radio кнопок
  function validateRadioGroup(name) {
    const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
    const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
    const errorElement = document.getElementById(`${name}-error`);

    if (!isChecked) {
      radioGroup.forEach((radio) => {
        radio.setAttribute("aria-invalid", "true");
      });
      if (errorElement) {
        errorElement.textContent = "Пожалуйста, выберите пол";
        errorElement.hidden = false;
      }
      return false;
    } else {
      radioGroup.forEach((radio) => {
        radio.setAttribute("aria-invalid", "false");
      });
      if (errorElement) {
        errorElement.hidden = true;
        errorElement.textContent = "";
      }
      return true;
    }
  }

  // Функция проверки валидности input
  function validateInput(input) {
    // Проверка обязательных полей
    if (input.hasAttribute("required") && !input.value.trim()) {
      return false;
    }

    // Специфические проверки для разных типов полей
    switch (input.type) {
      case "email":
        return isValidEmail(input.value);
      case "tel":
        return isValidPhone(input.value);
      case "password":
        return input.value.length >= 6;
      case "text":
        if (input.name === "name") {
          return input.value.trim().length > 0;
        }
        break;
      case "date":
        return input.value !== "";
    }

    // Для select проверяем, что выбрана опция (не пустая)
    if (input.tagName === "SELECT" && input.hasAttribute("required")) {
      return input.value !== "";
    }

    return input.validity.valid;
  }

  // Функция получения сообщения об ошибке
  function getErrorMessage(input) {
    if (input.validity.valueMissing) {
      return "Это поле обязательно для заполнения";
    }

    if (input.validity.typeMismatch) {
      if (input.type === "email") {
        return "Введите корректный email адрес";
      }
      if (input.type === "tel") {
        return "Введите корректный номер телефона";
      }
    }

    if (input.validity.tooShort) {
      return `Минимальная длина: ${input.minLength} символов`;
    }

    // Кастомные сообщения для разных полей
    switch (input.name) {
      case "password":
        if (input.value.length < 6) {
          return "Пароль должен содержать минимум 6 символов";
        }
        break;
      case "name":
        if (!input.value.trim()) {
          return "Имя обязательно для заполнения";
        }
        break;
      case "date":
        if (!input.value) {
          return "Дата рождения обязательна для заполнения";
        }
        break;
      case "time":
        if (!input.value) {
          return "Пожалуйста, выберите время";
        }
        break;
    }

    return "Неверное значение";
  }

  // Вспомогательные функции валидации
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  }
});
