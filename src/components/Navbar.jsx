import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/navbar.scss';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const employeeMenuItems = [
    { path: '/review', label: 'Проверка заявок', icon: 'assignment' },
    { path: '/technical', label: 'Технические условия', icon: 'engineering' },
    { path: '/approval', label: 'Утверждение ТУ', icon: 'approval' },
    { path: '/sso', label: 'ССО', icon: 'security' },
    { path: '/contract', label: 'Договоры', icon: 'description' },
    { path: '/discrepancy', label: 'Разногласия', icon: 'report_problem' },
    { path: '/construction', label: 'Контроль', icon: 'construction' },
    { path: '/tu-execution', label: 'Проверка ТУ (0,4 кВ)', icon: 'electric_meter' },
    { path: '/high-voltage-tu', label: 'Проверка ТУ (свыше 0,4 кВ)', icon: 'bolt' },
    { path: '/other-applicants-tu', label: 'Проверка ТУ (до 150 кВт)', icon: 'power' },
    { path: '/high-power-tu', label: 'Проверка ТУ (150 кВт - 5 мВт)', icon: 'high_voltage' },
    { path: '/mega-power-tu', label: 'Проверка ТУ (свыше 5 мВт)', icon: 'power_off' },
    { path: '/contract-amendment', label: 'Доп. Соглашения', icon: 'edit_note' },
    { path: '/tariff-management', label: 'Тарифы', icon: 'payments' },
    { path: '/capital-construction', label: 'Кап. строительство', icon: 'architecture' },
    { path: '/print-forms', label: 'Печатные формы', icon: 'print' },
    { path: '/power-calculation', label: 'Расчет мощности', icon: 'calculate' },
    { path: '/integration', label: 'Интеграция', icon: 'integration_instructions' },
    { path: '/geo-portal', label: 'ГЕО-портал', icon: 'map' }
  ];

  if (!isAuthenticated || user.role !== 'employee') {
    return null;
  }

  return (
    <>
      {/* Мобильное меню кнопка */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="material-icons">menu</span>
      </button>

      {/* Боковое меню */}
      <aside className={`employee-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="material-icons">admin_panel_settings</span>
            Панель сотрудника
          </h2>
          <button 
            className="close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="user-info">
            <div className="user-avatar">
              <span className="material-icons">person</span>
            </div>
            <div className="user-details">
              <h3>{user.username}</h3>
              <p>Сотрудник</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">
              <h4 className="nav-section-title">
                <span className="material-icons">dashboard</span>
                Основные функции
              </h4>
              {employeeMenuItems.slice(0, 6).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="nav-section">
              <h4 className="nav-section-title">
                <span className="material-icons">verified</span>
                Проверка ТУ
              </h4>
              {employeeMenuItems.slice(6, 12).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="nav-section">
              <h4 className="nav-section-title">
                <span className="material-icons">settings</span>
                Дополнительно
              </h4>
              {employeeMenuItems.slice(12).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="material-icons">logout</span>
              <span>Выход</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Затемнение для мобильного меню */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;