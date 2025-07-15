import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { approveTechnicalCondition } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/tu-approval-ia.scss';

const TuApprovalIa = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId)) || {
    id: Date.now(),
    applicationId: parseInt(appId),
    voltage: '10 кВ',
    status: 'Согласовано в РЭС',
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
    },
    resApproval: {
      status: 'Согласовано',
      date: '20.06.2025',
      approver: 'Сидоров В.П.',
      position: 'Начальник РЭС'
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

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      dispatch(approveTechnicalCondition({ 
        id: safeTc.id, 
        status: 'Утверждено ИА Филиала',
        iaApproval: {
          status: 'Утверждено',
          date: new Date().toLocaleDateString('ru-RU'),
          approver: user.name || 'Текущий пользователь',
          position: user.position || 'Сотрудник ИА Филиала'
        }
      }));
      setResult('Утверждено');
      
      // Переход к следующему этапу - договорному процессу
      setTimeout(() => {
        navigate(`/contract/${appId}`);
      }, 3000);
    } catch (error) {
      console.error('Ошибка при утверждении:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Утверждено ИА Филиала': return 'approved';
      case 'Согласовано в РЭС': return 'res-approved';
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
      title="Утверждение ТУ ИА Филиала" 
      subtitle={`Заявка #${appId} - Финальное утверждение технических условий`}
    >
      <div className="tu-approval-ia">
        {/* Основная информация о ТУ */}
        <div className="tu-overview">
          <div className="overview-header">
            <div className="tu-id">
              <span className="material-icons">verified</span>
              <h3>ТУ-{safeTc.id}</h3>
            </div>
            <div className={`status-badge ${getStatusClass(safeTc.status)}`}>
              <span className="material-icons">
                {safeTc.status === 'Утверждено ИА Филиала' ? 'verified' : 
                 safeTc.status === 'Согласовано в РЭС' ? 'check_circle' : 'pending'}
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
                <label>Срок утверждения</label>
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

        {/* Статус согласования в РЭС */}
        {safeTc.resApproval && (
          <div className="res-approval-section">
            <div className="section-header">
              <h4>
                <span className="material-icons">check_circle</span>
                Согласование в РЭС
              </h4>
            </div>
            
            <div className="approval-status">
              <div className="status-card approved">
                <div className="status-icon">
                  <span className="material-icons">check_circle</span>
                </div>
                <div className="status-info">
                  <div className="status-title">Согласовано</div>
                  <div className="status-details">
                    <span>Дата: {safeTc.resApproval.date}</span>
                    <span>Согласовал: {safeTc.resApproval.approver}</span>
                    <span>Должность: {safeTc.resApproval.position}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Действие утверждения */}
        {!result && (
          <div className="approval-action-section">
            <div className="section-header">
              <h4>
                <span className="material-icons">verified</span>
                Утверждение ТУ
              </h4>
            </div>
            
            <div className="approval-info">
              <div className="info-card">
                <div className="info-icon">
                  <span className="material-icons">info</span>
                </div>
                <div className="info-content">
                  <h5>Проверьте технические условия</h5>
                  <p>Убедитесь, что все реквизиты заполнены корректно и ТУ согласовано в РЭС. После утверждения ТУ будет направлено в договорный процесс.</p>
                </div>
              </div>
            </div>

            <div className="approval-button">
              <button 
                onClick={handleApprove} 
                className="approve-btn"
                disabled={isSubmitting}
              >
                <span className="material-icons">verified</span>
                <div className="btn-content">
                  <span className="btn-title">Утверждено</span>
                  <span className="btn-subtitle">Подтвердить утверждение ТУ</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Результат утверждения */}
        {result && (
          <div className="result-section approved">
            <div className="result-header">
              <span className="material-icons">verified</span>
              <h3>ТУ утверждено</h3>
            </div>
            
            <div className="result-status">
              <span className="status-text">Технические условия успешно утверждены ИА Филиала</span>
              <div className="approval-details">
                <span>Дата утверждения: {new Date().toLocaleDateString('ru-RU')}</span>
                <span>Утвердил: {user.name || 'Текущий пользователь'}</span>
                <span>Должность: {user.position || 'Сотрудник ИА Филиала'}</span>
              </div>
            </div>

            <div className="result-message">
              <p>Переход к договорному процессу...</p>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default TuApprovalIa; 