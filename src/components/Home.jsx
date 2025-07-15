import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, register } from '../redux/slices/authSlice'; // Корректируйте путь при необходимости
import Dashboard from './Dashboard';
import '../styles/home.scss';
import logo from '../img/logo.png';
import project from '../img/project.png';
import processingTime from '../img/processing time.png';
import online from '../img/onlin.png';
import transparency from '../img/prozrachnost.png';
import efficiency from '../img/effexctivnost.png';
import workload from '../img/nagruzka.png';
import { Navigate } from 'react-router-dom';

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
            <div className="container header-flex">
              <div className="header-left">
              <a href="#">      
                <img src={logo} alt="VoltUp Logo" className="logo-img" />
              </a>
              </div>
              <div className="header-right">
                <button onClick={handleLoginClick} className="auth-button"><span className="material-icons" style={{verticalAlign: 'middle', marginRight: 6}}>login</span>Вход</button>
                <button onClick={handleRegisterClick} className="auth-button"><span className="material-icons" style={{verticalAlign: 'middle', marginRight: 6}}>person_add</span>Регистрация</button>
              </div>
            </div>
          </header>

          <section className="hero-section">
            <svg className="electric-bolt bolt-1" width="320" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,12 40,4 80,20 120,8 160,16 200,6 240,18 280,10 320,12" stroke="#ffd700" strokeWidth="6" fill="none"/>
            </svg>
            <svg className="electric-bolt bolt-2" width="320" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,10 30,18 60,6 90,20 120,8 150,16 180,6 210,18 240,10 270,20 300,8 320,12" stroke="#00bfff" strokeWidth="6" fill="none"/>
            </svg>
            <svg className="electric-bolt bolt-3" width="320" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,14 40,8 80,22 120,6 160,18 200,8 240,20 280,12 320,14" stroke="#ff6b6b" strokeWidth="6" fill="none"/>
            </svg>
            <svg className="electric-bolt bolt-4" width="320" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,8 40,20 80,6 120,18 160,8 200,20 240,10 280,22 320,8" stroke="#32cd32" strokeWidth="6" fill="none"/>
            </svg>
            <svg className="electric-bolt bolt-5" width="320" height="24" viewBox="0 0 320 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,16 40,10 80,24 120,8 160,20 200,10 240,22 280,14 320,16" stroke="#ffa500" strokeWidth="6" fill="none"/>
            </svg>
            <div className="container">
              <p className="slogan">Интегрированная цифровая платформа для технологического присоединения и управления энергопотреблением</p>
              <a href="#description" className="cta-button">Узнать больше <span className="material-icons" style={{verticalAlign: 'middle', fontSize: '1.2em'}}>arrow_downward</span></a>
            </div>
          </section>

          {isLoginOpen && (
            <div className="modal-overlay" onClick={handleClose}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Вход <span className="material-icons" style={{verticalAlign: 'middle', color: '#3f51b5'}}>login</span></h2>
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
                <button onClick={handleClose} className="modal-close"><span className="material-icons" style={{verticalAlign: 'middle'}}>close</span> Закрыть</button>
              </div>
            </div>
          )}

          {isRegisterOpen && (
            <div className="modal-overlay" onClick={handleClose}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Регистрация <span className="material-icons" style={{verticalAlign: 'middle', color: '#43a047'}}>person_add</span></h2>
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
                <button onClick={handleClose} className="modal-close"><span className="material-icons" style={{verticalAlign: 'middle'}}>close</span> Закрыть</button>
              </div>
            </div>
          )}

          <main className="main">
            <section id="description" className="section description">
              <div className="container">
                <h2 className="section-title">О проекте</h2>
                <div className="project-content">
                  <div className="project-image">
                    <img src={project} alt="Изображение проекта" className="section-image" />
                  </div>
                  <div className="project-text">
                    <p className="section-text">
                      VoltUp — это инновационная платформа, разработанная для автоматизации процесса технологического присоединения к электросетям. Она обеспечивает прозрачность, сокращает сроки обработки заявок, улучшает клиентский сервис и предоставляет инструменты для мониторинга энергопотребления и оплаты. Созданная для АО "Чеченэнерго", платформа интегрируется с системами АСКУЭ, СУПА, CRM и 1С, гарантируя надежность и масштабируемость.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="advantages" className="section advantages">
              <div className="container">
                <h2 className="section-title">Преимущества</h2>
                <ul className="advantages-list">
                  <li className="advantage-item">
                    <div className="advantage-image">
                      <img src={processingTime} alt="Сокращение сроков" />
                    </div>
                    <div className="advantage-text">
                      <h3>Сокращение сроков</h3>
                      <p>Сокращение срока обработки заявок с 120 до 30 дней</p>
                    </div>
                  </li>
                  <li className="advantage-item">
                    <div className="advantage-image">
                      <img src={online} alt="Онлайн-заявки" />
                    </div>
                    <div className="advantage-text">
                      <h3>Онлайн-сервис</h3>
                      <p>Увеличение доли онлайн-заявок до 80%</p>
                    </div>
                  </li>
                  <li className="advantage-item">
                    <div className="advantage-image">
                      <img src={transparency} alt="Прозрачность" />
                    </div>
                    <div className="advantage-text">
                      <h3>Прозрачность</h3>
                      <p>Повышение прозрачности и доверия со стороны клиентов</p>
                    </div>
                  </li>
                  <li className="advantage-item">
                    <div className="advantage-image">
                      <img src={workload} alt="Снижение нагрузки" />
                    </div>
                    <div className="advantage-text">
                      <h3>Автоматизация</h3>
                      <p>Снижение нагрузки на сотрудников благодаря автоматизации</p>
                    </div>
                  </li>
                  <li className="advantage-item">
                    <div className="advantage-image">
                      <img src={efficiency} alt="Эффективность" />
                    </div>
                    <div className="advantage-text">
                      <h3>Эффективность</h3>
                      <p>Улучшение эффективности обслуживания и снижение числа отказов</p>
                    </div>
                  </li>
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
        <Navigate to="/review" />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Home;