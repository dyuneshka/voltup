import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Исправлено с react-router-dom на react-redux
import { logout } from '../redux/slices/authSlice';
import '../styles/auth.scss';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul>
        {!isAuthenticated && <li><Link to="/">Главная</Link></li>}
        {isAuthenticated && user.role === 'applicant' && (
          <>
            <li><Link to="/application">Подать заявку</Link></li>
            <li><Link to="/dashboard">Дашборд</Link></li>
          </>
        )}
        {isAuthenticated && user.role === 'employee' && (
          <>
            <li><Link to="/review">Проверка заявок</Link></li>
            <li><Link to="/technical">Технические условия</Link></li>
            <li><Link to="/approval/:appId"></Link>Утверждение ТУ</li>
            <li><Link to="/sso">ССО</Link></li>
            <li><Link to="/contract">Договоры</Link></li>
            <li><Link to="/discrepancy">Разногласия</Link></li>
            <li><Link to="/construction">Контроль</Link></li>
            <li><Link to="/tu-execution">Проверка ТУ (0,4 кВ)</Link></li>
            <li><Link to="/high-voltage-tu">Проверка ТУ (свыше 0,4 кВ)</Link></li>
            <li><Link to="/other-applicants-tu">Проверка ТУ (до 150 кВт)</Link></li>
            <li><Link to="/high-power-tu">Проверка ТУ (150 кВт - 5 мВт)</Link></li>
            <li><Link to="/mega-power-tu">Проверка ТУ (свыше 5 мВт)</Link></li>
            <li><Link to="/contract-amendment">Доп. Соглашения</Link></li>
            <li><Link to="/tariff-management">Тарифы</Link></li>
            <li><Link to="/capital-construction">Кап. строительство</Link></li>
            <li><Link to="/print-forms">Печатные формы</Link></li>
            <li><Link to="/power-calculation">Расчет мощности</Link></li>
            <li><Link to="/integration">Интеграция</Link></li>
            <li><Link to="/geo-portal">ГЕО-портал</Link></li>
          </>
        )}
        {isAuthenticated && <li><Link to="/" onClick={() => dispatch(logout())}>Выход</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;