import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} from '../redux/slices/tuExecutionSlice';
import '../styles/tu-execution.scss';

const TuExecutionCheck = () => {
  const dispatch = useDispatch();
  const { tuExecutions, filters } = useSelector(state => state.tuExecution);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Завершена': return '#4CAF50';
      case 'В процессе проверки': return '#2196F3';
      case 'На рассмотрении': return '#FF9800';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Критический': return '#F44336';
      case 'Высокий': return '#FF9800';
      case 'Средний': return '#2196F3';
      case 'Низкий': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'Проверен': return '#4CAF50';
      case 'На проверке': return '#2196F3';
      case 'Ожидает': return '#FF9800';
      default: return '#757575';
    }
  };

  const filteredExecutions = tuExecutions.filter(execution => {
    if (filters.status !== 'all' && execution.status !== filters.status) return false;
    if (filters.priority !== 'all' && execution.priority !== filters.priority) return false;
    return true;
  });

  const handleAddComment = (executionId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Текущий пользователь',
        text: newComment,
        date: new Date().toISOString().split('T')[0]
      };
      dispatch(addComment({ executionId, comment }));
      setNewComment('');
    }
  };

  const handleDocumentStatusChange = (executionId, documentId, status) => {
    dispatch(updateDocumentStatus({ executionId, documentId, status }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  return (
    <div className="tu-execution-check">
      {/* Заголовок с градиентом */}
      <div className="tu-execution-header">
        <div className="header-content">
          <h1>
            <span className="icon">⚡</span>
            Проверка исполнения ТУ (0,4 кВ)
          </h1>
          <p>Контроль выполнения технических условий для низковольтных подключений</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{tuExecutions.length}</span>
            <span className="stat-label">Всего заявок</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {tuExecutions.filter(e => e.status === 'Завершена').length}
            </span>
            <span className="stat-label">Завершено</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {tuExecutions.filter(e => e.status === 'В процессе проверки').length}
            </span>
            <span className="stat-label">В процессе</span>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="filters-section">
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="icon">🔍</span>
          Фильтры
          <span className={`arrow ${showFilters ? 'up' : 'down'}`}>▼</span>
        </button>
        
        {showFilters && (
          <div className="filters-content">
            <div className="filter-group">
              <label>Статус:</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="На рассмотрении">На рассмотрении</option>
                <option value="В процессе проверки">В процессе проверки</option>
                <option value="Завершена">Завершена</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Приоритет:</label>
              <select 
                value={filters.priority} 
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="all">Все приоритеты</option>
                <option value="Критический">Критический</option>
                <option value="Высокий">Высокий</option>
                <option value="Средний">Средний</option>
                <option value="Низкий">Низкий</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Список заявок */}
      <div className="executions-grid">
        {filteredExecutions.map(execution => (
          <div 
            key={execution.id} 
            className={`execution-card ${selectedExecution?.id === execution.id ? 'selected' : ''}`}
            onClick={() => setSelectedExecution(execution)}
          >
            <div className="card-header">
              <div className="card-title">
                <h3>{execution.applicationNumber}</h3>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(execution.priority) }}
                >
                  {execution.priority}
                </span>
              </div>
              <div className="card-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(execution.status) }}
                ></span>
                <span className="status-text">{execution.status}</span>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Заявитель:</span>
                <span className="value">{execution.applicantName}</span>
              </div>
              <div className="info-row">
                <span className="label">Адрес:</span>
                <span className="value">{execution.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Мощность:</span>
                <span className="value">{execution.power}</span>
              </div>
              <div className="info-row">
                <span className="label">Этап:</span>
                <span className="value">{execution.stage}</span>
              </div>
              <div className="info-row">
                <span className="label">Срок:</span>
                <span className="value deadline">{execution.deadline}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Прогресс проверки</span>
                <span className="progress-percentage">{execution.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${execution.progress}%`,
                    backgroundColor: getStatusColor(execution.status)
                  }}
                ></div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-primary">
                <span className="icon">👁️</span>
                Просмотр
              </button>
              <button className="btn-secondary">
                <span className="icon">📝</span>
                Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Детальная информация */}
      {selectedExecution && (
        <div className="execution-details">
          <div className="details-header">
            <h2>Детали заявки {selectedExecution.applicationNumber}</h2>
            <button 
              className="close-btn"
              onClick={() => setSelectedExecution(null)}
            >
              ✕
            </button>
          </div>

          <div className="details-content">
            <div className="details-section">
              <h3>📋 Документы</h3>
              <div className="documents-list">
                {selectedExecution.documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span 
                        className="document-status"
                        style={{ color: getDocumentStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="document-actions">
                      <select 
                        value={doc.status}
                        onChange={(e) => handleDocumentStatusChange(
                          selectedExecution.id, 
                          doc.id, 
                          e.target.value
                        )}
                      >
                        <option value="Ожидает">Ожидает</option>
                        <option value="На проверке">На проверке</option>
                        <option value="Проверен">Проверен</option>
                      </select>
                      {doc.date && <span className="document-date">{doc.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h3>💬 Комментарии</h3>
              <div className="comments-list">
                {selectedExecution.comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="add-comment">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавить комментарий..."
                  rows="3"
                ></textarea>
                <button 
                  className="btn-primary"
                  onClick={() => handleAddComment(selectedExecution.id)}
                >
                  Добавить комментарий
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuExecutionCheck; 