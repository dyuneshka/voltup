import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/employee-layout.scss';

const EmployeeLayout = ({ children, title, subtitle }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  if (!isAuthenticated || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="employee-layout">
      <Navbar />
      
      <main className="employee-main">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          <div className="header-actions">
            <div className="breadcrumb">
              <span className="material-icons">home</span>
              <span>Главная</span>
              <span className="material-icons">chevron_right</span>
              <span>{title}</span>
            </div>
          </div>
        </div>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout; 