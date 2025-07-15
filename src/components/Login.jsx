import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.scss';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { isAuthenticated } = useSelector(state => state.auth);

  // Функции валидации
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value || value.trim().length < 3) {
          return 'Имя пользователя должно содержать минимум 3 символа';
        }
        break;
      case 'password':
        if (!value || value.length < 4) {
          return 'Пароль должен содержать минимум 4 символа';
        }
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);
    
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    if (touched.username) {
      const error = validateField('username', value);
      setErrors(prev => ({
        ...prev,
        username: error
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      const error = validateField('password', value);
      setErrors(prev => ({
        ...prev,
        password: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = name === 'username' ? username : password;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Помечаем все поля как "тронутые"
    setTouched({ username: true, password: true });
    
    // Валидация формы
    if (!validateForm()) {
      return;
    }
    
    const user = { id: Date.now(), username, role: username === 'newuser' ? 'applicant' : 'existing' };
    dispatch(login(user));
    navigate(user.role === 'applicant' ? '/application' : '/dashboard');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={username} 
          onChange={handleUsernameChange}
          onBlur={() => handleBlur('username')}
          placeholder="Имя пользователя"
          className={touched.username && errors.username ? 'error' : ''}
        />
        {touched.username && errors.username && (
          <p className="error-message">{errors.username}</p>
        )}
        <input 
          type="password" 
          value={password} 
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          placeholder="Пароль"
          className={touched.password && errors.password ? 'error' : ''}
        />
        {touched.password && errors.password && (
          <p className="error-message">{errors.password}</p>
        )}
        <button type="submit">Войти</button>
      </form>
      <p>Используйте: <strong>newuser</strong> для заявителя, <strong>employee</strong> для сотрудника.</p>
    </div>
  );
};

export default Login;