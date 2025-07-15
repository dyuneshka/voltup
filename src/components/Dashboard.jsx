import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Line, Doughnut } from 'react-chartjs-2';

import '../styles/dashboard.scss';

// Улучшенный компонент панели пользователя
const UserPanel = ({ user }) => (
  <div className="user-panel-modern">
    <div className="user-info-modern">
      <div className="user-avatar-modern">
        <div className="avatar-circle">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="status-indicator online"></div>
      </div>
      <div className="user-details-modern">
        <h3 className="user-name">{user.name || 'Пользователь'}</h3>
        <p className="user-role-modern">
          <span className="role-badge">{user.role === 'applicant' ? 'Заявитель' : user.role}</span>
        </p>
        {user.organization && (
          <p className="user-organization-modern">
            <span className="org-icon">🏢</span>
            {user.organization}
          </p>
        )}
      </div>
    </div>
    <div className="user-stats-modern">
      <div className="stat-card-modern">
        <div className="stat-icon-modern">📊</div>
        <div className="stat-content">
          <span className="stat-number-modern">2</span>
          <span className="stat-label-modern">Активных заявок</span>
        </div>
      </div>
      <div className="stat-card-modern">
        <div className="stat-icon-modern">⚡</div>
        <div className="stat-content">
          <span className="stat-number-modern">1,250</span>
          <span className="stat-label-modern">кВт·ч потребление</span>
        </div>
      </div>
      <div className="stat-card-modern">
        <div className="stat-icon-modern">💰</div>
        <div className="stat-content">
          <span className="stat-number-modern">15,000 ₽</span>
          <span className="stat-label-modern">Баланс</span>
        </div>
      </div>
    </div>
  </div>
);

// Улучшенный компонент графика потребления
const ConsumptionChart = ({ consumption, realTimeReading }) => {
  // Создаем динамические данные на основе реального потребления
  const generateChartData = () => {
    const now = new Date();
    const labels = [];
    const currentData = [];
    const previousData = [];
    
    // Генерируем данные за последние 6 месяцев
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
      labels.push(monthName);
      
      // Базовое потребление с вариациями
      const baseConsumption = realTimeReading * (0.8 + Math.random() * 0.4);
      currentData.push(Math.round(baseConsumption));
      
      // Данные за предыдущий период (немного меньше)
      const previousBase = baseConsumption * (0.85 + Math.random() * 0.2);
      previousData.push(Math.round(previousBase));
    }
    
    return { labels, currentData, previousData };
  };

  const { labels, currentData, previousData } = generateChartData();

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Текущий период (кВт·ч)',
        data: currentData,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Прошлый период (кВт·ч)',
        data: previousData,
        borderColor: 'rgba(118, 75, 162, 1)',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(118, 75, 162, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgba(118, 75, 162, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onProgress: function(animation) {
        // Анимация при загрузке графика
      },
      onComplete: function(animation) {
        // Анимация завершена
      }
    },
    scales: {
      x: { 
        title: { 
          display: true, 
          text: 'Месяц', 
          color: '#4a5568', 
          font: { weight: '600', size: 14 } 
        },
        grid: { 
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false
        },
        ticks: {
          color: '#718096',
          font: { weight: '500' }
        }
      },
      y: { 
        title: { 
          display: true, 
          text: 'Потребление (кВт·ч)', 
          color: '#4a5568', 
          font: { weight: '600', size: 14 } 
        }, 
        beginAtZero: true,
        grid: { 
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false
        },
        ticks: {
          color: '#718096',
          font: { weight: '500' },
          callback: function(value) {
            return value.toLocaleString() + ' кВт·ч';
          }
        }
      },
    },
    plugins: { 
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { weight: '600', size: 12 },
          color: '#4a5568'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: { weight: '600', size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' кВт·ч';
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8,
        radius: 6,
      }
    }
  };

  // Состояние для управления периодом графика
  const [chartPeriod, setChartPeriod] = useState('month');

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    // Здесь можно добавить логику для изменения данных в зависимости от периода
  };

  return (
    <section className="dashboard-section-modern chart-section-modern">
      <div className="section-header-modern">
        <h3 className="section-title-modern">
          <span className="title-icon">📈</span>
          График потребления электроэнергии
          <span className="chart-live-indicator">
            <span className="live-dot"></span>
            Живые данные
          </span>
        </h3>
        <div className="chart-controls">
          <button 
            className={`chart-period-btn ${chartPeriod === 'month' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('month')}
          >
            Месяц
          </button>
          <button 
            className={`chart-period-btn ${chartPeriod === 'quarter' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('quarter')}
          >
            Квартал
          </button>
          <button 
            className={`chart-period-btn ${chartPeriod === 'year' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('year')}
          >
            Год
          </button>
        </div>
      </div>
      <div className="chart-container-modern">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="chart-stats-modern">
        <div className="stat-item-modern">
          <span className="stat-label-modern">Текущее потребление:</span>
          <span className="stat-value-modern">{realTimeReading.toFixed(2)} кВт·ч</span>
        </div>
        <div className="stat-item-modern">
          <span className="stat-label-modern">Среднее за месяц:</span>
          <span className="stat-value-modern">
            {(currentData.reduce((a, b) => a + b, 0) / currentData.length).toFixed(0)} кВт·ч
          </span>
        </div>
        <div className="stat-item-modern">
          <span className="stat-label-modern">Изменение:</span>
          <span className={`stat-value-modern ${currentData[currentData.length - 1] > previousData[previousData.length - 1] ? 'positive' : 'negative'}`}>
            {currentData[currentData.length - 1] > previousData[previousData.length - 1] ? '↗' : '↘'} 
            {Math.abs(currentData[currentData.length - 1] - previousData[previousData.length - 1]).toFixed(0)} кВт·ч
          </span>
        </div>
      </div>
    </section>
  );
};

// Улучшенный компонент показаний счетчика
const MeterReading = ({ realTimeReading, compareData }) => (
  <section className="dashboard-section-modern meter-section-modern">
    <div className="section-header-modern">
      <h3 className="section-title-modern">
        <span className="title-icon">🔌</span>
        Текущие показания счетчика
      </h3>
      <div className="real-time-indicator">
        <span className="pulse-dot"></span>
        Реальное время
      </div>
    </div>
    <div className="stats-grid-modern">
      <div className="stat-card-modern primary">
        <div className="stat-icon-large">⚡</div>
        <div className="stat-content">
          <span className="stat-number-large">{realTimeReading.toFixed(2)}</span>
          <span className="stat-label-large">кВт·ч (реальное время)</span>
        </div>
        <div className="stat-trend positive">
          <span>↗</span>
          <span>+2.3%</span>
        </div>
      </div>
      <div className="stat-card-modern">
        <div className="stat-icon-large">📊</div>
        <div className="stat-content">
          <span className="stat-number-large">{compareData.current.toFixed(2)}</span>
          <span className="stat-label-large">кВт·ч (текущий период)</span>
        </div>
      </div>
      <div className="stat-card-modern">
        <div className="stat-icon-large">📅</div>
        <div className="stat-content">
          <span className="stat-number-large">{compareData.previous}</span>
          <span className="stat-label-large">кВт·ч (предыдущий период)</span>
        </div>
      </div>
      <div className="stat-card-modern">
        <div className="stat-icon-large">📈</div>
        <div className="stat-content">
          <span className="stat-number-large">{(compareData.current - compareData.previous).toFixed(2)}</span>
          <span className="stat-label-large">кВт·ч (разница)</span>
        </div>
      </div>
    </div>
  </section>
);

// Улучшенный компонент истории оплат
const PaymentHistory = ({ paymentHistory, filterDate, setFilterDate, handlePayment }) => {
  const filteredPayments = paymentHistory.filter(p =>
    !filterDate || new Date(p.date).toISOString().startsWith(filterDate)
  );

  return (
    <section className="dashboard-section-modern payment-section-modern">
      <div className="section-header-modern">
        <h3 className="section-title-modern">
          <span className="title-icon">💳</span>
          История оплат
        </h3>
        <div className="filter-controls-modern">
          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-input-modern"
            placeholder="Фильтр по месяцу"
          />
        </div>
      </div>
      <div className="payments-list-modern">
        {filteredPayments.map((p, index) => (
          <div key={index} className="payment-item-modern">
            <div className="payment-info">
              <div className="payment-date-modern">{p.date}</div>
              <div className="payment-amount-modern">{p.amount} ₽</div>
            </div>
            <div className={`payment-status-modern ${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="status-dot"></span>
              {p.status}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handlePayment} className="payment-button-modern">
        <span className="button-icon">💳</span>
        Оплатить онлайн
      </button>
    </section>
  );
};

// Улучшенный компонент уведомлений
const Notifications = ({ notifications }) => (
  <section className="dashboard-section-modern notifications-section-modern">
    <div className="section-header-modern">
      <h3 className="section-title-modern">
        <span className="title-icon">🔔</span>
        Уведомления
        <span className="notification-count">{notifications.length}</span>
      </h3>
    </div>
    <div className="notifications-list-modern">
      {notifications.map((n, index) => (
        <div key={index} className="notification-item-modern">
          <div className="notification-icon-modern">🔔</div>
          <div className="notification-content">
            <div className="notification-text-modern">{n}</div>
            <div className="notification-time-modern">2 часа назад</div>
          </div>
          <button className="notification-close">×</button>
        </div>
      ))}
    </div>
  </section>
);

// Улучшенный компонент рекомендаций
const Recommendations = () => (
  <section className="dashboard-section-modern recommendations-section-modern">
    <div className="section-header-modern">
      <h3 className="section-title-modern">
        <span className="title-icon">💡</span>
        Рекомендации по экономии энергии
      </h3>
    </div>
    <div className="recommendations-grid-modern">
      <div className="recommendation-card-modern">
        <div className="recommendation-icon-modern">💡</div>
        <div className="recommendation-content">
          <h4 className="recommendation-title">Выключите лишние устройства</h4>
          <p className="recommendation-description">В часы пик для экономии 10-15% электроэнергии</p>
          <div className="recommendation-impact">
            <span className="impact-label">Экономия:</span>
            <span className="impact-value">10-15%</span>
          </div>
        </div>
      </div>
      <div className="recommendation-card-modern">
        <div className="recommendation-icon-modern">🌡️</div>
        <div className="recommendation-content">
          <h4 className="recommendation-title">Оптимизируйте температуру</h4>
          <p className="recommendation-description">Снижение температуры на 1°C экономит 5-7% энергии</p>
          <div className="recommendation-impact">
            <span className="impact-label">Экономия:</span>
            <span className="impact-value">5-7%</span>
          </div>
        </div>
      </div>
      <div className="recommendation-card-modern">
        <div className="recommendation-icon-modern">⚡</div>
        <div className="recommendation-content">
          <h4 className="recommendation-title">Используйте энергосберегающие лампы</h4>
          <p className="recommendation-description">LED лампы потребляют на 80% меньше энергии</p>
          <div className="recommendation-impact">
            <span className="impact-label">Экономия:</span>
            <span className="impact-value">80%</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Улучшенный компонент документов
const Documents = ({ documents }) => (
  <section className="dashboard-section-modern documents-section-modern">
    <div className="section-header-modern">
      <h3 className="section-title-modern">
        <span className="title-icon">📄</span>
        Личный архив документов
      </h3>
    </div>
    <div className="documents-grid-modern">
      {documents.map(d => (
        <div key={d.id} className="document-card-modern">
          <div className="document-icon-modern">📄</div>
          <div className="document-info-modern">
            <h4 className="document-name">{d.name}</h4>
            <p className="document-type">Тип: {d.type}</p>
            <p className="document-date">Обновлен: 2 дня назад</p>
          </div>
          <button className="document-download-modern">
            <span className="download-icon">⬇</span>
            Скачать
          </button>
        </div>
      ))}
    </div>
  </section>
);

// Улучшенный компонент заявок пользователя
const UserApplications = ({ applications, user }) => {
  const userApplications = applications.filter(app => app.userId === user.id);
  
  return (
    <section className="dashboard-section-modern applications-section-modern">
      <div className="section-header-modern">
        <h3 className="section-title-modern">
          <span className="title-icon">📋</span>
          Мои заявки на техническое присоединение
        </h3>
      </div>
      {userApplications.length === 0 ? (
        <div className="empty-state-modern">
          <div className="empty-icon-modern">📋</div>
          <h4 className="empty-title">У вас пока нет заявок</h4>
          <p className="empty-description">Подайте первую заявку на техническое присоединение</p>
          <Link to="/application" className="form-submit-modern">
            <span className="button-icon">➕</span>
            Подать заявку
          </Link>
        </div>
      ) : (
        <div className="applications-list-modern">
          {userApplications.map(app => (
            <div key={app.id} className="application-item-modern">
              <div className="app-header-modern">
                <h4 className="app-title">{app.counterpartyName || app.applicant || `Заявка №${app.id}`}</h4>
                <span className={`status-badge-modern ${(app.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                  {app.status || 'Не определен'}
                </span>
              </div>
              <div className="app-details-modern">
                <div className="detail-item">
                  <span className="detail-label">Объект:</span>
                  <span className="detail-value">{app.object || 'Не указан'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Мощность:</span>
                  <span className="detail-value">{app.power || 'Не указана'} кВт</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Напряжение:</span>
                  <span className="detail-value">{app.voltage || 'Не указано'} кВ</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Дата подачи:</span>
                  <span className="detail-value">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Не указана'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Улучшенный компонент оценки
const RatingForm = ({ rating, setRating, comment, setComment, handleRatingSubmit }) => (
  <section className="dashboard-section-modern rating-section-modern">
    <div className="section-header-modern">
      <h3 className="section-title-modern">
        <span className="title-icon">⭐</span>
        Оценка качества обслуживания
      </h3>
    </div>
    <form onSubmit={handleRatingSubmit} className="rating-form-modern">
      <div className="rating-stars-modern">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star-modern ${rating >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            ⭐
          </button>
        ))}
      </div>
      <div className="rating-labels">
        <span className="rating-label">Плохо</span>
        <span className="rating-label">Отлично</span>
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ваш комментарий (необязательно)"
        className="form-input-modern"
      />
      <button type="submit" className="form-submit-modern">
        <span className="button-icon">📤</span>
        Отправить оценку
      </button>
    </form>
  </section>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { applications } = useSelector(state => state.application);
  const navigate = useNavigate();

  const [filterDate, setFilterDate] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [realTimeReading, setRealTimeReading] = useState(1250.75);
  const [consumption, setConsumption] = useState([
    { date: '2024-01', value: 1200 },
    { date: '2024-02', value: 1350 },
    { date: '2024-03', value: 1100 },
    { date: '2024-04', value: 1400 },
    { date: '2024-05', value: 1250 },
    { date: '2024-06', value: 1300 },
  ]);

  // Режим реального времени для счетчика и графика
  useEffect(() => {
    const interval = setInterval(() => {
      // Обновление показаний счетчика в реальном времени
      const hour = new Date().getHours();
      const baseChange = (hour >= 8 && hour <= 20) ? 1 : -1;
      const randomChange = (Math.random() * 5 - 2.5);
      setRealTimeReading(prev => Math.max(1000, prev + baseChange + randomChange));

      // Обновление графика потребления
      setConsumption(prev => {
        const newConsumption = [...prev];
        const lastValue = newConsumption[newConsumption.length - 1];
        const newValue = lastValue.value + (Math.random() * 100 - 50);
        newConsumption[newConsumption.length - 1] = {
          ...lastValue,
          value: Math.max(800, Math.min(2000, newValue))
        };
        return newConsumption;
      });
    }, 3000); // Обновление каждые 3 секунды

    return () => clearInterval(interval);
  }, []);

  const compareData = {
    current: realTimeReading,
    previous: 1180.50
  };

  const paymentHistory = [
    { date: '2024-01-15', amount: 2500, status: 'Оплачено' },
    { date: '2024-02-15', amount: 2800, status: 'Оплачено' },
    { date: '2024-03-15', amount: 2200, status: 'Оплачено' },
    { date: '2024-04-15', amount: 3000, status: 'В обработке' },
  ];

  const notifications = [
    'Новое уведомление о техническом обслуживании',
    'Обновление тарифов с 1 мая',
    'Плановое отключение электроэнергии 15 мая',
  ];

  const documents = [
    { id: 1, name: 'Договор энергоснабжения', type: 'PDF' },
    { id: 2, name: 'Акт выполненных работ', type: 'PDF' },
    { id: 3, name: 'Счет за март 2024', type: 'PDF' },
  ];

  const handleSubmitApplication = () => {
    navigate('/application');
  };

  const handlePayment = () => {
    alert('Переход к оплате...');
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    alert(`Спасибо за оценку: ${rating} звезд!`);
    setRating(0);
    setComment('');
  };

  const renderSection = () => {
    if (!isAuthenticated) {
      return (
        <div className="dashboard-section">
          <h3>Добро пожаловать в систему управления энергоснабжением</h3>
          <p>Для доступа к функциям системы необходимо войти в систему.</p>
          <button onClick={() => navigate('/login')} className="form-submit">
            Войти в систему
          </button>
        </div>
      );
    }

    if (user.role === 'applicant') {
      switch (activeSection) {
        case 'overview':
          return (
            <div className="overview-grid">
              <UserPanel user={user} />
              <div className="chart-section">
                <ConsumptionChart consumption={consumption} realTimeReading={realTimeReading} />
              </div>
              <div className="meter-section">
                <MeterReading realTimeReading={realTimeReading} compareData={compareData} />
              </div>
            </div>
          );
        case 'applications':
          return <UserApplications applications={applications} user={user} />;
        case 'payments':
          return (
            <PaymentHistory 
              paymentHistory={paymentHistory} 
              filterDate={filterDate} 
              setFilterDate={setFilterDate} 
              handlePayment={handlePayment} 
            />
          );
        case 'notifications':
          return <Notifications notifications={notifications} />;
        case 'documents':
          return <Documents documents={documents} />;
        case 'recommendations':
          return <Recommendations />;
        case 'rating':
          return (
            <RatingForm 
              rating={rating} 
              setRating={setRating} 
              comment={comment} 
              setComment={setComment} 
              handleRatingSubmit={handleRatingSubmit} 
            />
          );
        default:
          return (
            <div className="overview-grid">
              <UserPanel user={user} />
              <div className="chart-section">
                <ConsumptionChart consumption={consumption} realTimeReading={realTimeReading} />
              </div>
              <div className="meter-section">
                <MeterReading realTimeReading={realTimeReading} compareData={compareData} />
              </div>
            </div>
          );
      }
    }

    if (user.role === 'employee') {
      return (
        <div className="dashboard-section">
          <h3>Панель сотрудника</h3>
          <p>Добро пожаловать в панель управления для сотрудников.</p>
          <button onClick={() => navigate('/employee-panel')} className="form-submit">
            Перейти к панели сотрудника
          </button>
        </div>
      );
    }

    return (
      <div className="dashboard-section">
        <h3>Неизвестная роль пользователя</h3>
        <p>Обратитесь к администратору системы.</p>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Система управления энергоснабжением</h1>
        </div>
        <div className="dashboard-container">
          <div className="dashboard-main">
            {renderSection()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Панель управления</h1>
        <div className="user-info">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <h3>{user.name || 'Пользователь'}</h3>
            <p>Роль: {user.role === 'applicant' ? 'Заявитель' : user.role}</p>
            {user.organization && <p>Организация: {user.organization}</p>}
          </div>
        </div>
      </div>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <h3 className="sidebar-title">Меню</h3>
            <nav className="sidebar-nav">
              {isAuthenticated && user.role === 'applicant' && (
                <>
                <button 
                  onClick={() => setActiveSection('overview')} 
                  className={`sidebar-link ${activeSection === 'overview' ? 'active' : ''}`}
                >
                  <span className="material-icons">dashboard</span>
                  <span>Обзор</span>
                </button>
                <button 
                  onClick={() => setActiveSection('applications')} 
                  className={`sidebar-link ${activeSection === 'applications' ? 'active' : ''}`}
                >
                  <span className="material-icons">description</span>
                  <span>Мои заявки</span>
                </button>
                <button 
                  onClick={() => setActiveSection('payments')} 
                  className={`sidebar-link ${activeSection === 'payments' ? 'active' : ''}`}
                >
                  <span className="material-icons">payment</span>
                  <span>Оплаты</span>
                </button>
                <button 
                  onClick={() => setActiveSection('notifications')} 
                  className={`sidebar-link ${activeSection === 'notifications' ? 'active' : ''}`}
                >
                  <span className="material-icons">notifications</span>
                  <span>Уведомления</span>
                </button>
                <button 
                  onClick={() => setActiveSection('documents')} 
                  className={`sidebar-link ${activeSection === 'documents' ? 'active' : ''}`}
                >
                  <span className="material-icons">folder</span>
                  <span>Документы</span>
                </button>
                <button 
                  onClick={() => setActiveSection('recommendations')} 
                  className={`sidebar-link ${activeSection === 'recommendations' ? 'active' : ''}`}
                >
                  <span className="material-icons">lightbulb</span>
                  <span>Рекомендации</span>
                </button>
                <button 
                  onClick={() => setActiveSection('rating')} 
                  className={`sidebar-link ${activeSection === 'rating' ? 'active' : ''}`}
                >
                  <span className="material-icons">star</span>
                  <span>Оценка</span>
                </button>
                <Link to="/application" className="sidebar-link">
                  <span className="material-icons">add_circle</span>
                  <span>Подать заявку</span>
                </Link>
                </>
              )}
              {isAuthenticated && user.role === 'employee' && (
                <Link to="/employee-panel" className="sidebar-link active">
                  <span className="material-icons">admin_panel_settings</span>
                  <span>Панель сотрудника</span>
                </Link>
              )}
              <button onClick={() => navigate('/')} className="sidebar-link logout-btn">
                <span className="material-icons">logout</span>
                <span>Выход</span>
              </button>
            </nav>
          </div>
        </aside>
        <main className="dashboard-main">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;