import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateStep, 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} from '../redux/slices/contractAmendmentSlice';
import '../styles/contract-amendment.scss';

const ContractAmendment = () => {
  const dispatch = useDispatch();
  const { amendments, filters } = useSelector(state => state.contractAmendment);
  const [selectedAmendment, setSelectedAmendment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#2196F3';
      case 'pending': return '#FF9800';
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

  const getAmendmentTypeColor = (type) => {
    switch (type) {
      case 'Изменение мощности': return '#9C27B0';
      case 'Изменение адреса': return '#2196F3';
      case 'Изменение схемы подключения': return '#FF9800';
      case 'Изменение категории надежности': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getStepIcon = (stepName) => {
    switch (stepName) {
      case 'Подача заявки': return '📝';
      case 'Проверка документов': return '📋';
      case 'Согласование условий': return '🤝';
      case 'Подписание ДС': return '✍️';
      case 'ДС вступило в силу': return '✅';
      default: return '📄';
    }
  };

  const filteredAmendments = amendments.filter(amendment => {
    if (filters.status !== 'all' && amendment.status !== filters.status) return false;
    if (filters.priority !== 'all' && amendment.priority !== filters.priority) return false;
    if (filters.amendmentType !== 'all' && amendment.amendmentType !== filters.amendmentType) return false;
    return true;
  });

  const handleStepUpdate = (amendmentId, stepId, status) => {
    dispatch(updateStep({ 
      amendmentId, 
      stepId, 
      status, 
      inspector: 'Текущий пользователь' 
    }));
  };

  const handleAddComment = (amendmentId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Текущий пользователь',
        text: newComment,
        date: new Date().toISOString().split('T')[0]
      };
      dispatch(addComment({ amendmentId, comment }));
      setNewComment('');
    }
  };

  const handleDocumentStatusChange = (amendmentId, documentId, status) => {
    dispatch(updateDocumentStatus({ amendmentId, documentId, status }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  return (
    <div className="contract-amendment">
      {/* Заголовок с градиентом */}
      <div className="amendment-header">
        <div className="header-content">
          <h1>
            <span className="icon">📄</span>
            Заключение Дополнительного Соглашения
          </h1>
          <p>Управление процессом заключения дополнительных соглашений к договорам ТП</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{amendments.length}</span>
            <span className="stat-label">Всего ДС</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {amendments.filter(a => a.status === 'Завершено').length}
            </span>
            <span className="stat-label">Завершено</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {amendments.filter(a => a.status === 'В процессе').length}
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
                <option value="В процессе">В процессе</option>
                <option value="Завершено">Завершено</option>
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
            <div className="filter-group">
              <label>Тип изменений:</label>
              <select 
                value={filters.amendmentType} 
                onChange={(e) => handleFilterChange('amendmentType', e.target.value)}
              >
                <option value="all">Все типы</option>
                <option value="Изменение мощности">Изменение мощности</option>
                <option value="Изменение адреса">Изменение адреса</option>
                <option value="Изменение схемы подключения">Изменение схемы подключения</option>
                <option value="Изменение категории надежности">Изменение категории надежности</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Список ДС */}
      <div className="amendments-grid">
        {filteredAmendments.map(amendment => (
          <div 
            key={amendment.id} 
            className={`amendment-card ${selectedAmendment?.id === amendment.id ? 'selected' : ''}`}
            onClick={() => setSelectedAmendment(amendment)}
          >
            <div className="card-header">
              <div className="card-title">
                <h3>{amendment.applicationNumber}</h3>
                <div className="badges">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(amendment.priority) }}
                  >
                    {amendment.priority}
                  </span>
                  <span 
                    className="amendment-type-badge"
                    style={{ backgroundColor: getAmendmentTypeColor(amendment.amendmentType) }}
                  >
                    {amendment.amendmentType}
                  </span>
                </div>
              </div>
              <div className="card-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(amendment.status === 'Завершено' ? 'completed' : 'in-progress') }}
                ></span>
                <span className="status-text">{amendment.status}</span>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Договор:</span>
                <span className="value">{amendment.contractNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Заявитель:</span>
                <span className="value">{amendment.applicantName}</span>
              </div>
              <div className="info-row">
                <span className="label">Адрес:</span>
                <span className="value">{amendment.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Мощность:</span>
                <span className="value">{amendment.power}</span>
              </div>
              <div className="info-row">
                <span className="label">Этап:</span>
                <span className="value">{amendment.stage}</span>
              </div>
              <div className="info-row">
                <span className="label">Срок:</span>
                <span className="value deadline">{amendment.deadline}</span>
              </div>
              <div className="info-row">
                <span className="label">Причина:</span>
                <span className="value reason">{amendment.reason}</span>
              </div>
            </div>

            {/* Прогресс этапов */}
            <div className="steps-progress">
              <div className="steps-header">
                <span>Этапы ДС</span>
                <span className="progress-percentage">{amendment.progress}%</span>
              </div>
              <div className="steps-list">
                {amendment.steps.map((step, index) => (
                  <div key={step.id} className={`step-item ${step.status}`}>
                    <div className="step-icon">
                      <span>{getStepIcon(step.name)}</span>
                      {step.status === 'completed' && <span className="check">✓</span>}
                    </div>
                    <div className="step-info">
                      <span className="step-name">{step.name}</span>
                      {step.date && <span className="step-date">{step.date}</span>}
                    </div>
                    {index < amendment.steps.length - 1 && (
                      <div className="step-connector"></div>
                    )}
                  </div>
                ))}
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
      {selectedAmendment && (
        <div className="amendment-details">
          <div className="details-header">
            <h2>Детали ДС {selectedAmendment.applicationNumber}</h2>
            <button 
              className="close-btn"
              onClick={() => setSelectedAmendment(null)}
            >
              ✕
            </button>
          </div>

          <div className="details-content">
            <div className="details-section">
              <h3>📋 Этапы выполнения</h3>
              <div className="steps-management">
                {selectedAmendment.steps.map(step => (
                  <div key={step.id} className="step-management-item">
                    <div className="step-header">
                      <div className="step-info">
                        <span className="step-icon">{getStepIcon(step.name)}</span>
                        <div>
                          <span className="step-name">{step.name}</span>
                          {step.inspector && (
                            <span className="step-inspector">Ответственный: {step.inspector}</span>
                          )}
                        </div>
                      </div>
                      <div className="step-actions">
                        <select 
                          value={step.status}
                          onChange={(e) => handleStepUpdate(
                            selectedAmendment.id, 
                            step.id, 
                            e.target.value
                          )}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="in-progress">В процессе</option>
                          <option value="completed">Завершено</option>
                        </select>
                        {step.date && <span className="step-date">{step.date}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h3>📄 Документы</h3>
              <div className="documents-list">
                {selectedAmendment.documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span 
                        className="document-status"
                        style={{ color: getStatusColor(doc.status) }}
                      >
                        {doc.status === 'approved' ? 'Утвержден' : 
                         doc.status === 'review' ? 'На рассмотрении' : 'Ожидает'}
                      </span>
                    </div>
                    <div className="document-actions">
                      <select 
                        value={doc.status}
                        onChange={(e) => handleDocumentStatusChange(
                          selectedAmendment.id, 
                          doc.id, 
                          e.target.value
                        )}
                      >
                        <option value="pending">Ожидает</option>
                        <option value="review">На рассмотрении</option>
                        <option value="approved">Утвержден</option>
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
                {selectedAmendment.comments.map(comment => (
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
                  onClick={() => handleAddComment(selectedAmendment.id)}
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

export default ContractAmendment; 