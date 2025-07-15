import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { submitApplication } from '../redux/slices/applicationSlice';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/application.scss';

const ApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    counterpartyName: '',
    inn: '',
    kpp: '',
    egrul: '',
    registryDate: '',
    legalAddress: '',
    actualAddress: '',
    postalAddress: '',
    phone: '',
    reason: '',
    object: '',
    objectAddress: '',
    okved: '',
    power: '',
    voltage: '',
    supplyCompany: '',
    reliabilityCategory: '',
    isLegal: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Функции валидации
  const validateField = (name, value) => {
    switch (name) {
      case 'counterpartyName':
        if (formData.isLegal && (!value || value.trim().length < 2)) {
          return 'Наименование должно содержать минимум 2 символа';
        }
        break;
      case 'inn':
        if (formData.isLegal) {
          if (!value) return 'ИНН обязателен для юридических лиц';
          if (!/^\d{10}$/.test(value)) return 'ИНН должен содержать 10 цифр';
        }
        break;
      case 'kpp':
        if (formData.isLegal) {
          if (!value) return 'КПП обязателен для юридических лиц';
          if (!/^\d{9}$/.test(value)) return 'КПП должен содержать 9 цифр';
        }
        break;
      case 'egrul':
        if (formData.isLegal) {
          if (!value) return 'ЕГРЮЛ обязателен для юридических лиц';
          if (!/^\d{13}$/.test(value)) return 'ЕГРЮЛ должен содержать 13 цифр';
        }
        break;
      case 'registryDate':
        if (formData.isLegal && !value) {
          return 'Дата внесения в реестр обязательна';
        }
        break;
      case 'legalAddress':
        if (!value || value.trim().length < 10) {
          return 'Адрес должен содержать минимум 10 символов';
        }
        break;
      case 'actualAddress':
        if (!value || value.trim().length < 10) {
          return 'Адрес должен содержать минимум 10 символов';
        }
        break;
      case 'postalAddress':
        if (!value || value.trim().length < 10) {
          return 'Адрес должен содержать минимум 10 символов';
        }
        break;
      case 'phone':
        if (!value) return 'Телефон обязателен';
        if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(value)) {
          return 'Введите корректный номер телефона';
        }
        break;
      case 'reason':
        if (!value || value.trim().length < 5) {
          return 'Причина обращения должна содержать минимум 5 символов';
        }
        break;
      case 'object':
        if (!value || value.trim().length < 3) {
          return 'Объект должен содержать минимум 3 символа';
        }
        break;
      case 'objectAddress':
        if (!value || value.trim().length < 10) {
          return 'Адрес объекта должен содержать минимум 10 символов';
        }
        break;
      case 'okved':
        if (formData.isLegal && (!value || !/^\d{2}\.\d{2}$/.test(value))) {
          return 'ОКВЭД должен быть в формате XX.XX';
        }
        break;
      case 'power':
        if (!value) return 'Мощность обязательна';
        if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0) {
          return 'Введите корректную мощность (число больше 0)';
        }
        break;
      case 'voltage':
        if (!value) return 'Напряжение обязательно';
        if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0) {
          return 'Введите корректное напряжение (число больше 0)';
        }
        break;
      case 'supplyCompany':
        if (!value || value.trim().length < 2) {
          return 'Название компании должно содержать минимум 2 символа';
        }
        break;
      case 'reliabilityCategory':
        if (!value) return 'Категория надежности обязательна';
        if (!['1', '2', '3'].includes(value)) {
          return 'Выберите категорию надежности (1, 2 или 3)';
        }
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'isLegal') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Валидация при изменении поля
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleTypeChange = (e) => {
    const isLegal = e.target.value === 'legal';
    setFormData({ 
      ...formData, 
      isLegal, 
      inn: '', 
      kpp: '', 
      egrul: '', 
      registryDate: '',
      counterpartyName: '',
      okved: ''
    });
    
    // Очищаем ошибки для полей, которые больше не нужны
    if (!isLegal) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.inn;
        delete newErrors.kpp;
        delete newErrors.egrul;
        delete newErrors.registryDate;
        delete newErrors.counterpartyName;
        delete newErrors.okved;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Помечаем все поля как "тронутые" для показа ошибок
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'isLegal') allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Валидация формы
    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }
    
    if (user && user.role === 'applicant') {
      const newApplication = {
        ...formData,
        userId: user.id,
      };
      dispatch(submitApplication(newApplication));
      alert('Заявка подана!');
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user || user.role !== 'applicant') {
    navigate('/');
    return null;
  }

  return (
    <div className="application-form">
      <header className="dashboard-header">
        <h1>Подать заявку на ТП</h1>
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
      </header>
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-menu">
            <h3 className="sidebar-title">Меню</h3>
            <nav className="sidebar-nav">
              {isAuthenticated && user.role === 'applicant' && (
                <>
                <Link to="/application" className="sidebar-link active">
                  <span className="material-icons">description</span>
                  <span>Подать заявку</span>
                </Link>
                <Link to="/dashboard" className="sidebar-link">
                  <span className="material-icons">dashboard</span>
                  <span>Дашборд</span>
                </Link>
                </>
              )}
              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <span className="material-icons">logout</span>
                <span>Выход</span>
              </button>
            </nav>
          </div>
        </aside>
        <main className="dashboard-main">
          <h2>Подать заявку на ТП</h2>
          <div className="form-type-toggle">
            <label>
              <input
                type="radio"
                name="type"
                value="legal"
                checked={formData.isLegal}
                onChange={handleTypeChange}
              />
              <span>Юридическое лицо</span>
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="individual"
                checked={!formData.isLegal}
                onChange={handleTypeChange}
              />
              <span>Физическое лицо</span>
            </label>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {formData.isLegal && (
                <>
                  <div className="form-group">
                    <label>Наименование контрагента</label>
                    <input
                      type="text"
                      name="counterpartyName"
                      value={formData.counterpartyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Введите наименование контрагента"
                      className={`form-input ${touched.counterpartyName && errors.counterpartyName ? 'error' : ''}`}
                      required
                    />
                    {touched.counterpartyName && errors.counterpartyName && (
                      <p className="error-message">{errors.counterpartyName}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>ИНН</label>
                    <input
                      type="text"
                      name="inn"
                      value={formData.inn}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Введите ИНН"
                      className={`form-input ${touched.inn && errors.inn ? 'error' : ''}`}
                      required
                    />
                    {touched.inn && errors.inn && (
                      <p className="error-message">{errors.inn}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>КПП</label>
                    <input
                      type="text"
                      name="kpp"
                      value={formData.kpp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Введите КПП"
                      className={`form-input ${touched.kpp && errors.kpp ? 'error' : ''}`}
                      required
                    />
                    {touched.kpp && errors.kpp && (
                      <p className="error-message">{errors.kpp}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>ЕГРЮЛ</label>
                    <input
                      type="text"
                      name="egrul"
                      value={formData.egrul}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Введите ЕГРЮЛ"
                      className={`form-input ${touched.egrul && errors.egrul ? 'error' : ''}`}
                      required
                    />
                    {touched.egrul && errors.egrul && (
                      <p className="error-message">{errors.egrul}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Дата внесения в реестр</label>
                    <input
                      type="date"
                      name="registryDate"
                      value={formData.registryDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-input ${touched.registryDate && errors.registryDate ? 'error' : ''}`}
                      required
                    />
                    {touched.registryDate && errors.registryDate && (
                      <p className="error-message">{errors.registryDate}</p>
                    )}
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Юридический адрес</label>
                <input
                  type="text"
                  name="legalAddress"
                  value={formData.legalAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите юридический адрес"
                  className={`form-input ${touched.legalAddress && errors.legalAddress ? 'error' : ''}`}
                  required
                />
                {touched.legalAddress && errors.legalAddress && (
                  <p className="error-message">{errors.legalAddress}</p>
                )}
              </div>
              <div className="form-group">
                <label>Фактический адрес</label>
                <input
                  type="text"
                  name="actualAddress"
                  value={formData.actualAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите фактический адрес"
                  className={`form-input ${touched.actualAddress && errors.actualAddress ? 'error' : ''}`}
                  required
                />
                {touched.actualAddress && errors.actualAddress && (
                  <p className="error-message">{errors.actualAddress}</p>
                )}
              </div>
              <div className="form-group">
                <label>Почтовый адрес</label>
                <input
                  type="text"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите почтовый адрес"
                  className={`form-input ${touched.postalAddress && errors.postalAddress ? 'error' : ''}`}
                  required
                />
                {touched.postalAddress && errors.postalAddress && (
                  <p className="error-message">{errors.postalAddress}</p>
                )}
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите номер телефона"
                  className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                  required
                />
                {touched.phone && errors.phone && (
                  <p className="error-message">{errors.phone}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите email"
                  className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                  required
                />
                {touched.email && errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
              <div className="form-group">
                <label>Наименование объекта</label>
                <input
                  type="text"
                  name="object"
                  value={formData.object}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите наименование объекта"
                  className={`form-input ${touched.object && errors.object ? 'error' : ''}`}
                  required
                />
                {touched.object && errors.object && (
                  <p className="error-message">{errors.object}</p>
                )}
              </div>
              <div className="form-group">
                <label>Мощность (кВт)</label>
                <input
                  type="number"
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите мощность в кВт"
                  className={`form-input ${touched.power && errors.power ? 'error' : ''}`}
                  required
                />
                {touched.power && errors.power && (
                  <p className="error-message">{errors.power}</p>
                )}
              </div>
              <div className="form-group">
                <label>Напряжение (кВ)</label>
                <input
                  type="number"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Введите напряжение в кВ"
                  className={`form-input ${touched.voltage && errors.voltage ? 'error' : ''}`}
                  required
                />
                {touched.voltage && errors.voltage && (
                  <p className="error-message">{errors.voltage}</p>
                )}
              </div>
            </div>
            <button type="submit" className="form-submit">
              Отправить заявку
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ApplicationForm;