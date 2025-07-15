import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} from '../redux/slices/highVoltageTuSlice';
import '../styles/high-voltage-tu.scss';

const HighVoltageTuCheck = () => {
  const dispatch = useDispatch();
  const { highVoltageTus, filters } = useSelector(state => state.highVoltageTu);
  const [selectedTu, setSelectedTu] = useState(null);
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

  const getVoltageColor = (voltage) => {
    switch (voltage) {
      case '110 кВ': return '#F44336';
      case '220 кВ': return '#FF9800';
      case '330 кВ': return '#FFC107';
      case '500 кВ': return '#9C27B0';
      case '750 кВ': return '#673AB7';
      default: return '#2196F3';
    }
  };

  const filteredTus = highVoltageTus.filter(tu => {
    if (filters.status !== 'all' && tu.status !== filters.status) return false;
    if (filters.priority !== 'all' && tu.priority !== filters.priority) return false;
    return true;
  });

  const handleAddComment = (tuId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Текущий пользователь',
        text: newComment,
        date: new Date().toISOString().split('T')[0]
      };
      dispatch(addComment({ tuId, comment }));
      setNewComment('');
    }
  };

  const handleDocumentStatusChange = (tuId, documentId, status) => {
    dispatch(updateDocumentStatus({ tuId, documentId, status }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  return (
    <div className="high-voltage-tu-check">
      {/* Заголовок с градиентом */}
      <div className="tu-header">
        <div className="header-content">
          <h1>
            <span className="icon">⚡</span>
            Проверка высоковольтных ТУ
          </h1>
          <p>Контроль технических условий для высоковольтных подключений (110-750 кВ)</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{highVoltageTus.length}</span>
            <span className="stat-label">Всего ТУ</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {highVoltageTus.filter(tu => tu.status === 'Завершена').length}
            </span>
            <span className="stat-label">Завершено</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {highVoltageTus.filter(tu => tu.status === 'В процессе проверки').length}
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

      {/* Список ТУ */}
      <div className="tus-grid">
        {filteredTus.map(tu => (
          <div 
            key={tu.id} 
            className={`tu-card ${selectedTu?.id === tu.id ? 'selected' : ''}`}
            onClick={() => setSelectedTu(tu)}
          >
            <div className="card-header">
              <div className="card-title">
                <h3>{tu.applicationNumber}</h3>
                <div className="badges">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(tu.priority) }}
                  >
                    {tu.priority}
                  </span>
                  <span 
                    className="voltage-badge"
                    style={{ backgroundColor: getVoltageColor(tu.voltage) }}
                  >
                    {tu.voltage}
                  </span>
                </div>
              </div>
              <div className="card-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(tu.status) }}
                ></span>
                <span className="status-text">{tu.status}</span>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Заявитель:</span>
                <span className="value">{tu.applicantName}</span>
              </div>
              <div className="info-row">
                <span className="label">Адрес:</span>
                <span className="value">{tu.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Мощность:</span>
                <span className="value">{tu.power}</span>
              </div>
              <div className="info-row">
                <span className="label">Этап:</span>
                <span className="value">{tu.stage}</span>
              </div>
              <div className="info-row">
                <span className="label">Срок:</span>
                <span className="value deadline">{tu.deadline}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Прогресс проверки</span>
                <span className="progress-percentage">{tu.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${tu.progress}%`,
                    backgroundColor: getStatusColor(tu.status)
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
      {selectedTu && (
        <div className="tu-details">
          <div className="details-header">
            <h2>Детали ТУ {selectedTu.applicationNumber}</h2>
            <button 
              className="close-btn"
              onClick={() => setSelectedTu(null)}
            >
              ✕
            </button>
          </div>

          <div className="details-content">
            <div className="details-section">
              <h3>📋 Документы</h3>
              <div className="documents-list">
                {selectedTu.documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span 
                        className="document-status"
                        style={{ color: getStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <div className="document-actions">
                      <select 
                        value={doc.status}
                        onChange={(e) => handleDocumentStatusChange(
                          selectedTu.id, 
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
                {selectedTu.comments.map(comment => (
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
                  onClick={() => handleAddComment(selectedTu.id)}
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

export default HighVoltageTuCheck;