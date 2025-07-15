import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { approveTechnicalCondition, createContractProcess } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/technical-approval.scss';

const TechnicalApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId)) || {
    id: Date.now(),
    applicationId: parseInt(appId),
    voltage: '10 кВ',
    status: 'На согласовании',
    conditions: 'Условия для подключения объекта на 500 кВт',
    signatories: [
      { id: 1, name: 'Петров А.А.', position: 'Главный инженер', department: 'Технический отдел' },
      { id: 2, name: 'Иванова М.С.', position: 'Начальник отдела', department: 'Служба эксплуатации' },
      { id: 3, name: 'Сидоров В.П.', position: 'Ведущий специалист', department: 'Отдел планирования' }
    ],
    createdDate: '18.06.2025',
    deadline: '25.06.2025',
    priority: 'Высокий',
    documents: ['ТУ_заявка_001.pdf', 'Схема_подключения.dwg', 'Расчеты_мощности.xlsx']
  };

  const handleApprove = async (status) => {
    setIsSubmitting(true);
    try {
      dispatch(approveTechnicalCondition({ id: tc.id, status, comment }));
      setResult(status);
      setComment('');
      setSelectedAction(null);
      
      if (status === 'Согласовано') {
        dispatch(createContractProcess({ id: tc.id, contractProcessStarted: true }));
        setTimeout(() => {
          navigate(`/contract/${appId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Ошибка при согласовании:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Согласовано': return 'approved';
      case 'Есть замечания': return 'with-comments';
      case 'Требуется изменение': return 'requires-changes';
      default: return 'pending';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Высокий': return 'high';
      case 'Средний': return 'medium';
      case 'Низкий': return 'low';
      default: return 'medium';
    }
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  // Проверяем, что tc существует и имеет необходимые свойства
  if (!tc) {
    return (
      <EmployeeLayout 
        title="Согласование и утверждение ТУ" 
        subtitle="Загрузка..."
      >
        <div className="technical-approval">
          <p>Загрузка технических условий...</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout 
      title="Согласование и утверждение ТУ" 
      subtitle={`Заявка #${appId} - Технические условия на подключение`}
    >
      <div className="technical-approval">
        {/* Основная информация о ТУ */}
        <div className="tu-overview">
          <div className="overview-header">
            <div className="tu-id">
              <span className="material-icons">description</span>
              <h3>ТУ-{tc.id}</h3>
            </div>
            <div className={`status-badge ${getStatusClass(tc.status)}`}>
              <span className="material-icons">
                {tc.status === 'Согласовано' ? 'check_circle' : 
                 tc.status === 'Есть замечания' ? 'warning' : 
                 tc.status === 'Требуется изменение' ? 'error' : 'pending'}
              </span>
              {tc.status}
            </div>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">flash_on</span>
              </div>
              <div className="card-content">
                <label>Напряжение</label>
                <span className="value">{tc.voltage}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">schedule</span>
              </div>
              <div className="card-content">
                <label>Срок согласования</label>
                <span className="value">{tc.deadline}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">priority_high</span>
              </div>
              <div className="card-content">
                <label>Приоритет</label>
                <span className={`priority-badge ${getPriorityClass(tc.priority)}`}>
                  {tc.priority}
                </span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">event</span>
              </div>
              <div className="card-content">
                <label>Дата создания</label>
                <span className="value">{tc.createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Детали технических условий */}
        <div className="tu-details-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">engineering</span>
              Технические условия
            </h4>
          </div>
          <div className="conditions-content">
            <p>{tc.conditions}</p>
          </div>
        </div>

        {/* Подписывающие лица */}
        <div className="signatories-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">people</span>
              Подписывающие лица
            </h4>
          </div>
          <div className="signatories-grid">
            {(tc.signatories || []).map(sign => (
              <div key={sign.id} className="signatory-card">
                <div className="signatory-avatar">
                  <span className="material-icons">person</span>
                </div>
                <div className="signatory-info">
                  <h5>{sign.name}</h5>
                  <p className="position">{sign.position}</p>
                  <p className="department">{sign.department}</p>
                </div>
                <div className="signature-status">
                  <span className="material-icons pending">pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Документы */}
        <div className="documents-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">folder</span>
              Прилагаемые документы
            </h4>
          </div>
          <div className="documents-list">
            {(tc.documents || []).map((doc, index) => (
              <div key={index} className="document-item">
                <div className="document-icon">
                  <span className="material-icons">
                    {doc.endsWith('.pdf') ? 'picture_as_pdf' : 
                     doc.endsWith('.dwg') ? 'architecture' : 'table_chart'}
                  </span>
                </div>
                <div className="document-info">
                  <span className="document-name">{doc}</span>
                  <span className="document-size">2.5 MB</span>
                </div>
                <button className="download-btn">
                  <span className="material-icons">download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Действия согласования */}
        {!result && (
          <div className="approval-actions-section">
            <div className="section-header">
              <h4>
                <span className="material-icons">approval</span>
                Действия по согласованию
              </h4>
            </div>
            
            <div className="comment-section">
              <label htmlFor="comment">Комментарий к решению</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Укажите замечания, комментарии или обоснование решения..."
                className="comment-textarea"
                rows={4}
              />
            </div>

            <div className="action-buttons">
              <button 
                onClick={() => handleApprove('Согласовано')} 
                className={`action-btn approve ${selectedAction === 'Согласовано' ? 'selected' : ''}`}
                disabled={isSubmitting}
              >
                <span className="material-icons">check_circle</span>
                <div className="btn-content">
                  <span className="btn-title">Согласовано</span>
                  <span className="btn-subtitle">Одобрить ТУ</span>
                </div>
              </button>

              <button 
                onClick={() => handleApprove('Есть замечания')} 
                className={`action-btn with-comments ${selectedAction === 'Есть замечания' ? 'selected' : ''}`}
                disabled={isSubmitting}
              >
                <span className="material-icons">warning</span>
                <div className="btn-content">
                  <span className="btn-title">Есть замечания</span>
                  <span className="btn-subtitle">Требуются уточнения</span>
                </div>
              </button>

              <button 
                onClick={() => handleApprove('Требуется изменение')} 
                className={`action-btn requires-changes ${selectedAction === 'Требуется изменение' ? 'selected' : ''}`}
                disabled={isSubmitting}
              >
                <span className="material-icons">edit</span>
                <div className="btn-content">
                  <span className="btn-title">Требуется изменение</span>
                  <span className="btn-subtitle">Необходима доработка</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Результат согласования */}
        {result && (
          <div className={`result-section ${getStatusClass(result)}`}>
            <div className="result-header">
              <span className="material-icons">
                {result === 'Согласовано' ? 'check_circle' : 
                 result === 'Есть замечания' ? 'warning' : 'edit'}
              </span>
              <h4>Решение принято</h4>
            </div>
            <div className="result-content">
              <p className="result-status">{result}</p>
              {comment && (
                <div className="result-comment">
                  <label>Комментарий:</label>
                  <p>{comment}</p>
                </div>
              )}
              {result === 'Согласовано' && (
                <div className="next-steps">
                  <p>Переход к процессу заключения договора...</p>
                  <div className="loading-spinner">
                    <span className="material-icons rotating">sync</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default TechnicalApproval; 