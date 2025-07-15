import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/feedback.scss';

const FeedbackForm = () => {
  const { user } = useSelector(state => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Функции валидации
  const validateField = (name, value) => {
    switch (name) {
      case 'rating':
        if (!value || value === '0') {
          return 'Пожалуйста, выберите оценку';
        }
        break;
      case 'comment':
        if (!value || value.trim().length < 10) {
          return 'Комментарий должен содержать минимум 10 символов';
        }
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const ratingError = validateField('rating', rating);
    const commentError = validateField('comment', comment);
    
    if (ratingError) newErrors.rating = ratingError;
    if (commentError) newErrors.comment = commentError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setRating(value);
    
    if (touched.rating) {
      const error = validateField('rating', value);
      setErrors(prev => ({
        ...prev,
        rating: error
      }));
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    
    if (touched.comment) {
      const error = validateField('comment', value);
      setErrors(prev => ({
        ...prev,
        comment: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = name === 'rating' ? rating : comment;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = () => {
    // Помечаем все поля как "тронутые"
    setTouched({ rating: true, comment: true });
    
    // Валидация формы
    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    if (user) {
      alert(`Спасибо за отзыв! Рейтинг: ${rating}, Комментарий: ${comment}`);
      setRating(0);
      setComment('');
      setErrors({});
      setTouched({});
    }
  };

  if (!user) return null;

  return (
    <div className="feedback-form">
      <h2>Оценка качества обслуживания</h2>
      <select 
        value={rating} 
        onChange={handleRatingChange}
        onBlur={() => handleBlur('rating')}
        className={touched.rating && errors.rating ? 'error' : ''}
      >
        <option value="0">Выберите оценку</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      {touched.rating && errors.rating && (
        <p className="error-message">{errors.rating}</p>
      )}
      <textarea
        value={comment}
        onChange={handleCommentChange}
        onBlur={() => handleBlur('comment')}
        placeholder="Ваш комментарий..."
        className={touched.comment && errors.comment ? 'error' : ''}
      />
      {touched.comment && errors.comment && (
        <p className="error-message">{errors.comment}</p>
      )}
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
};

export default FeedbackForm;