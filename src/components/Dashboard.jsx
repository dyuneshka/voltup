import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import ChatBot from './ChatBot'; // Импорт ChatBot
import '../styles/dashboard.scss';

const Dashboard = () => {
  const { consumption, currentReading, paymentHistory, notifications } = useSelector(state => state.dashboard);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [realTimeReading, setRealTimeReading] = useState(1500); // Начальное значение счетчика

  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      const baseChange = (hour >= 8 && hour <= 20) ? 1 : -1; // Увеличение днем, снижение ночью
      const randomChange = (Math.random() * 5 - 2.5); // Случайный шум от -2.5 до 2.5
      setRealTimeReading(prev => Math.max(1000, prev + baseChange + randomChange)); // Ограничение снизу
    }, 2000); // Обновление каждые 2 секунды
    return () => clearInterval(interval);
  }, []);

  const handleSubmitApplication = () => {
    navigate('/application');
  };

  const chartData = {
    labels: consumption.map(c => c.date),
    datasets: [
      {
        label: 'Текущий период (кВт·ч)',
        data: consumption.map(c => c.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Прошлый период (кВт·ч)',
        data: consumption.map(c => {
          const baseValue = c.value * 0.9; // 10% меньше прошлого периода
          return baseValue + (Math.random() * 50 - 25); // Случайный шум от -25 до 25
        }),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Дата' },
      },
      y: {
        title: { display: true, text: 'Потребление (кВт·ч)' },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  const compareData = {
    current: consumption.reduce((sum, c) => sum + c.value, 0) / consumption.length || 0,
    previous: 1200, // Эмуляция прошлого периода
  };

  const [filterDate, setFilterDate] = useState('');
  const filteredPayments = paymentHistory.filter(p =>
    !filterDate || new Date(p.date).toISOString().startsWith(filterDate)
  );

  const handlePayment = () => {
    alert('Оплата через YooMoney, Тинькофф или СБП эмулирована!');
  };

  const documents = [
    { id: 1, name: 'Договор 2025', type: 'pdf' },
    { id: 2, name: 'Технические условия', type: 'docx' },
    { id: 3, name: 'Акт выполненных работ', type: 'pdf' },
  ];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    alert(`Оценка ${rating} с комментарием "${comment}" отправлена!`);
    setRating(0);
    setComment('');
  };

  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Личный кабинет - {user.username}</h1>
      </header>
      <main className="dashboard-main">
        <div className="user-panel">
          <h2>Информация о пользователе</h2>
          <p>Роль: {user.role}</p>
          {user.organization && <p>Организация: {user.organization}</p>}
          <button onClick={handleSubmitApplication} className="submit-application-button">
            Подать заявку
          </button>
        </div>
        <section className="dashboard-section">
          <h3>Графики потребления электроэнергии</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>
        <section className="dashboard-section">
          <h3>Текущие показания счетчика</h3>
          <p style={{ fontSize: '2rem', color: '#28a745', fontWeight: 'bold' }}>
            Реальное время: <strong>{realTimeReading.toFixed(2)}</strong> кВт·ч
          </p>
        </section>
        <section className="dashboard-section">
          <h3>Сравнение потребления с прошлым периодом</h3>
          <p>Текущий период: {compareData.current.toFixed(2)} кВт·ч</p>
          <p>Предыдущий период: {compareData.previous} кВт·ч</p>
          <p>Разница: {(compareData.current - compareData.previous).toFixed(2)} кВт·ч</p>
        </section>
        <section className="dashboard-section">
          <h3>История оплат</h3>
          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-input"
          />
          <ul>
            {filteredPayments.map((p, index) => (
              <li key={index}>{p.date}: {p.amount} руб. ({p.status})</li>
            ))}
          </ul>
          <button onClick={handlePayment} className="payment-button">
            Оплатить онлайн
          </button>
        </section>
        <section className="dashboard-section">
          <h3>Уведомления</h3>
          <ul>
            {notifications.map((n, index) => (
              <li key={index}>{n}</li>
            ))}
          </ul>
        </section>
        <section className="dashboard-section">
          <h3>Рекомендации по экономии энергии</h3>
          <p>Эмуляция: Выключите лишние устройства в часы пик для экономии 10-15%.</p>
        </section>
        <section className="dashboard-section">
          <h3>Личный архив документов</h3>
          <ul>
            {documents.map(d => (
              <li key={d.id}>{d.name} ({d.type})</li>
            ))}
          </ul>
        </section>
        <section className="dashboard-section">
          <h3>Оценка качества обслуживания</h3>
          <form onSubmit={handleRatingSubmit}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-input">
              <option value="0">Оцените (1-5)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий"
              className="form-input"
            />
            <button type="submit" className="form-submit">Отправить</button>
          </form>
        </section>
        <section className="dashboard-section">
          <h3>Чат с ИИ-ботом</h3>
          <ChatBot />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;