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
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      const user = { id: Date.now(), username, role: username === 'newuser' ? 'applicant' : 'existing' };
      dispatch(login(user));
      navigate(user.role === 'applicant' ? '/application' : '/dashboard');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Имя пользователя" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
        <button type="submit">Войти</button>
      </form>
      <p>Используйте: <strong>newuser</strong> для заявителя, <strong>employee</strong> для сотрудника.</p>
    </div>
  );
};

export default Login;