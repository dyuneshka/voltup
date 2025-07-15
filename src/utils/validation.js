import { useState } from 'react';

// Общие функции валидации для форм

// Валидация ИНН
export const validateINN = (inn) => {
  if (!inn) return 'ИНН обязателен';
  if (!/^\d{10}$/.test(inn)) return 'ИНН должен содержать 10 цифр';
  return '';
};

// Валидация КПП
export const validateKPP = (kpp) => {
  if (!kpp) return 'КПП обязателен';
  if (!/^\d{9}$/.test(kpp)) return 'КПП должен содержать 9 цифр';
  return '';
};

// Валидация ЕГРЮЛ
export const validateEGRUL = (egrul) => {
  if (!egrul) return 'ЕГРЮЛ обязателен';
  if (!/^\d{13}$/.test(egrul)) return 'ЕГРЮЛ должен содержать 13 цифр';
  return '';
};

// Валидация телефона
export const validatePhone = (phone) => {
  if (!phone) return 'Телефон обязателен';
  if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(phone)) {
    return 'Введите корректный номер телефона';
  }
  return '';
};

// Валидация email
export const validateEmail = (email) => {
  if (!email) return 'Email обязателен';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Введите корректный email';
  }
  return '';
};

// Валидация адреса
export const validateAddress = (address, fieldName = 'Адрес') => {
  if (!address || address.trim().length < 10) {
    return `${fieldName} должен содержать минимум 10 символов`;
  }
  return '';
};

// Валидация текста
export const validateText = (text, fieldName, minLength = 3) => {
  if (!text || text.trim().length < minLength) {
    return `${fieldName} должен содержать минимум ${minLength} символа`;
  }
  return '';
};

// Валидация числа
export const validateNumber = (number, fieldName, minValue = 0) => {
  if (!number) return `${fieldName} обязателен`;
  if (!/^\d+(\.\d+)?$/.test(number) || parseFloat(number) <= minValue) {
    return `Введите корректное значение для ${fieldName} (число больше ${minValue})`;
  }
  return '';
};

// Валидация даты
export const validateDate = (date, fieldName = 'Дата') => {
  if (!date) return `${fieldName} обязательна`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Введите корректную ${fieldName.toLowerCase()}`;
  }
  return '';
};

// Валидация ОКВЭД
export const validateOKVED = (okved) => {
  if (!okved) return 'ОКВЭД обязателен';
  if (!/^\d{2}\.\d{2}$/.test(okved)) {
    return 'ОКВЭД должен быть в формате XX.XX';
  }
  return '';
};

// Валидация категории надежности
export const validateReliabilityCategory = (category) => {
  if (!category) return 'Категория надежности обязательна';
  if (!['1', '2', '3'].includes(category)) {
    return 'Выберите категорию надежности (1, 2 или 3)';
  }
  return '';
};

// Валидация рейтинга
export const validateRating = (rating) => {
  if (!rating || rating === '0') {
    return 'Пожалуйста, выберите оценку';
  }
  return '';
};

// Валидация комментария
export const validateComment = (comment, minLength = 10) => {
  if (!comment || comment.trim().length < minLength) {
    return `Комментарий должен содержать минимум ${minLength} символов`;
  }
  return '';
};

// Валидация имени пользователя
export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return 'Имя пользователя должно содержать минимум 3 символа';
  }
  return '';
};

// Валидация пароля
export const validatePassword = (password, minLength = 4) => {
  if (!password || password.length < minLength) {
    return `Пароль должен содержать минимум ${minLength} символа`;
  }
  return '';
};

// Общая функция валидации формы
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName];
    const rule = validationRules[fieldName];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[fieldName] = error;
    } else if (typeof rule === 'object') {
      const { validator, required, minLength, fieldDisplayName } = rule;
      if (required && (!value || value.trim() === '')) {
        errors[fieldName] = `${fieldDisplayName || fieldName} обязателен`;
      } else if (value && validator) {
        const error = validator(value, fieldDisplayName || fieldName, minLength);
        if (error) errors[fieldName] = error;
      }
    }
  });
  
  return errors;
};

// Хук для управления валидацией формы
export const useFormValidation = (initialData, validationRules) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    
    if (typeof rule === 'function') {
      return rule(value);
    } else if (typeof rule === 'object') {
      const { validator, required, minLength, fieldDisplayName } = rule;
      if (required && (!value || value.trim() === '')) {
        return `${fieldDisplayName || name} обязателен`;
      } else if (value && validator) {
        return validator(value, fieldDisplayName || name, minLength);
      }
    }
    return '';
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = validateForm(formData, validationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData
  };
}; 