import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyApplication } from '../redux/slices/applicationSlice';
import '../styles/employee-panel.scss';

const EmployeePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { applications } = useSelector(state => state.application);

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [localApps, setLocalApps] = useState([]);
  const [activeTab, setActiveTab] = useState('stages');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);
  
  // Состояния для пошагового режима
  const [wizardStep, setWizardStep] = useState(1); // 1-этапы, 2-АССО, 3-объект, 4-проверка данных, 5-проверка документов
  const [wizardAppId, setWizardAppId] = useState(null);
  const [stepValidation, setStepValidation] = useState({
    stages: false,
    asso: false,
    object: false
  });

  // Эмуляционные данные для дашборда
  const [dashboardData] = useState({
    stats: {
      totalApplications: 156,
      pendingReview: 23,
      inProgress: 45,
      completedToday: 8,
      averageProcessingTime: 12.5
    },
    notifications: [
      { id: 1, type: 'urgent', message: 'Срочная заявка требует внимания', time: '5 мин назад' },
      { id: 2, type: 'info', message: 'Новые документы загружены', time: '15 мин назад' },
      { id: 3, type: 'success', message: 'ОТР готово к отправке', time: '1 час назад' },
      { id: 4, type: 'warning', message: 'Истекает срок проверки заявки №45', time: '2 часа назад' }
    ],
    recentActivity: [
      { id: 1, action: 'Создан ОТР', applicant: 'ООО "ЭнергоСтрой"', time: '10:30' },
      { id: 2, action: 'Проверена заявка', applicant: 'ИП Иванов', time: '09:15' },
      { id: 3, action: 'Отправлены ТУ', applicant: 'ЗАО "МеталлСервис"', time: '08:45' },
      { id: 4, action: 'Принята заявка', applicant: 'ООО "СтройИнвест"', time: '08:20' }
    ],
    tasks: [
      { id: 1, title: 'Проверить заявку №156', priority: 'high', deadline: 'Сегодня 18:00' },
      { id: 2, title: 'Подготовить ОТР для ООО "ЭнергоСтрой"', priority: 'medium', deadline: 'Завтра 12:00' },
      { id: 3, title: 'Согласовать ТУ с РЭС', priority: 'low', deadline: 'Четверг 15:00' }
    ],
    performance: {
      daily: 85,
      weekly: 92,
      monthly: 88
    }
  });

  const networkStructureCatalog = [
    { id: 1, chain: ['Точка 1', 'Подстанция A', 'ЛЭП 10 кВ'] },
    { id: 2, chain: ['Точка 2', 'Подстанция B', 'ЛЭП 20 кВ'] },
  ];

  useEffect(() => {
    // Если в Redux нет заявок, создаем тестовые данные
    if (applications && applications.length === 0) {
      const mockApplications = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        applicant: `Компания ${index + 1}`,
        power: '',
        stages: [],
        designDeadline: '',
        operationDeadline: '',
        assoData: {
          applicantType: 'Юридическое лицо',
          requestType: 'Электронная заявка',
          submissionMethod: 'Онлайн',
          requestTypeAso: 'Техническое присоединение',
          connectionType: 'Новая точка',
          loadNature: 'Промышленная',
          notificationMethod: 'Электронная почта',
          documentDelivery: 'Электронно',
        },
        objectData: {
          energyDevice: '',
          yearOfOperation: '',
          objectType: 'Промышленный объект',
          locationType: 'Городская местность',
          cadastralNumber: '',
        },
        status: 'Заполнена',
        files: [`doc${index + 1}.pdf`, `photo${index + 1}.jpg`],
        otr: null,
      }));
      mockApplications.forEach(app => dispatch(verifyApplication(app)));
    }
    
    // Обновляем локальное состояние при изменении данных в Redux
    setLocalApps(applications || []);
  }, [applications, dispatch]);

  // Фильтрация и поиск заявок
  const filteredApplications = (localApps || []).filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = (app.applicant || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Компонент дашборда
  const DashboardView = () => (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <h2>Панель управления сотрудника</h2>
        <div className="user-welcome">
          <span className="welcome-text">Добро пожаловать, {user?.name || 'Сотрудник'}!</span>
          <span className="current-time">{new Date().toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Статистика */}
        <div className="stats-section">
          <h3>📊 Статистика</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <span className="stat-number">{dashboardData.stats.totalApplications}</span>
                <span className="stat-label">Всего заявок</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-number">{dashboardData.stats.pendingReview}</span>
                <span className="stat-label">Ожидают проверки</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <span className="stat-number">{dashboardData.stats.inProgress}</span>
                <span className="stat-label">В работе</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-number">{dashboardData.stats.completedToday}</span>
                <span className="stat-label">Завершено сегодня</span>
              </div>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="notifications-section">
          <h3>🔔 Уведомления</h3>
          <div className="notifications-list">
            {dashboardData.notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.type}`}>
                <div className="notification-icon">
                  {notification.type === 'urgent' && '🚨'}
                  {notification.type === 'info' && 'ℹ️'}
                  {notification.type === 'success' && '✅'}
                  {notification.type === 'warning' && '⚠️'}
                </div>
                <div className="notification-content">
                  <span className="notification-message">{notification.message}</span>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Активные задачи */}
        <div className="tasks-section">
          <h3>📝 Активные задачи</h3>
          <div className="tasks-list">
            {dashboardData.tasks.map(task => (
              <div key={task.id} className={`task-item ${task.priority}`}>
                <div className="task-content">
                  <span className="task-title">{task.title}</span>
                  <span className="task-deadline">⏰ {task.deadline}</span>
                </div>
                <div className={`priority-badge ${task.priority}`}>
                  {task.priority === 'high' && 'Высокий'}
                  {task.priority === 'medium' && 'Средний'}
                  {task.priority === 'low' && 'Низкий'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Производительность */}
        <div className="performance-section">
          <h3>📈 Производительность</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <span className="performance-label">Дневная</span>
              <span className="performance-value">{dashboardData.performance.daily}%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Недельная</span>
              <span className="performance-value">{dashboardData.performance.weekly}%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Месячная</span>
              <span className="performance-value">{dashboardData.performance.monthly}%</span>
            </div>
          </div>
        </div>

        {/* Последняя активность */}
        <div className="activity-section">
          <h3>🕒 Последняя активность</h3>
          <div className="activity-list">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-applicant">{activity.applicant}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="quick-actions-section">
          <h3>⚡ Быстрые действия</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => setShowDashboard(false)}>
              <span className="action-icon">📋</span>
              <span className="action-text">Просмотр заявок</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">➕</span>
              <span className="action-text">Новая заявка</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📊</span>
              <span className="action-text">Отчеты</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">⚙️</span>
              <span className="action-text">Настройки</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleFillStages = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.power || isNaN(app.power) || app.power <= 0) {
      alert('Мощность должна быть положительным числом!');
      return;
    }
    
    // Определяем длительность этапов в зависимости от мощности
    const power = parseFloat(app.power);
    let technicalExaminationDays = 30;
    let coordinationDays = 45;
    
    if (power > 150) {
      technicalExaminationDays = 45;
      coordinationDays = 60;
    } else if (power > 100) {
      technicalExaminationDays = 35;
      coordinationDays = 50;
    }
    
    const newStages = [
      { 
        id: 1, 
        name: 'Сбор и проверка документации', 
        duration: '30 дней',
        description: 'Проверка комплектности и корректности представленных документов',
        status: 'pending'
      },
      { 
        id: 2, 
        name: 'Техническая экспертиза', 
        duration: `${technicalExaminationDays} дней`,
        description: `Техническая экспертиза проекта (мощность: ${app.power} кВт)`,
        status: 'pending'
      },
      { 
        id: 3, 
        name: 'Согласование технических условий', 
        duration: `${coordinationDays} дней`,
        description: 'Согласование ТУ с заявителем и смежными организациями',
        status: 'pending'
      },
      { 
        id: 4, 
        name: 'Проектирование', 
        duration: app.designDeadline ? `${app.designDeadline} дней` : 'Не указано',
        description: 'Разработка проектной документации',
        status: 'pending'
      },
      { 
        id: 5, 
        name: 'Строительно-монтажные работы', 
        duration: '90 дней',
        description: 'Выполнение строительно-монтажных работ',
        status: 'pending'
      },
      { 
        id: 6, 
        name: 'Ввод в эксплуатацию', 
        duration: app.operationDeadline ? `${app.operationDeadline} дней` : 'Не указано',
        description: 'Приемка работ и ввод объекта в эксплуатацию',
        status: 'pending'
      },
    ];
    
    updateApp(appId, { stages: newStages });
    alert('Этапы ТП успешно заполнены на основе указанной мощности!');
  };

  const handlePowerChange = (appId, value) => {
    if (value < 0) {
      alert('Мощность не может быть отрицательной!');
      return;
    }
    updateApp(appId, { power: value });
  };

  const handleDesignDeadlineChange = (appId, value) => {
    updateApp(appId, { designDeadline: value });
  };

  const handleOperationDeadlineChange = (appId, value) => {
    updateApp(appId, { operationDeadline: value });
  };

  const handleAssoChange = (appId, e) => {
    const app = localApps.find(a => a.id === appId);
    if (app && app.assoData) {
      updateApp(appId, { assoData: { ...app.assoData, [e.target.name]: e.target.value } });
    }
  };

  const handleObjectChange = (appId, e) => {
    const app = localApps.find(a => a.id === appId);
    if (app && app.objectData) {
      updateApp(appId, { objectData: { ...app.objectData, [e.target.name]: e.target.value } });
    }
  };

  const handleSubmitForReview = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.power || !app.stages || !app.stages.length || !app.assoData || !app.objectData.energyDevice) {
      alert('Заполните мощность, этапы, данные АССО и энергопринимающее устройство!');
      return;
    }
    updateApp(appId, { status: 'На проверке' });
    setReviewMode(true);
  };

  const handleAcceptTask = (appId) => {
    updateApp(appId, { status: 'Принята к исполнению' });
    setReviewMode(false);
    dispatch(verifyApplication({ id: appId, status: 'Принята к исполнению' }));
  };

  const handleCreateOtr = (appId) => {
    updateApp(appId, { status: 'Подготовка ОТР' });
    setSelectedAppId(appId);
  };

  const handleFillNetworkStructure = (appId, structureId) => {
    const selectedStructure = networkStructureCatalog.find(s => s.id === structureId)?.chain || [];
    const app = localApps.find(a => a.id === appId);
    if (app) {
      updateApp(appId, { otr: { ...app.otr, networkStructure: selectedStructure } });
    }
  };

  const handleAddSoActivity = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (app) {
      updateApp(appId, {
        otr: {
          ...app.otr,
          soActivities: [
            ...(app.otr?.soActivities || []),
            { id: (app.otr?.soActivities?.length || 0) + 1, section: '', voltage: '', length: '' },
          ],
        },
      });
    }
  };

  const handleUpdateSoActivity = (appId, idx, field, value) => {
    const app = localApps.find(a => a.id === appId);
    if (app && app.otr && app.otr.soActivities) {
      const newActivities = app.otr.soActivities.map((act, i) =>
        i === idx ? { ...act, [field]: value } : act
      );
      updateApp(appId, { otr: { ...app.otr, soActivities: newActivities } });
    }
  };

  const handleAddApplicantActivity = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (app) {
      updateApp(appId, {
        otr: {
          ...app.otr,
          applicantActivities: [
            ...(app.otr?.applicantActivities || []),
            { id: (app.otr?.applicantActivities?.length || 0) + 1, section: '' },
          ],
        },
      });
    }
  };

  const handleUpdateApplicantActivity = (appId, idx, value) => {
    const app = localApps.find(a => a.id === appId);
    if (app && app.otr && app.otr.applicantActivities) {
      const newActivities = app.otr.applicantActivities.map((act, i) =>
        i === idx ? { ...act, section: value } : act
      );
      updateApp(appId, { otr: { ...app.otr, applicantActivities: newActivities } });
    }
  };

  const handleAddSignatory = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (app) {
      updateApp(appId, {
        otr: {
          ...app.otr,
          signatories: [
            ...(app.otr?.signatories || []),
            { id: (app.otr?.signatories?.length || 0) + 1, name: '', position: '' },
          ],
        },
      });
    }
  };

  const handleUpdateSignatory = (appId, idx, field, value) => {
    const app = localApps.find(a => a.id === appId);
    if (app && app.otr && app.otr.signatories) {
      const newSignatories = app.otr.signatories.map((sign, i) =>
        i === idx ? { ...sign, [field]: value } : sign
      );
      updateApp(appId, { otr: { ...app.otr, signatories: newSignatories } });
    }
  };

  const handleSaveOtr = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.otr?.tariffType || !app.otr?.distance || !app.otr?.networkStructure?.length) {
      alert('Заполните тип тарифа, удаленность и структуру сети!');
      return;
    }
    const updatedOtr = { ...app.otr, status: 'Готово' };
    updateApp(appId, { status: 'ОТР готово', otr: updatedOtr });
    dispatch(verifyApplication({ id: appId, status: 'ОТР готово', otr: updatedOtr }));
  };

  const updateApp = (appId, updates) => {
    // Обновляем данные в Redux
    dispatch(verifyApplication({ id: appId, ...updates }));
    
    // Локальное обновление для мгновенного отображения
    const updatedApps = localApps.map(a => a.id === appId ? { ...a, ...updates } : a);
    setLocalApps(updatedApps);
  };

  // Функции валидации для пошагового режима
  const validateStagesStep = (app) => {
    return app.power && 
           app.power > 0 && 
           app.stages && 
           app.stages.length > 0 &&
           app.designDeadline &&
           app.operationDeadline;
  };

  const validateAssoStep = (app) => {
    return app.assoData &&
           app.assoData.applicantType &&
           app.assoData.requestType &&
           app.assoData.submissionMethod &&
           app.assoData.requestTypeAso &&
           app.assoData.connectionType &&
           app.assoData.loadNature &&
           app.assoData.notificationMethod &&
           app.assoData.documentDelivery;
  };

  const validateObjectStep = (app) => {
    return app.objectData &&
           app.objectData.energyDevice &&
           app.objectData.yearOfOperation &&
           app.objectData.objectType &&
           app.objectData.locationType &&
           app.objectData.cadastralNumber;
  };

  const validateCurrentStep = () => {
    if (!wizardAppId) return false;
    const app = localApps.find(a => a.id === wizardAppId);
    if (!app) return false;

    switch (wizardStep) {
      case 1: return validateStagesStep(app);
      case 2: return validateAssoStep(app);
      case 3: return validateObjectStep(app);
      default: return false;
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setWizardStep(prev => prev + 1);
      setStepValidation(prev => ({
        ...prev,
        [wizardStep === 1 ? 'stages' : wizardStep === 2 ? 'asso' : 'object']: true
      }));
    }
  };

  const goToPreviousStep = () => {
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  const startWizard = (appId) => {
    setWizardAppId(appId);
    setWizardStep(1);
    setStepValidation({ stages: false, asso: false, object: false });
  };

  const finishWizard = () => {
    if (wizardAppId) {
      updateApp(wizardAppId, { status: 'На проверке' });
      setWizardAppId(null);
      setWizardStep(1);
      setStepValidation({ stages: false, asso: false, object: false });
    }
  };

  // Компонент Wizard для пошагового режима
  const renderWizard = () => {
    if (!wizardAppId) return null;
    
    const app = localApps.find(a => a.id === wizardAppId);
    if (!app) return null;

    const getStepTitle = () => {
      switch (wizardStep) {
        case 1: return 'Шаг 1: Заполнение этапов ТП';
        case 2: return 'Шаг 2: Данные АССО';
        case 3: return 'Шаг 3: Информация об объекте';
        case 4: return 'Шаг 4: Проверка данных';
        case 5: return 'Шаг 5: Проверка документов';
        default: return '';
      }
    };

    const getStepDescription = () => {
      switch (wizardStep) {
        case 1: return 'Введите мощность объекта и заполните этапы технического присоединения';
        case 2: return 'Заполните информацию по заявке (данные АССО)';
        case 3: return 'Заполните информацию по объекту ТП';
        case 4: return 'Проверьте все данные заявки';
        case 5: return 'Проверьте комплект документов и подтвердите заявку';
        default: return '';
      }
    };

    return (
      <div className="wizard-overlay">
        <div className="wizard-container">
          <div className="wizard-header">
            <h2>{getStepTitle()}</h2>
            <p>{getStepDescription()}</p>
            <div className="wizard-progress">
              <div className={`progress-step ${wizardStep >= 1 ? 'active' : ''}`}>1</div>
              <div className={`progress-line ${wizardStep >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${wizardStep >= 2 ? 'active' : ''}`}>2</div>
              <div className={`progress-line ${wizardStep >= 3 ? 'active' : ''}`}></div>
              <div className={`progress-step ${wizardStep >= 3 ? 'active' : ''}`}>3</div>
              <div className={`progress-line ${wizardStep >= 4 ? 'active' : ''}`}></div>
              <div className={`progress-step ${wizardStep >= 4 ? 'active' : ''}`}>4</div>
              <div className={`progress-line ${wizardStep >= 5 ? 'active' : ''}`}></div>
              <div className={`progress-step ${wizardStep >= 5 ? 'active' : ''}`}>5</div>
            </div>
          </div>

          <div className="wizard-content">
            {wizardStep === 1 && (
              <div className="wizard-step">
                <h3>Этапы технического присоединения</h3>
                <div className="form-group">
                  <label>Мощность объекта (кВт):</label>
                  <input
                    type="number"
                    value={app.power || ''}
                    onChange={(e) => handlePowerChange(app.id, e.target.value)}
                    placeholder="Введите мощность"
                  />
                </div>
                <button 
                  onClick={() => handleFillStages(app.id)}
                  disabled={!app.power || app.power <= 0}
                  className="btn-fill-stages"
                >
                  Заполнить этапы
                </button>
                
                {app.stages && app.stages.length > 0 && (
                  <div className="stages-section">
                    <h4>Этапы ТП:</h4>
                    {app.stages.map(stage => (
                      <div key={stage.id} className="stage-item">
                        <span>{stage.name}</span>
                        <span>{stage.duration}</span>
                      </div>
                    ))}
                    
                    <div className="manual-deadlines">
                      <div className="form-group">
                        <label>Срок проектирования (дней):</label>
                        <input
                          type="number"
                          value={app.designDeadline || ''}
                          onChange={(e) => handleDesignDeadlineChange(app.id, e.target.value)}
                          placeholder="Введите срок"
                        />
                      </div>
                      <div className="form-group">
                        <label>Срок ввода в эксплуатацию (дней):</label>
                        <input
                          type="number"
                          value={app.operationDeadline || ''}
                          onChange={(e) => handleOperationDeadlineChange(app.id, e.target.value)}
                          placeholder="Введите срок"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div className="wizard-step">
                <h3>Данные АССО</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Тип заявителя:</label>
                    <select
                      name="applicantType"
                      value={app.assoData?.applicantType || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите тип</option>
                      <option value="Юридическое лицо">Юридическое лицо</option>
                      <option value="Физическое лицо">Физическое лицо</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Тип электронного обращения:</label>
                    <select
                      name="requestType"
                      value={app.assoData?.requestType || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите тип</option>
                      <option value="Электронная заявка">Электронная заявка</option>
                      <option value="Бумажная заявка">Бумажная заявка</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Способ подачи заявки:</label>
                    <select
                      name="submissionMethod"
                      value={app.assoData?.submissionMethod || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите способ</option>
                      <option value="Онлайн">Онлайн</option>
                      <option value="Лично">Лично</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Вид заявки:</label>
                    <select
                      name="requestTypeAso"
                      value={app.assoData?.requestTypeAso || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите вид</option>
                      <option value="Техническое присоединение">Техническое присоединение</option>
                      <option value="Переоформление">Переоформление</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Тип присоединения:</label>
                    <select
                      name="connectionType"
                      value={app.assoData?.connectionType || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите тип</option>
                      <option value="Новая точка">Новая точка</option>
                      <option value="Существующая точка">Существующая точка</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Характер нагрузки:</label>
                    <select
                      name="loadNature"
                      value={app.assoData?.loadNature || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите характер</option>
                      <option value="Промышленная">Промышленная</option>
                      <option value="Бытовая">Бытовая</option>
                      <option value="Смешанная">Смешанная</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Способ уведомления:</label>
                    <select
                      name="notificationMethod"
                      value={app.assoData?.notificationMethod || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите способ</option>
                      <option value="Электронная почта">Электронная почта</option>
                      <option value="СМС">СМС</option>
                      <option value="Почта">Почта</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Способ передачи документов:</label>
                    <select
                      name="documentDelivery"
                      value={app.assoData?.documentDelivery || ''}
                      onChange={(e) => handleAssoChange(app.id, e)}
                    >
                      <option value="">Выберите способ</option>
                      <option value="Электронно">Электронно</option>
                      <option value="Лично">Лично</option>
                      <option value="Почта">Почта</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="wizard-step">
                <h3>Информация об объекте ТП</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Энергопринимающее устройство:</label>
                    <input
                      type="text"
                      name="energyDevice"
                      value={app.objectData?.energyDevice || ''}
                      onChange={(e) => handleObjectChange(app.id, e)}
                      placeholder="Введите устройство"
                    />
                  </div>
                  <div className="form-group">
                    <label>Год ввода в эксплуатацию:</label>
                    <input
                      type="number"
                      name="yearOfOperation"
                      value={app.objectData?.yearOfOperation || ''}
                      onChange={(e) => handleObjectChange(app.id, e)}
                      placeholder="Введите год"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div className="form-group">
                    <label>Тип объекта:</label>
                    <select
                      name="objectType"
                      value={app.objectData?.objectType || ''}
                      onChange={(e) => handleObjectChange(app.id, e)}
                    >
                      <option value="">Выберите тип</option>
                      <option value="Промышленный объект">Промышленный объект</option>
                      <option value="Жилой объект">Жилой объект</option>
                      <option value="Коммерческий объект">Коммерческий объект</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Тип местности:</label>
                    <select
                      name="locationType"
                      value={app.objectData?.locationType || ''}
                      onChange={(e) => handleObjectChange(app.id, e)}
                    >
                      <option value="">Выберите тип</option>
                      <option value="Городская местность">Городская местность</option>
                      <option value="Сельская местность">Сельская местность</option>
                      <option value="Промышленная зона">Промышленная зона</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Кадастровый номер:</label>
                    <input
                      type="text"
                      name="cadastralNumber"
                      value={app.objectData?.cadastralNumber || ''}
                      onChange={(e) => handleObjectChange(app.id, e)}
                      placeholder="Введите кадастровый номер"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="wizard-step">
                <h3>Проверка данных</h3>
                <div className="review-section">
                  <h4>Проверьте все заполненные данные:</h4>
                  
                  <div className="review-item">
                    <h5>Этапы ТП:</h5>
                    <p>Мощность: {app.power} кВт</p>
                    <p>Количество этапов: {app.stages?.length || 0}</p>
                    <p>Срок проектирования: {app.designDeadline} дней</p>
                    <p>Срок ввода в эксплуатацию: {app.operationDeadline} дней</p>
                  </div>

                  <div className="review-item">
                    <h5>Данные АССО:</h5>
                    <p>Тип заявителя: {app.assoData?.applicantType}</p>
                    <p>Тип обращения: {app.assoData?.requestType}</p>
                    <p>Вид заявки: {app.assoData?.requestTypeAso}</p>
                    <p>Тип присоединения: {app.assoData?.connectionType}</p>
                  </div>

                  <div className="review-item">
                    <h5>Объект ТП:</h5>
                    <p>Энергопринимающее устройство: {app.objectData?.energyDevice}</p>
                    <p>Год ввода: {app.objectData?.yearOfOperation}</p>
                    <p>Тип объекта: {app.objectData?.objectType}</p>
                    <p>Тип местности: {app.objectData?.locationType}</p>
                    <p>Кадастровый номер: {app.objectData?.cadastralNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="wizard-step">
                <h3>Проверка документов</h3>
                <div className="documents-section">
                  <h4>Документы для проверки</h4>
                  <div className="documents-list">
                    {(app.files || []).length === 0 ? (
                      <p>Нет прикреплённых файлов</p>
                    ) : (
                      (app.files || []).map((doc, index) => (
                        <div key={index} className="document-item">
                          <span className="material-icons">description</span>
                          <span>{doc}</span>
                          <button className="download-btn">
                            <span className="material-icons">download</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="verification-actions">
                  <button 
                    onClick={() => { updateApp(app.id, { status: 'Принята к исполнению' }); finishWizard(); }}
                    className="verify-confirm-btn"
                    disabled={(app.files || []).length === 0}
                  >
                    Подтвердить комплект документов
                  </button>
                  <button 
                    onClick={() => { updateApp(app.id, { status: 'Отклонена' }); finishWizard(); }}
                    className="verify-reject-btn"
                  >
                    Отклонить заявку
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="wizard-actions">
            {wizardStep > 1 && (
              <button onClick={goToPreviousStep} className="btn-previous">
                Назад
              </button>
            )}
            {wizardStep < 5 ? (
              <button 
                onClick={goToNextStep} 
                className="btn-next"
                disabled={!validateCurrentStep()}
              >
                Далее
              </button>
            ) : (
              <button 
                onClick={finishWizard} 
                className="btn-finish"
                disabled={!validateCurrentStep()}
              >
                Отправить на проверку
              </button>
            )}
            <button 
              onClick={() => { setWizardAppId(null); setWizardStep(1); }} 
              className="btn-cancel"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const selectedApp = localApps.find(a => a.id === selectedAppId);

  return (
    <div className="employee-panel">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">work</span>
            Панель сотрудника
          </h1>
          <p className="page-subtitle">
            Управление заявками на техническое присоединение
          </p>
        </div>
        
        {/* Навигация */}
        <div className="navigation-tabs">
          <button 
            className={`nav-tab ${showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(true)}
          >
            <span className="material-icons">dashboard</span>
            Дашборд
          </button>
          <button 
            className={`nav-tab ${!showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(false)}
          >
            <span className="material-icons">list_alt</span>
            Заявки
            <span className="applications-count">({filteredApplications.length})</span>
          </button>
        </div>
      </div>

      {/* Показываем дашборд или список заявок */}
      {showDashboard ? (
        <DashboardView />
      ) : (
        <>
          {/* Фильтры и поиск */}
          <div className="filters-section">
            <div className="search-box">
              <span className="material-icons">search</span>
              <input
                type="text"
                placeholder="Поиск по заявителю..."
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
                Все ({(localApps || []).length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Заполнена' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Заполнена')}
              >
                Заполнены ({(localApps || []).filter(app => app.status === 'Заполнена').length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'На проверке' ? 'active' : ''}`}
                onClick={() => setFilterStatus('На проверке')}
              >
                На проверке ({(localApps || []).filter(app => app.status === 'На проверке').length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Проверена' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Проверена')}
              >
                Проверены ({(localApps || []).filter(app => app.status === 'Проверена').length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Отклонена' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Отклонена')}
              >
                Отклонены ({(localApps || []).filter(app => app.status === 'Отклонена').length})
              </button>
            </div>
          </div>

          <div className="page-content">
            {/* Список заявок */}
            <div className="applications-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="material-icons">list_alt</span>
                  Список заявок
                </h2>
                <div className="section-actions">
                  <button className="action-btn secondary">
                    <span className="material-icons">add</span>
                    Новая заявка
                  </button>
                  <button className="action-btn secondary">
                    <span className="material-icons">download</span>
                    Экспорт
                  </button>
                </div>
              </div>
              
              <div className="applications-grid">
                {filteredApplications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Заявки не найдены</h3>
                    <p>Попробуйте изменить фильтры или поисковый запрос</p>
                  </div>
                ) : (
                  filteredApplications.map(app => (
                    <div key={app.id} className="application-card">
                      <div className="card-header">
                        <div className="applicant-info">
                          <h3>{app.applicant}</h3>
                          <span className={`status-badge ${(app.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                            {app.status || 'Не определен'}
                          </span>
                        </div>
                        <div className="card-actions">
                          {app.status === 'Заполнена' && (
                            <button onClick={() => setSelectedAppId(app.id)} className="action-btn primary">
                              <span className="material-icons">edit</span>
                              Редактировать
                            </button>
                          )}
                          {app.status === 'Проверена' && (
                            <button onClick={() => navigate(`/otr/${app.id}`)} className="action-btn success">
                              <span className="material-icons">assignment</span>
                              Создать ОТР
                            </button>
                          )}
                          {app.status === 'На проверке' && (
                            <button onClick={() => { setSelectedAppId(app.id); setReviewMode(true); }} className="action-btn warning">
                              <span className="material-icons">visibility</span>
                              Проверить
                            </button>
                          )}
                          {app.status === 'Принята к исполнению' && (
                            <button onClick={() => setSelectedAppId(app.id)} className="action-btn info">
                              <span className="material-icons">assignment</span>
                              Подготовить ОТР
                            </button>
                          )}
                          {app.status === 'Подготовка ОТР' && (
                            <button onClick={() => setSelectedAppId(app.id)} className="action-btn info">
                              <span className="material-icons">edit_note</span>
                              Продолжить ОТР
                            </button>
                          )}
                          {app.status === 'ОТР готово' && (
                            <button onClick={() => navigate(`/technical/${app.id}`)} className="action-btn success">
                              <span className="material-icons">arrow_forward</span>
                              Перейти к ТУ
                            </button>
                          )}
                          {app.status === 'ТУ создано' && (
                            <button onClick={() => navigate(`/tu-approval-res/${app.id}`)} className="action-btn success">
                              <span className="material-icons">approval</span>
                              Согласование в РЭС
                            </button>
                          )}
                          {app.status === 'Согласовано в РЭС' && (
                            <button onClick={() => navigate(`/tu-approval-ia/${app.id}`)} className="action-btn success">
                              <span className="material-icons">verified</span>
                              Утверждение ИА
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Дополнительная информация о заявке */}
                      <div className="card-details">
                        <div className="detail-item">
                          <span className="detail-label">Мощность:</span>
                          <span className="detail-value">{app.power || 'Не указана'} кВт</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Этапы:</span>
                          <span className="detail-value">{app.stages?.length || 0} из 6</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Документы:</span>
                          <span className="detail-value">{app.files?.length || 0} файлов</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Форма редактирования заявки */}
      {selectedApp && !reviewMode && selectedApp.status === 'Заполнена' && (
        <div className="edit-form-section">
          <div className="form-header">
            <h2 className="form-title">
              <span className="material-icons">edit</span>
              Редактирование заявки: {selectedApp.applicant}
            </h2>
            
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'stages' ? 'active' : ''}`}
                onClick={() => setActiveTab('stages')}
              >
                <span className="material-icons">timeline</span>
                Этапы ТП
              </button>
              <button 
                className={`tab-btn ${activeTab === 'asso' ? 'active' : ''}`}
                onClick={() => setActiveTab('asso')}
              >
                <span className="material-icons">description</span>
                Данные АССО
              </button>
              <button 
                className={`tab-btn ${activeTab === 'object' ? 'active' : ''}`}
                onClick={() => setActiveTab('object')}
              >
                <span className="material-icons">business</span>
                Информация по объекту
              </button>
              <button 
                className={`tab-btn ${activeTab === 'print' ? 'active' : ''}`}
                onClick={() => setActiveTab('print')}
              >
                <span className="material-icons">print</span>
                Печатные формы
              </button>
              <button 
                className={`tab-btn ${activeTab === 'power' ? 'active' : ''}`}
                onClick={() => setActiveTab('power')}
              >
                <span className="material-icons">calculate</span>
                Расчет мощности
              </button>
            </div>
          </div>

          <div className="form-content">
            {activeTab === 'stages' && (
              <div className="stages-tab">
                <div className="form-card">
                  <div className="card-header">
                    <h3>
                      <span className="material-icons">timeline</span>
                      Этапы технического присоединения
                    </h3>
                  </div>
                  
                  <div className="power-input-section">
                    <div className="input-group">
                      <label>Мощность объекта (кВт)</label>
                      <input
                        type="number"
                        value={selectedApp.power}
                        onChange={(e) => handlePowerChange(selectedApp.id, e.target.value)}
                        placeholder="Введите мощность"
                        className="form-input"
                      />
                    </div>
                    <button onClick={() => handleFillStages(selectedApp.id)} className="fill-stages-btn">
                      <span className="material-icons">auto_fix_high</span>
                      Заполнить этапы
                    </button>
                  </div>

                  <div className="deadlines-section">
                    <div className="input-group">
                      <label>Срок проектирования (дни)</label>
                      <input
                        type="text"
                        value={selectedApp.designDeadline}
                        onChange={(e) => handleDesignDeadlineChange(selectedApp.id, e.target.value)}
                        placeholder="Введите срок проектирования"
                        className="form-input"
                      />
                    </div>
                    <div className="input-group">
                      <label>Срок ввода в эксплуатацию (дни)</label>
                      <input
                        type="text"
                        value={selectedApp.operationDeadline}
                        onChange={(e) => handleOperationDeadlineChange(selectedApp.id, e.target.value)}
                        placeholder="Введите срок ввода"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="stages-list">
                    <h4>Этапы выполнения:</h4>
                    <div className="stages-grid">
                      {(selectedApp.stages || []).map(stage => (
                        <div key={stage.id} className={`stage-card ${stage.status || 'pending'}`}>
                          <div className="stage-icon">
                            <span className="material-icons">
                              {stage.status === 'completed' ? 'check_circle' : 
                               stage.status === 'in_progress' ? 'pending' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <div className="stage-content">
                            <h5>{stage.name}</h5>
                            <p className="stage-duration">{stage.duration}</p>
                            {stage.description && (
                              <p className="stage-description">{stage.description}</p>
                            )}
                          </div>
                          <div className="stage-status">
                            <span className={`status-indicator ${stage.status || 'pending'}`}>
                              {stage.status === 'completed' ? 'Завершен' : 
                               stage.status === 'in_progress' ? 'В работе' : 'Ожидает'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'asso' && (
              <div className="asso-tab">
                <div className="form-card">
                  <div className="card-header">
                    <h3>
                      <span className="material-icons">description</span>
                      Данные АССО
                    </h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Тип заявителя</label>
                      <select 
                        name="applicantType" 
                        value={selectedApp.assoData?.applicantType || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Юридическое лицо">Юридическое лицо</option>
                        <option value="Физическое лицо">Физическое лицо</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Тип заявки</label>
                      <select 
                        name="requestType" 
                        value={selectedApp.assoData?.requestType || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Электронная заявка">Электронная заявка</option>
                        <option value="Бумажная заявка">Бумажная заявка</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Способ подачи</label>
                      <select 
                        name="submissionMethod" 
                        value={selectedApp.assoData?.submissionMethod || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Онлайн">Онлайн</option>
                        <option value="Лично">Лично</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Тип заявки АССО</label>
                      <select 
                        name="requestTypeAso" 
                        value={selectedApp.assoData?.requestTypeAso || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Техническое присоединение">Техническое присоединение</option>
                        <option value="Изменение условий">Изменение условий</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Тип присоединения</label>
                      <select 
                        name="connectionType" 
                        value={selectedApp.assoData?.connectionType || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Новая точка">Новая точка</option>
                        <option value="Расширение">Расширение</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Характер нагрузки</label>
                      <select 
                        name="loadNature" 
                        value={selectedApp.assoData?.loadNature || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Промышленная">Промышленная</option>
                        <option value="Бытовая">Бытовая</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Способ уведомления</label>
                      <select 
                        name="notificationMethod" 
                        value={selectedApp.assoData?.notificationMethod || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Электронная почта">Электронная почта</option>
                        <option value="SMS">SMS</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Доставка документов</label>
                      <select 
                        name="documentDelivery" 
                        value={selectedApp.assoData?.documentDelivery || ''} 
                        onChange={(e) => handleAssoChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Электронно">Электронно</option>
                        <option value="Бумажно">Бумажно</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'object' && (
              <div className="object-tab">
                <div className="form-card">
                  <div className="card-header">
                    <h3>
                      <span className="material-icons">business</span>
                      Информация по объекту ТП
                    </h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Энергопринимающее устройство</label>
                      <input
                        type="text"
                        name="energyDevice"
                        value={selectedApp.objectData?.energyDevice || ''}
                        onChange={(e) => handleObjectChange(selectedApp.id, e)}
                        placeholder="Введите название устройства"
                        className="form-input"
                      />
                    </div>

                    <div className="input-group">
                      <label>Год ввода в эксплуатацию</label>
                      <input
                        type="text"
                        name="yearOfOperation"
                        value={selectedApp.objectData?.yearOfOperation || ''}
                        onChange={(e) => handleObjectChange(selectedApp.id, e)}
                        placeholder="Введите год"
                        className="form-input"
                      />
                    </div>

                    <div className="input-group">
                      <label>Тип объекта</label>
                      <select 
                        name="objectType" 
                        value={selectedApp.objectData?.objectType || ''} 
                        onChange={(e) => handleObjectChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Промышленный объект">Промышленный объект</option>
                        <option value="Жилой объект">Жилой объект</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Тип местности</label>
                      <select 
                        name="locationType" 
                        value={selectedApp.objectData?.locationType || ''} 
                        onChange={(e) => handleObjectChange(selectedApp.id, e)}
                        className="form-select"
                      >
                        <option value="Городская местность">Городская местность</option>
                        <option value="Сельская местность">Сельская местность</option>
                      </select>
                    </div>

                    <div className="input-group full-width">
                      <label>Кадастровый номер</label>
                      <input
                        type="text"
                        name="cadastralNumber"
                        value={selectedApp.objectData?.cadastralNumber || ''}
                        onChange={(e) => handleObjectChange(selectedApp.id, e)}
                        placeholder="Введите кадастровый номер"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'print' && (
              <div className="print-tab">
                <div className="form-card">
                  <div className="card-header">
                    <h3>
                      <span className="material-icons">print</span>
                      Печатные формы для заявки: {selectedApp.applicant}
                    </h3>
                  </div>
                  
                  <div className="print-forms-section">
                    <div className="forms-overview">
                      <h4>Доступные печатные формы:</h4>
                      <div className="forms-grid">
                        <div className="form-item">
                          <div className="form-icon">
                            <span className="material-icons">description</span>
                          </div>
                          <div className="form-info">
                            <h5>Заявка на технологическое присоединение</h5>
                            <p>Основная заявка на ТП</p>
                          </div>
                          <div className="form-actions">
                            <button className="btn-preview" title="Предварительный просмотр">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="btn-print" title="Печать">
                              <span className="material-icons">print</span>
                            </button>
                            <button className="btn-save" title="Сохранить">
                              <span className="material-icons">save</span>
                            </button>
                          </div>
                        </div>

                        <div className="form-item">
                          <div className="form-icon">
                            <span className="material-icons">assignment</span>
                          </div>
                          <div className="form-info">
                            <h5>Технические условия</h5>
                            <p>ТУ на технологическое присоединение</p>
                          </div>
                          <div className="form-actions">
                            <button className="btn-preview" title="Предварительный просмотр">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="btn-print" title="Печать">
                              <span className="material-icons">print</span>
                            </button>
                            <button className="btn-save" title="Сохранить">
                              <span className="material-icons">save</span>
                            </button>
                          </div>
                        </div>

                        <div className="form-item">
                          <div className="form-icon">
                            <span className="material-icons">receipt</span>
                          </div>
                          <div className="form-info">
                            <h5>Договор на технологическое присоединение</h5>
                            <p>Типовая форма договора</p>
                          </div>
                          <div className="form-actions">
                            <button className="btn-preview" title="Предварительный просмотр">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="btn-print" title="Печать">
                              <span className="material-icons">print</span>
                            </button>
                            <button className="btn-save" title="Сохранить">
                              <span className="material-icons">save</span>
                            </button>
                          </div>
                        </div>

                        <div className="form-item">
                          <div className="form-icon">
                            <span className="material-icons">check_circle</span>
                          </div>
                          <div className="form-info">
                            <h5>Акт о выполнении ТУ</h5>
                            <p>Акт о выполнении технических условий</p>
                          </div>
                          <div className="form-actions">
                            <button className="btn-preview" title="Предварительный просмотр">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="btn-print" title="Печать">
                              <span className="material-icons">print</span>
                            </button>
                            <button className="btn-save" title="Сохранить">
                              <span className="material-icons">save</span>
                            </button>
                          </div>
                        </div>

                        <div className="form-item">
                          <div className="form-icon">
                            <span className="material-icons">payment</span>
                          </div>
                          <div className="form-info">
                            <h5>Счет на оплату</h5>
                            <p>Счет на оплату услуг ТП</p>
                          </div>
                          <div className="form-actions">
                            <button className="btn-preview" title="Предварительный просмотр">
                              <span className="material-icons">visibility</span>
                            </button>
                            <button className="btn-print" title="Печать">
                              <span className="material-icons">print</span>
                            </button>
                            <button className="btn-save" title="Сохранить">
                              <span className="material-icons">save</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="print-settings">
                      <h4>Настройки печати:</h4>
                      <div className="settings-grid">
                        <div className="setting-group">
                          <label>Количество копий:</label>
                          <input type="number" min="1" max="10" defaultValue="1" className="form-input" />
                        </div>
                        <div className="setting-group">
                          <label>Формат:</label>
                          <select className="form-select">
                            <option value="A4">A4</option>
                            <option value="A3">A3</option>
                          </select>
                        </div>
                        <div className="setting-group">
                          <label>Ориентация:</label>
                          <select className="form-select">
                            <option value="portrait">Книжная</option>
                            <option value="landscape">Альбомная</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="print-actions">
                      <button className="btn-print-all">
                        <span className="material-icons">print</span>
                        Печать всех форм
                      </button>
                      <button className="btn-save-all">
                        <span className="material-icons">save</span>
                        Сохранить все в PDF
                      </button>
                      <button className="btn-email-all">
                        <span className="material-icons">email</span>
                        Отправить по email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'power' && (
              <div className="power-tab">
                <div className="form-card">
                  <div className="card-header">
                    <h3>
                      <span className="material-icons">calculate</span>
                      Расчет профицита/дефицита мощности для заявки: {selectedApp.applicant}
                    </h3>
                  </div>
                  
                  <div className="power-calculation-section">
                    <div className="calculation-overview">
                      <h4>Функционал расчета мощности:</h4>
                      <div className="calculation-features">
                        <div className="feature-item">
                          <div className="feature-icon">
                            <span className="material-icons">monitoring</span>
                          </div>
                          <div className="feature-info">
                            <h5>Измерение режима дня</h5>
                            <p>Внесение данных по замерам максимальной нагрузки на силовые трансформаторы</p>
                          </div>
                          <div className="feature-actions">
                            <button className="btn-create" onClick={() => navigate('/power-calculation')}>
                              <span className="material-icons">add</span>
                              Создать
                            </button>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-icon">
                            <span className="material-icons">analytics</span>
                          </div>
                          <div className="feature-info">
                            <h5>Расчет загрузки центров питания</h5>
                            <p>Расчет профицита или дефицита мощности центров питания</p>
                          </div>
                          <div className="feature-actions">
                            <button className="btn-create" onClick={() => navigate('/power-calculation')}>
                              <span className="material-icons">add</span>
                              Создать
                            </button>
                          </div>
                        </div>

                        <div className="feature-item">
                          <div className="feature-icon">
                            <span className="material-icons">assessment</span>
                          </div>
                          <div className="feature-info">
                            <h5>Отчеты по загрузке</h5>
                            <p>Формирование отчетов о загрузке и дефиците мощности центров питания</p>
                          </div>
                          <div className="feature-actions">
                            <button className="btn-generate" onClick={() => navigate('/power-calculation')}>
                              <span className="material-icons">description</span>
                              Сформировать
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="power-status-section">
                      <h4>Текущий статус мощности:</h4>
                      <div className="power-status-grid">
                        <div className="status-card">
                          <div className="status-header">
                            <span className="material-icons">power</span>
                            <h5>Заявленная мощность</h5>
                          </div>
                          <div className="status-value">
                            <span className="power-value">{selectedApp.power || 0}</span>
                            <span className="power-unit">кВт</span>
                          </div>
                        </div>

                        <div className="status-card">
                          <div className="status-header">
                            <span className="material-icons">trending_up</span>
                            <h5>Доступная мощность</h5>
                          </div>
                          <div className="status-value">
                            <span className="power-value">150</span>
                            <span className="power-unit">кВт</span>
                          </div>
                        </div>

                        <div className="status-card">
                          <div className="status-header">
                            <span className="material-icons">balance</span>
                            <h5>Баланс мощности</h5>
                          </div>
                          <div className="status-value">
                            <span className={`power-value ${(selectedApp.power || 0) <= 150 ? 'positive' : 'negative'}`}>
                              {150 - (selectedApp.power || 0)}
                            </span>
                            <span className="power-unit">кВт</span>
                          </div>
                        </div>

                        <div className="status-card">
                          <div className="status-header">
                            <span className="material-icons">info</span>
                            <h5>Статус</h5>
                          </div>
                          <div className="status-value">
                            <span className={`status-badge ${(selectedApp.power || 0) <= 150 ? 'available' : 'deficit'}`}>
                              {(selectedApp.power || 0) <= 150 ? 'Доступно' : 'Дефицит'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="power-actions">
                      <button className="btn-calculate-all" onClick={() => navigate('/power-calculation')}>
                        <span className="material-icons">calculate</span>
                        Перейти к расчету мощности
                      </button>
                      <button className="btn-report" onClick={() => navigate('/power-calculation')}>
                        <span className="material-icons">assessment</span>
                        Сформировать отчет
                      </button>
                      <button className="btn-schedule" onClick={() => navigate('/power-calculation')}>
                        <span className="material-icons">schedule</span>
                        Настроить регламентные задания
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <div className="action-buttons">
              <button 
                onClick={() => setSelectedAppId(null)} 
                className="btn-cancel"
              >
                <span className="material-icons">close</span>
                Отмена
              </button>
              <button 
                onClick={() => handleSubmitForReview(selectedApp.id)} 
                className="btn-submit"
                disabled={!selectedApp.power || !selectedApp.stages || selectedApp.stages.length === 0}
              >
                <span className="material-icons">send</span>
                Отправить на проверку
              </button>
            </div>
            <div className="completion-status">
              <div className="status-item">
                <span className={`status-icon ${selectedApp.power ? 'completed' : 'pending'}`}>
                  <span className="material-icons">
                    {selectedApp.power ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </span>
                <span className="status-text">Мощность заполнена</span>
              </div>
              <div className="status-item">
                <span className={`status-icon ${selectedApp.stages && selectedApp.stages.length > 0 ? 'completed' : 'pending'}`}>
                  <span className="material-icons">
                    {selectedApp.stages && selectedApp.stages.length > 0 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </span>
                <span className="status-text">Этапы ТП заполнены</span>
              </div>
              <div className="status-item">
                <span className={`status-icon ${selectedApp.assoData ? 'completed' : 'pending'}`}>
                  <span className="material-icons">
                    {selectedApp.assoData ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </span>
                <span className="status-text">Данные АССО заполнены</span>
              </div>
              <div className="status-item">
                <span className={`status-icon ${selectedApp.objectData?.energyDevice ? 'completed' : 'pending'}`}>
                  <span className="material-icons">
                    {selectedApp.objectData?.energyDevice ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </span>
                <span className="status-text">Информация по объекту заполнена</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Проверка заявки */}
      {selectedApp && reviewMode && selectedApp.status === 'На проверке' && (
        <div className="review-section">
          <div className="form-card">
            <div className="card-header">
              <h3>
                <span className="material-icons">visibility</span>
                Проверка заявки: {selectedApp.applicant}
              </h3>
            </div>
            
            <div className="review-content">
              <div className="review-grid">
                <div className="review-section">
                  <h4>
                    <span className="material-icons">info</span>
                    Реквизиты
                  </h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Мощность:</span>
                      <span className="value">{selectedApp.power} кВт</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Срок проектирования:</span>
                      <span className="value">{selectedApp.designDeadline}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Срок ввода:</span>
                      <span className="value">{selectedApp.operationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>
                    <span className="material-icons">description</span>
                    Данные АССО
                  </h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Тип заявителя:</span>
                      <span className="value">{selectedApp.assoData?.applicantType}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>
                    <span className="material-icons">business</span>
                    Информация по объекту
                  </h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Энергопринимающее устройство:</span>
                      <span className="value">{selectedApp.objectData?.energyDevice}</span>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h4>
                    <span className="material-icons">attach_file</span>
                    Прикрепленные файлы
                  </h4>
                  <div className="files-list">
                    {(selectedApp.files || []).map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="material-icons">description</span>
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="review-actions">
              <button onClick={() => handleAcceptTask(selectedApp.id)} className="accept-btn">
                <span className="material-icons">check_circle</span>
                Принять к исполнению
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Подготовка ОТР */}
      {selectedApp && (selectedApp.status === 'Принята к исполнению' || selectedApp.status === 'Подготовка ОТР') && (
        <div className="otr-section">
          <div className="form-card">
            <div className="card-header">
              <h3>
                <span className="material-icons">assignment</span>
                Подготовка ОТР: {selectedApp.applicant}
              </h3>
            </div>
            
            <div className="otr-content">
              <div className="otr-form-grid">
                <div className="input-group">
                  <label>Тип тарифа</label>
                  <select
                    name="tariffType"
                    value={selectedApp.otr?.tariffType || 'Тариф 1'}
                    onChange={(e) => updateApp(selectedApp.id, { otr: { ...selectedApp.otr, tariffType: e.target.value } })}
                    className="form-select"
                  >
                    <option value="Тариф 1">Тариф 1</option>
                    <option value="Тариф 2">Тариф 2</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Удаленность объекта (км)</label>
                  <input
                    type="text"
                    name="distance"
                    value={selectedApp.otr?.distance || ''}
                    onChange={(e) => updateApp(selectedApp.id, { otr: { ...selectedApp.otr, distance: e.target.value } })}
                    placeholder="Введите удаленность"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="network-structure-section">
                <h4>
                  <span className="material-icons">account_tree</span>
                  Структура сети точек присоединения
                </h4>
                <div className="structure-controls">
                  <select 
                    onChange={(e) => handleFillNetworkStructure(selectedApp.id, parseInt(e.target.value))}
                    className="form-select"
                  >
                    <option value="">Выберите структуру</option>
                    {networkStructureCatalog.map(struct => (
                      <option key={struct.id} value={struct.id}>{struct.chain[0]}</option>
                    ))}
                  </select>
                  <button onClick={() => handleFillNetworkStructure(selectedApp.id, networkStructureCatalog[0].id)} className="fill-btn">
                    <span className="material-icons">auto_fix_high</span>
                    Заполнить
                  </button>
                </div>
                <div className="structure-list">
                  {(selectedApp.otr?.networkStructure || []).map((item, idx) => (
                    <div key={idx} className="structure-item">
                      <span className="material-icons">fiber_manual_record</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activities-section">
                <h4>
                  <span className="material-icons">engineering</span>
                  Мероприятия, выполняемые СО
                </h4>
                <button onClick={() => handleAddSoActivity(selectedApp.id)} className="add-btn">
                  <span className="material-icons">add</span>
                  Добавить мероприятие
                </button>
                <div className="activities-list">
                  {(selectedApp.otr?.soActivities || []).map((act, idx) => (
                    <div key={act.id} className="activity-card">
                      <div className="activity-inputs">
                        <input
                          type="text"
                          value={act.section}
                          onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'section', e.target.value)}
                          placeholder="Раздел ТУ"
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={act.voltage}
                          onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'voltage', e.target.value)}
                          placeholder="Напряжение"
                          className="form-input"
                        />
                        <input
                          type="text"
                          value={act.length}
                          onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'length', e.target.value)}
                          placeholder="Протяженность"
                          className="form-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activities-section">
                <h4>
                  <span className="material-icons">person</span>
                  Мероприятия, выполняемые заявителем
                </h4>
                <button onClick={() => handleAddApplicantActivity(selectedApp.id)} className="add-btn">
                  <span className="material-icons">add</span>
                  Добавить мероприятие
                </button>
                <div className="activities-list">
                  {(selectedApp.otr?.applicantActivities || []).map((act, idx) => (
                    <div key={act.id} className="activity-card">
                      <input
                        type="text"
                        value={act.section}
                        onChange={(e) => handleUpdateApplicantActivity(selectedApp.id, idx, e.target.value)}
                        placeholder="Раздел ТУ"
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="signatories-section">
                <h4>
                  <span className="material-icons">how_to_reg</span>
                  Подписывающие лица
                </h4>
                <button onClick={() => handleAddSignatory(selectedApp.id)} className="add-btn">
                  <span className="material-icons">add</span>
                  Добавить подписанта
                </button>
                <div className="signatories-list">
                  {(selectedApp.otr?.signatories || []).map((sign, idx) => (
                    <div key={sign.id} className="signatory-card">
                      <input
                        type="text"
                        value={sign.name}
                        onChange={(e) => handleUpdateSignatory(selectedApp.id, idx, 'name', e.target.value)}
                        placeholder="ФИО"
                        className="form-input"
                      />
                      <input
                        type="text"
                        value={sign.position}
                        onChange={(e) => handleUpdateSignatory(selectedApp.id, idx, 'position', e.target.value)}
                        placeholder="Должность"
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="otr-actions">
              <button onClick={() => handleSaveOtr(selectedApp.id)} className="save-otr-btn">
                <span className="material-icons">save</span>
                Создать новое предложение к ТУ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ОТР готово */}
      {selectedApp && selectedApp.status === 'ОТР готово' && (
        <div className="otr-ready-section">
          <div className="form-card">
            <div className="card-header">
              <h3>
                <span className="material-icons">check_circle</span>
                ОТР готово: {selectedApp.applicant}
              </h3>
            </div>
            
            <div className="ready-content">
              <div className="success-message">
                <span className="material-icons">celebration</span>
                <p>ОТР успешно подготовлен и готов к переходу к техническим условиям</p>
              </div>
              
              <button onClick={() => navigate(`/technical/${selectedApp.id}`)} className="continue-btn">
                <span className="material-icons">arrow_forward</span>
                Перейти к ТУ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard для пошагового режима */}
      {wizardAppId && renderWizard()}
    </div>
  );
};

export default EmployeePanel;