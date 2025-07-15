import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { approveTechnicalCondition } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/tu-approval-res.scss';

const TuApprovalRes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId)) || {
    id: Date.now(),
    applicationId: parseInt(appId),
    voltage: '10 кВ',
    status: 'На согласовании в РЭС',
    conditions: 'Технические условия на технологическое присоединение объекта мощностью 500 кВт к электрическим сетям 10 кВ',
    signatories: [
      { id: 1, name: 'Петров А.А.', position: 'Главный инженер', department: 'Технический отдел' },
      { id: 2, name: 'Иванова М.С.', position: 'Начальник отдела', department: 'Служба эксплуатации' }
    ],
    createdDate: '18.06.2025',
    deadline: '25.06.2025',
    priority: 'Высокий',
    documents: ['ТУ_заявка_001.pdf', 'Схема_подключения.dwg', 'Расчеты_мощности.xlsx'],
    otrData: {
      tariffType: 'Одноставочный',
      objectDistance: '2.5 км от ТП',
      networkStructure: ['РП-10 кВ "Западная"', 'ВЛ-10 кВ "Линия-1"', 'ТП-10/0.4 кВ "Центральная"'],
      soActivities: [
        { name: 'Строительство ВЛ-10 кВ', voltage: '10 кВ', section: 'ВЛ', length: '2.5 км' },
        { name: 'Строительство ТП-10/0.4 кВ', voltage: '10/0.4 кВ', section: 'ТП', length: '1 шт' }
      ],
      applicantActivities: [
        { name: 'Строительство ВЛ-0.4 кВ', voltage: '0.4 кВ', section: 'ВЛ', length: '0.5 км' },
        { name: 'Установка щита учета', voltage: '0.4 кВ', section: 'ЩУ', length: '1 шт' }
      ]
    }
  };

  // Убеждаемся, что все массивы существуют
  const safeTc = {
    ...tc,
    signatories: tc.signatories || [],
    documents: tc.documents || [],
    otrData: {
      ...tc.otrData,
      networkStructure: tc.otrData?.networkStructure || [],
      soActivities: tc.otrData?.soActivities || [],
      applicantActivities: tc.otrData?.applicantActivities || []
    }
  };

  useEffect(() => {
    if (safeTc.comment) {
      setComment(safeTc.comment);
    }
  }, [safeTc]);

  const handleApprove = async (status) => {
    setIsSubmitting(true);
    try {
      dispatch(approveTechnicalCondition({ id: safeTc.id, status, comment }));
      setResult(status);
      setComment('');
      
      // Если согласовано, переходим к следующему этапу
      if (status === 'Согласовано') {
        setTimeout(() => {
          navigate(`/tu-approval-ia/${appId}`);
        }, 2000);
      } else if (status === 'Требуется изменение') {
        // Запускаем заново БП "Разработка ТУ"
        setTimeout(() => {
          navigate(`/technical/${appId}`);
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

  return (
    <EmployeeLayout 
      title="Согласование и утверждение ТУ в РЭС" 
      subtitle={`Заявка #${appId} - Проверка технических условий`}
    >
      <div className="tu-approval-res">
        {/* Основная информация о ТУ */}
        <div className="tu-overview">
          <div className="overview-header">
            <div className="tu-id">
              <span className="material-icons">description</span>
              <h3>ТУ-{safeTc.id}</h3>
            </div>
            <div className={`status-badge ${getStatusClass(safeTc.status)}`}>
              <span className="material-icons">
                {safeTc.status === 'Согласовано' ? 'check_circle' : 
                 safeTc.status === 'Есть замечания' ? 'warning' : 
                 safeTc.status === 'Требуется изменение' ? 'error' : 'pending'}
              </span>
              {safeTc.status}
            </div>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">flash_on</span>
              </div>
              <div className="card-content">
                <label>Напряжение</label>
                <span className="value">{safeTc.voltage}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">schedule</span>
              </div>
              <div className="card-content">
                <label>Срок согласования</label>
                <span className="value">{safeTc.deadline}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">priority_high</span>
              </div>
              <div className="card-content">
                <label>Приоритет</label>
                <span className={`priority-badge ${getPriorityClass(safeTc.priority)}`}>
                  {safeTc.priority}
                </span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">event</span>
              </div>
              <div className="card-content">
                <label>Дата создания</label>
                <span className="value">{safeTc.createdDate}</span>
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
            <p>{safeTc.conditions}</p>
          </div>
        </div>

        {/* Данные ОТР */}
        {safeTc.otrData && (
          <div className="otr-details-section">
            <div className="section-header">
              <h4>
                <span className="material-icons">assignment</span>
                Основные технические решения (ОТР)
              </h4>
            </div>
            
            <div className="otr-grid">
              <div className="otr-card">
                <h5>Основные параметры</h5>
                <div className="otr-params">
                  <div className="param-item">
                    <label>Тип тарифа:</label>
                    <span>{safeTc.otrData.tariffType}</span>
                  </div>
                  <div className="param-item">
                    <label>Удаленность объекта:</label>
                    <span>{safeTc.otrData.objectDistance}</span>
                  </div>
                </div>
              </div>

              <div className="otr-card">
                <h5>Структура сети</h5>
                <div className="network-chain">
                  {(safeTc.otrData.networkStructure || []).map((point, idx) => (
                    <div key={idx} className="chain-item">
                      <span className="chain-number">{idx + 1}</span>
                      <span className="chain-point">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="otr-card">
                <h5>Мероприятия СО</h5>
                <div className="activities-list">
                  {(safeTc.otrData.soActivities || []).map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <span className="activity-name">{activity.name}</span>
                      <span className="activity-details">
                        {activity.section} • {activity.voltage} • {activity.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="otr-card">
                <h5>Мероприятия заявителя</h5>
                <div className="activities-list">
                  {(safeTc.otrData.applicantActivities || []).map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <span className="activity-name">{activity.name}</span>
                      <span className="activity-details">
                        {activity.section} • {activity.voltage} • {activity.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Подписывающие лица */}
        <div className="signatories-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">how_to_reg</span>
              Подписывающие лица
            </h4>
          </div>
          
          <div className="signatories-grid">
            {(safeTc.signatories || []).map((signatory) => (
              <div key={signatory.id} className="signatory-card">
                <div className="signatory-avatar">
                  <span className="material-icons">person</span>
                </div>
                <div className="signatory-info">
                  <div className="signatory-name">{signatory.name}</div>
                  <div className="signatory-position">{signatory.position}</div>
                  <div className="signatory-department">{signatory.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Прикрепленные документы */}
        <div className="documents-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">attach_file</span>
              Прикрепленные документы
            </h4>
          </div>
          
          <div className="documents-list">
            {(safeTc.documents || []).map((doc, idx) => (
              <div key={idx} className="document-item">
                <div className="document-icon">
                  <span className="material-icons">description</span>
                </div>
                <div className="document-info">
                  <div className="document-name">{doc}</div>
                  <div className="document-meta">PDF • 2.5 MB</div>
                </div>
                <button className="document-download">
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
                className={`action-btn approve ${result === 'Согласовано' ? 'selected' : ''}`}
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
                className={`action-btn with-comments ${result === 'Есть замечания' ? 'selected' : ''}`}
                disabled={isSubmitting}
              >
                <span className="material-icons">warning</span>
                <div className="btn-content">
                  <span className="btn-title">Есть замечания</span>
                  <span className="btn-subtitle">Указать замечания</span>
                </div>
              </button>

              <button 
                onClick={() => handleApprove('Требуется изменение')} 
                className={`action-btn requires-changes ${result === 'Требуется изменение' ? 'selected' : ''}`}
                disabled={isSubmitting}
              >
                <span className="material-icons">error</span>
                <div className="btn-content">
                  <span className="btn-title">Требуется изменение</span>
                  <span className="btn-subtitle">Запустить БП заново</span>
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
                 result === 'Есть замечания' ? 'warning' : 'error'}
              </span>
              <h3>Результат согласования</h3>
            </div>
            
            <div className="result-status">
              <span className="status-text">{result}</span>
              {comment && (
                <div className="result-comment">
                  <strong>Комментарий:</strong> {comment}
                </div>
              )}
            </div>

            {result === 'Согласовано' && (
              <div className="result-message">
                <p>ТУ успешно согласовано в РЭС. Переход к утверждению в ИА Филиала...</p>
              </div>
            )}

            {result === 'Есть замечания' && (
              <div className="result-message">
                <p>ТУ отправлено на доработку с замечаниями.</p>
              </div>
            )}

            {result === 'Требуется изменение' && (
              <div className="result-message">
                <p>Запуск бизнес-процесса "Разработка ТУ" заново...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default TuApprovalRes; 