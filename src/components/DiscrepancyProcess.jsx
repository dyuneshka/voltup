import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/discrepancy-process.scss';

const DiscrepancyProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [discrepancies, setDiscrepancies] = useState([
    {
      id: 1,
      applicationId: 'APP-001',
      applicant: 'ООО "Энергия"',
      issue: 'Несоответствие технических характеристик',
      status: 'В обработке',
      dateCreated: '2024-01-15',
      priority: 'Высокий'
    },
    {
      id: 2,
      applicationId: 'APP-002',
      applicant: 'ИП Иванов',
      issue: 'Отсутствие необходимых документов',
      status: 'Разрешено',
      dateCreated: '2024-01-14',
      priority: 'Средний'
    },
    {
      id: 3,
      applicationId: 'APP-003',
      applicant: 'ЗАО "Свет"',
      issue: 'Некорректные расчеты мощности',
      status: 'Новое',
      dateCreated: '2024-01-13',
      priority: 'Высокий'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const filteredDiscrepancies = discrepancies.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.issue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Новое': return 'new';
      case 'В обработке': return 'processing';
      case 'Разрешено': return 'resolved';
      case 'Отклонено': return 'rejected';
      default: return 'new';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Высокий': return 'high';
      case 'Средний': return 'medium';
      case 'Низкий': return 'low';
      default: return 'medium';
    }
  };

  const handleResolveDiscrepancy = (id) => {
    setDiscrepancies(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'Разрешено' } : item
      )
    );
  };

  const handleRejectDiscrepancy = (id) => {
    setDiscrepancies(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'Отклонено' } : item
      )
    );
  };

  return (
    <div className="discrepancy-process">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">report_problem</span>
            Протокол разногласий
          </h1>
          <p className="page-subtitle">
            Управление и разрешение разногласий по заявкам на техническое присоединение
          </p>
        </div>
      </div>

      <div className="page-content">
        {/* Фильтры и поиск */}
        <div className="filters-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Поиск по заявителю или проблеме..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Все ({discrepancies.length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'Новое' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Новое')}
            >
              Новые ({discrepancies.filter(d => d.status === 'Новое').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'В обработке' ? 'active' : ''}`}
              onClick={() => setFilterStatus('В обработке')}
            >
              В обработке ({discrepancies.filter(d => d.status === 'В обработке').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'Разрешено' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Разрешено')}
            >
              Разрешено ({discrepancies.filter(d => d.status === 'Разрешено').length})
            </button>
          </div>
        </div>

        {/* Таблица разногласий */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID заявки</th>
                <th>Заявитель</th>
                <th>Проблема</th>
                <th>Приоритет</th>
                <th>Дата создания</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscrepancies.map(item => (
                <tr key={item.id}>
                  <td>#{item.applicationId}</td>
                  <td>
                    <div className="applicant-info">
                      <strong>{item.applicant}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="issue-info">
                      <span>{item.issue}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{new Date(item.dateCreated).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {item.status !== 'Разрешено' && item.status !== 'Отклонено' && (
                        <>
                          <button 
                            onClick={() => handleResolveDiscrepancy(item.id)} 
                            className="action-btn resolve-btn"
                          >
                            <span className="material-icons">check_circle</span>
                            Разрешить
                          </button>
                          <button 
                            onClick={() => handleRejectDiscrepancy(item.id)} 
                            className="action-btn reject-btn"
                          >
                            <span className="material-icons">cancel</span>
                            Отклонить
                          </button>
                        </>
                      )}
                      <button 
                        className="action-btn view-btn"
                      >
                        <span className="material-icons">visibility</span>
                        Просмотр
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Статистика */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon new">
                <span className="material-icons">fiber_new</span>
              </div>
              <div className="stat-content">
                <h3>{discrepancies.filter(d => d.status === 'Новое').length}</h3>
                <p>Новые</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon processing">
                <span className="material-icons">pending</span>
              </div>
              <div className="stat-content">
                <h3>{discrepancies.filter(d => d.status === 'В обработке').length}</h3>
                <p>В обработке</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon resolved">
                <span className="material-icons">check_circle</span>
              </div>
              <div className="stat-content">
                <h3>{discrepancies.filter(d => d.status === 'Разрешено').length}</h3>
                <p>Разрешено</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rejected">
                <span className="material-icons">cancel</span>
              </div>
              <div className="stat-content">
                <h3>{discrepancies.filter(d => d.status === 'Отклонено').length}</h3>
                <p>Отклонено</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscrepancyProcess;