import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/feedback.scss';

const FeedbackForm = () => {
  const { user } = useSelector(state => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0 && user) {
      alert(`Спасибо за отзыв! Рейтинг: ${rating}, Комментарий: ${comment}`);
      setRating(0);
      setComment('');
    }
  };

  if (!user) return null;

  return (
    <div className="feedback-form">
      <h2>Оценка качества обслуживания</h2>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="0">Выберите оценку</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ваш комментарий..."
      />
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
};

export default FeedbackForm;