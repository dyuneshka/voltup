import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, register } from '../redux/slices/authSlice'; // Корректируйте путь при необходимости
import Dashboard from './Dashboard';
import ApplicationReview from './ApplicationReview'; // Импорт для сотрудников
import '../styles/home.scss';

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', organization: '', role: 'applicant' });
  const dispatch = useDispatch();
  const { registeredUsers, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLoginClick = () => setIsLoginOpen(true);
  const handleRegisterClick = () => setIsRegisterOpen(true);
  const handleClose = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', password: '', organization: '', role: 'applicant' });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      alert('Заполните все поля');
      return;
    }
    const user = registeredUsers.find(u => u.username === loginData.username && u.password === loginData.password);
    if (user) {
      dispatch(login(user));
      handleClose();
    } else {
      alert('Неверное имя пользователя или пароль');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerData.username || !registerData.password || (registerData.role === 'org' && !registerData.organization)) {
      alert('Заполните все обязательные поля');
      return;
    }
    if (registeredUsers.find(u => u.username === registerData.username)) {
      alert('Пользователь с таким именем уже существует');
      return;
    }
    const newUser = {
      id: Date.now(),
      username: registerData.username,
      password: registerData.password,
      role: registerData.role,
      email: `${registerData.username}@example.com`,
      phone: `+7999${Math.floor(1000000 + Math.random() * 9000000)}`,
      organization: registerData.role === 'org' ? registerData.organization : null,
    };
    dispatch(register(newUser));
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="landing-page">
      {!isAuthenticated ? (
        <>
          <header className="header">
            <div className="container">
              <h1 className="logo">VoltUp</h1>
              <p className="slogan">Интегрированная цифровая платформа для технологического присоединения и управления энергопотреблением</p>
              <a href="#description" className="cta-button">Узнать больше</a>
              <button onClick={handleLoginClick} className="auth-button">Вход</button>
              <button onClick={handleRegisterClick} className="auth-button">Регистрация</button>
            </div>
          </header>

          {isLoginOpen && (
            <div className="modal-overlay" onClick={handleClose}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Вход</h2>
                <form onSubmit={handleLoginSubmit}>
                  <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="modal-input"
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="modal-input"
                  />
                  <button type="submit" className="modal-submit">Войти</button>
                </form>
                <button onClick={handleClose} className="modal-close">Закрыть</button>
              </div>
            </div>
          )}

          {isRegisterOpen && (
            <div className="modal-overlay" onClick={handleClose}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Регистрация</h2>
                <form onSubmit={handleRegisterSubmit}>
                  <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="modal-input"
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="modal-input"
                  />
                  <input
                    type="text"
                    placeholder="Название организации"
                    value={registerData.organization}
                    onChange={(e) => setRegisterData({ ...registerData, organization: e.target.value })}
                    className="modal-input"
                    disabled={registerData.role === 'applicant'}
                  />
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    className="modal-input"
                  >
                    <option value="applicant">Заявитель</option>
                    <option value="org">Организация</option>
                  </select>
                  <button type="submit" className="modal-submit">Зарегистрироваться</button>
                </form>
                <button onClick={handleClose} className="modal-close">Закрыть</button>
              </div>
            </div>
          )}

          <main className="main">
            <section id="description" className="section description">
              <div className="container">
                <h2 className="section-title">О проекте</h2>
                <p className="section-text">
                  VoltUp — это инновационная платформа, разработанная для автоматизации процесса технологического присоединения к электросетям. Она обеспечивает прозрачность, сокращает сроки обработки заявок, улучшает клиентский сервис и предоставляет инструменты для мониторинга энергопотребления и оплаты. Созданная для АО "Чеченэнерго", платформа интегрируется с системами АСКУЭ, СУПА, CRM и 1С, гарантируя надежность и масштабируемость.
                </p>
                <img src="path/to/image.jpg" alt="Изображение проекта" className="section-image" />
              </div>
            </section>

            <section id="advantages" className="section advantages">
              <div className="container">
                <h2 className="section-title">Преимущества</h2>
                <ul className="advantages-list">
                  <li className="advantage-item">Сокращение срока обработки заявок с 30 до 15 дней</li>
                  <li className="advantage-item">Увеличение доли онлайн-заявок до 80%</li>
                  <li className="advantage-item">Повышение прозрачности и доверия со стороны клиентов</li>
                  <li className="advantage-item">Снижение нагрузки на сотрудников благодаря автоматизации</li>
                  <li className="advantage-item">Улучшение эффективности обслуживания и снижение числа отказов</li>
                </ul>
              </div>
            </section>
          </main>

          <footer className="footer">
            <div className="container">
              <h3 className="footer-title">Контакты</h3>
              <p className="footer-contact">Email: info@voltup.com</p>
              <p className="footer-contact">Телефон: +7 (8712) 123-456</p>
              <p className="footer-contact">Адрес: г. Грозный, ул. Мира, д. 15</p>
              <p className="footer-copy">© 2025 VoltUp. Все права защищены.</p>
            </div>
          </footer>
        </>
      ) : user?.role === 'employee' ? (
        <ApplicationReview user={user} onLogout={handleLogout} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Home;