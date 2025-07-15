import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createOtr } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/otr-preparation.scss';

const OtrPreparation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { applications } = useSelector(state => state.application);
  
  const [otrData, setOtrData] = useState({
    tariffType: '',
    objectDistance: '',
    networkStructure: [],
    soActivities: [],
    applicantActivities: [],
    signatories: [{ id: 1, name: '', position: '' }]
  });

  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [selectedNetworkPoint, setSelectedNetworkPoint] = useState('');
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [activityType, setActivityType] = useState('so'); // 'so' или 'applicant'

  // Справочник структуры сети
  const networkStructureOptions = [
    'ТП-10/0.4 кВ "Центральная"',
    'ТП-10/0.4 кВ "Северная"',
    'ТП-10/0.4 кВ "Южная"',
    'РП-10 кВ "Западная"',
    'РП-10 кВ "Восточная"',
    'ВЛ-10 кВ "Линия-1"',
    'ВЛ-10 кВ "Линия-2"',
    'КЛ-10 кВ "Кабель-1"',
    'КЛ-10 кВ "Кабель-2"'
  ];

  // Справочник мероприятий
  const activityOptions = {
    so: [
      { name: 'Строительство ВЛ-10 кВ', voltage: '10 кВ', section: 'ВЛ', length: '2.5 км' },
      { name: 'Строительство КЛ-10 кВ', voltage: '10 кВ', section: 'КЛ', length: '1.8 км' },
      { name: 'Строительство ТП-10/0.4 кВ', voltage: '10/0.4 кВ', section: 'ТП', length: '1 шт' },
      { name: 'Реконструкция РП-10 кВ', voltage: '10 кВ', section: 'РП', length: '1 шт' },
      { name: 'Установка КТП-10/0.4 кВ', voltage: '10/0.4 кВ', section: 'КТП', length: '1 шт' }
    ],
    applicant: [
      { name: 'Строительство ВЛ-0.4 кВ', voltage: '0.4 кВ', section: 'ВЛ', length: '0.5 км' },
      { name: 'Строительство КЛ-0.4 кВ', voltage: '0.4 кВ', section: 'КЛ', length: '0.3 км' },
      { name: 'Установка щита учета', voltage: '0.4 кВ', section: 'ЩУ', length: '1 шт' },
      { name: 'Монтаж счетчика', voltage: '0.4 кВ', section: 'Счетчик', length: '1 шт' }
    ]
  };

  useEffect(() => {
    const app = applications.find(a => a.id === parseInt(appId));
    if (!app) {
      navigate('/employee');
      return;
    }
  }, [appId, applications, navigate]);

  const handleSignatoryChange = (idx, field, value) => {
    setOtrData(prev => ({
      ...prev,
      signatories: prev.signatories.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  const handleAddSignatory = () => {
    setOtrData(prev => ({
      ...prev,
      signatories: [...prev.signatories, { id: prev.signatories.length + 1, name: '', position: '' }],
    }));
  };

  const handleRemoveSignatory = (idx) => {
    if (otrData.signatories.length > 1) {
      setOtrData(prev => ({
        ...prev,
        signatories: prev.signatories.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleFillNetworkStructure = () => {
    if (selectedNetworkPoint) {
      // Автоматически заполняем цепочку структуры сети
      const networkChain = generateNetworkChain(selectedNetworkPoint);
      setOtrData(prev => ({
        ...prev,
        networkStructure: networkChain
      }));
      setShowNetworkDialog(false);
      setSelectedNetworkPoint('');
    }
  };

  const generateNetworkChain = (startPoint) => {
    // Логика генерации цепочки сети на основе выбранной точки
    const chains = {
      'ТП-10/0.4 кВ "Центральная"': ['РП-10 кВ "Западная"', 'ВЛ-10 кВ "Линия-1"', 'ТП-10/0.4 кВ "Центральная"'],
      'ТП-10/0.4 кВ "Северная"': ['РП-10 кВ "Восточная"', 'ВЛ-10 кВ "Линия-2"', 'ТП-10/0.4 кВ "Северная"'],
      'ТП-10/0.4 кВ "Южная"': ['РП-10 кВ "Западная"', 'КЛ-10 кВ "Кабель-1"', 'ТП-10/0.4 кВ "Южная"'],
      'РП-10 кВ "Западная"': ['РП-10 кВ "Западная"'],
      'РП-10 кВ "Восточная"': ['РП-10 кВ "Восточная"']
    };
    return chains[startPoint] || [startPoint];
  };

  const handleAddActivity = () => {
    setShowActivityDialog(true);
  };

  const handleActivitySelect = (activity) => {
    if (activityType === 'so') {
      setOtrData(prev => ({
        ...prev,
        soActivities: [...prev.soActivities, { ...activity, id: Date.now() }]
      }));
    } else {
      setOtrData(prev => ({
        ...prev,
        applicantActivities: [...prev.applicantActivities, { ...activity, id: Date.now() }]
      }));
    }
    setShowActivityDialog(false);
  };

  const handleRemoveActivity = (type, id) => {
    if (type === 'so') {
      setOtrData(prev => ({
        ...prev,
        soActivities: prev.soActivities.filter(a => a.id !== id)
      }));
    } else {
      setOtrData(prev => ({
        ...prev,
        applicantActivities: prev.applicantActivities.filter(a => a.id !== id)
      }));
    }
  };

  const handleCreateOtr = () => {
    if (!otrData.tariffType || !otrData.objectDistance) {
      alert('Заполните обязательные поля: тип тарифа и удаленность объекта');
      return;
    }

    const newOtr = {
      id: Date.now(),
      applicationId: parseInt(appId),
      ...otrData,
      status: 'Черновик',
      createdDate: new Date().toISOString(),
      signatories: otrData.signatories.filter(s => s.name && s.position)
    };

    dispatch(createOtr(newOtr));
    alert('ОТР успешно создан!');
    navigate(`/employee`);
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const currentApp = applications.find(a => a.id === parseInt(appId));

  return (
    <EmployeeLayout 
      title="Подготовка ОТР" 
      subtitle={`Создание основных технических решений для заявки #${appId}`}
    >
      <div className="otr-preparation">
        {/* Информация о заявке */}
        {currentApp && (
          <div className="application-info">
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">
                  <span className="material-icons">description</span>
                </div>
                <div className="card-title">Информация о заявке</div>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Заявитель:</label>
                    <span>{currentApp.counterpartyName || currentApp.applicant}</span>
                  </div>
                  <div className="info-item">
                    <label>Мощность:</label>
                    <span>{currentApp.power} кВт</span>
                  </div>
                  <div className="info-item">
                    <label>Напряжение:</label>
                    <span>{currentApp.voltage}</span>
                  </div>
                  <div className="info-item">
                    <label>Адрес объекта:</label>
                    <span>{currentApp.objectAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Основные реквизиты ОТР */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">assignment</span>
            Основные реквизиты ОТР
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Тип тарифа для расчета *</label>
              <select
                value={otrData.tariffType}
                onChange={(e) => setOtrData(prev => ({ ...prev, tariffType: e.target.value }))}
                className="form-select"
                required
              >
                <option value="">Выберите тип тарифа</option>
                <option value="Одноставочный">Одноставочный</option>
                <option value="Двухставочный">Двухставочный</option>
                <option value="Многоставочный">Многоставочный</option>
                <option value="Дифференцированный">Дифференцированный</option>
              </select>
            </div>

            <div className="form-group">
              <label>Удаленность объекта *</label>
              <input
                type="text"
                value={otrData.objectDistance}
                onChange={(e) => setOtrData(prev => ({ ...prev, objectDistance: e.target.value }))}
                placeholder="Например: 2.5 км от ТП"
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Структура сети точек присоединения */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">account_tree</span>
            Структура сети точек присоединения
          </h3>
          
          <div className="network-structure">
            <button 
              onClick={() => setShowNetworkDialog(true)}
              className="fill-network-btn"
            >
              <span className="material-icons">auto_fix_high</span>
              Заполнить
            </button>
            
            {otrData.networkStructure.length > 0 && (
              <div className="network-chain">
                <h4>Цепочка структуры сети:</h4>
                <div className="chain-list">
                  {otrData.networkStructure.map((point, idx) => (
                    <div key={idx} className="chain-item">
                      <span className="chain-number">{idx + 1}</span>
                      <span className="chain-point">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Мероприятия, выполняемые сетевой организацией */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">engineering</span>
            Мероприятия, выполняемые сетевой организацией
          </h3>
          
          <button onClick={() => { setActivityType('so'); setShowActivityDialog(true); }} className="add-activity-btn">
            <span className="material-icons">add</span>
            Добавить
          </button>
          
          {otrData.soActivities.length > 0 && (
            <div className="activities-table">
              <table>
                <thead>
                  <tr>
                    <th>Мероприятие</th>
                    <th>Раздел ТУ</th>
                    <th>Напряжение</th>
                    <th>Протяженность</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {otrData.soActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.name}</td>
                      <td>{activity.section}</td>
                      <td>{activity.voltage}</td>
                      <td>{activity.length}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveActivity('so', activity.id)}
                          className="remove-btn"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Мероприятия, выполняемые заявителем */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">person</span>
            Мероприятия, выполняемые заявителем
          </h3>
          
          <button onClick={() => { setActivityType('applicant'); setShowActivityDialog(true); }} className="add-activity-btn">
            <span className="material-icons">add</span>
            Добавить
          </button>
          
          {otrData.applicantActivities.length > 0 && (
            <div className="activities-table">
              <table>
                <thead>
                  <tr>
                    <th>Мероприятие</th>
                    <th>Раздел ТУ</th>
                    <th>Напряжение</th>
                    <th>Протяженность</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {otrData.applicantActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.name}</td>
                      <td>{activity.section}</td>
                      <td>{activity.voltage}</td>
                      <td>{activity.length}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveActivity('applicant', activity.id)}
                          className="remove-btn"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Подписывающие лица */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">how_to_reg</span>
            Подписывающие лица
          </h3>
          
          <div className="signatories-list">
            {otrData.signatories.map((sign, idx) => (
              <div key={sign.id} className="signatory-row">
                <div className="input-group">
                  <label>ФИО</label>
                  <input
                    type="text"
                    value={sign.name}
                    onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value)}
                    placeholder="Введите ФИО"
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label>Должность</label>
                  <input
                    type="text"
                    value={sign.position}
                    onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value)}
                    placeholder="Введите должность"
                    className="form-input"
                  />
                </div>
                {otrData.signatories.length > 1 && (
                  <button 
                    onClick={() => handleRemoveSignatory(idx)}
                    className="remove-btn"
                    type="button"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                )}
              </div>
            ))}
            
            <button onClick={handleAddSignatory} className="add-signatory-btn">
              <span className="material-icons">add</span>
              Добавить подписывающее лицо
            </button>
          </div>
        </div>

        {/* Кнопка создания ОТР */}
        <div className="form-actions">
          <button onClick={handleCreateOtr} className="create-otr-btn">
            <span className="material-icons">create</span>
            Создать новое предложение к ТУ
          </button>
        </div>

        {/* Диалог выбора структуры сети */}
        {showNetworkDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Выбор точки присоединения</h3>
                <button onClick={() => setShowNetworkDialog(false)} className="close-btn">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Выберите точку присоединения из справочника "Структура сети":</p>
                <select
                  value={selectedNetworkPoint}
                  onChange={(e) => setSelectedNetworkPoint(e.target.value)}
                  className="form-select"
                >
                  <option value="">Выберите точку присоединения</option>
                  {networkStructureOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowNetworkDialog(false)} className="cancel-btn">
                  Отмена
                </button>
                <button onClick={handleFillNetworkStructure} className="confirm-btn">
                  Заполнить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Диалог выбора мероприятий */}
        {showActivityDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Выбор мероприятия</h3>
                <button onClick={() => setShowActivityDialog(false)} className="close-btn">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Выберите мероприятие для {activityType === 'so' ? 'сетевой организации' : 'заявителя'}:</p>
                <div className="activity-options">
                  {activityOptions[activityType].map((activity, idx) => (
                    <div 
                      key={idx} 
                      className="activity-option"
                      onClick={() => handleActivitySelect(activity)}
                    >
                      <div className="activity-name">{activity.name}</div>
                      <div className="activity-details">
                        <span>Раздел: {activity.section}</span>
                        <span>Напряжение: {activity.voltage}</span>
                        <span>Протяженность: {activity.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowActivityDialog(false)} className="cancel-btn">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default OtrPreparation; 