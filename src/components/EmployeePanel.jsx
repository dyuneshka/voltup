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
  const networkStructureCatalog = [
    { id: 1, chain: ['Точка 1', 'Подстанция A', 'ЛЭП 10 кВ'] },
    { id: 2, chain: ['Точка 2', 'Подстанция B', 'ЛЭП 20 кВ'] },
  ];

  useEffect(() => {
    if (localApps.length === 0) {
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
      setLocalApps(mockApplications);
      if (applications.length === 0) {
        mockApplications.forEach(app => dispatch(verifyApplication(app)));
      }
    } else {
      setLocalApps(applications);
    }
  }, [applications, dispatch]);

  const handleFillStages = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.power || isNaN(app.power) || app.power <= 0) {
      alert('Мощность должна быть положительным числом!');
      return;
    }
    const newStages = [
      { id: 1, name: 'Сбор документации', duration: '30 дней' },
      { id: 2, name: 'Техническая экспертиза', duration: `45 дней (мощность: ${app.power} кВт)` },
      { id: 3, name: 'Согласование', duration: '60 дней' },
      { id: 4, name: 'Срок проектирования', duration: app.designDeadline || 'Не указано' },
      { id: 5, name: 'Срок ввода в эксплуатацию', duration: app.operationDeadline || 'Не указано' },
    ];
    updateApp(appId, { stages: newStages });
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
    updateApp(appId, { assoData: { ...localApps.find(a => a.id === appId).assoData, [e.target.name]: e.target.value } });
  };

  const handleObjectChange = (appId, e) => {
    updateApp(appId, { objectData: { ...localApps.find(a => a.id === appId).objectData, [e.target.name]: e.target.value } });
  };

  const handleSubmitForReview = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.power || !app.stages.length || !app.assoData || !app.objectData.energyDevice) {
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
    updateApp(appId, { otr: { ...localApps.find(a => a.id === appId).otr, networkStructure: selectedStructure } });
  };

  const handleAddSoActivity = (appId) => {
    const app = localApps.find(a => a.id === appId);
    updateApp(appId, {
      otr: {
        ...app.otr,
        soActivities: [
          ...(app.otr?.soActivities || []),
          { id: (app.otr?.soActivities?.length || 0) + 1, section: '', voltage: '', length: '' },
        ],
      },
    });
  };

  const handleUpdateSoActivity = (appId, idx, field, value) => {
    const app = localApps.find(a => a.id === appId);
    const newActivities = app.otr.soActivities.map((act, i) =>
      i === idx ? { ...act, [field]: value } : act
    );
    updateApp(appId, { otr: { ...app.otr, soActivities: newActivities } });
  };

  const handleAddApplicantActivity = (appId) => {
    const app = localApps.find(a => a.id === appId);
    updateApp(appId, {
      otr: {
        ...app.otr,
        applicantActivities: [
          ...(app.otr?.applicantActivities || []),
          { id: (app.otr?.applicantActivities?.length || 0) + 1, section: '' },
        ],
      },
    });
  };

  const handleUpdateApplicantActivity = (appId, idx, value) => {
    const app = localApps.find(a => a.id === appId);
    const newActivities = app.otr.applicantActivities.map((act, i) =>
      i === idx ? { ...act, section: value } : act
    );
    updateApp(appId, { otr: { ...app.otr, applicantActivities: newActivities } });
  };

  const handleAddSignatory = (appId) => {
    const app = localApps.find(a => a.id === appId);
    updateApp(appId, {
      otr: {
        ...app.otr,
        signatories: [
          ...(app.otr?.signatories || []),
          { id: (app.otr?.signatories?.length || 0) + 1, name: '', position: '' },
        ],
      },
    });
  };

  const handleUpdateSignatory = (appId, idx, field, value) => {
    const app = localApps.find(a => a.id === appId);
    const newSignatories = app.otr.signatories.map((sign, i) =>
      i === idx ? { ...sign, [field]: value } : sign
    );
    updateApp(appId, { otr: { ...app.otr, signatories: newSignatories } });
  };

  const handleSaveOtr = (appId) => {
    const app = localApps.find(a => a.id === appId);
    if (!app.otr?.tariffType || !app.otr?.distance || !app.otr?.networkStructure?.length) {
      alert('Заполните тип тарифа, удаленность и структуру сети!');
      return;
    }
    updateApp(appId, { status: 'ОТР готово', otr: { ...app.otr } });
  };

  const updateApp = (appId, updates) => {
    const updatedApps = localApps.map(a => a.id === appId ? { ...a, ...updates } : a);
    setLocalApps(updatedApps);
    dispatch(verifyApplication({ id: appId, ...updates }));
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const selectedApp = localApps.find(a => a.id === selectedAppId);

  return (
    <div className="employee-panel">
      <h2>Панель сотрудника - Подача ТП</h2>
      <section className="applications-list">
        <h3>Список заявок</h3>
        <ul>
          {localApps.map(app => (
            <li key={app.id} className="application-item">
              <span>{app.applicant} - {app.status}</span>
              {app.status === 'Заполнена' && (
                <button onClick={() => setSelectedAppId(app.id)} className="select-button">
                  Редактировать
                </button>
              )}
              {app.status === 'На проверке' && (
                <button onClick={() => { setSelectedAppId(app.id); setReviewMode(true); }} className="select-button">
                  Проверить
                </button>
              )}
              {app.status === 'Принята к исполнению' && (
                <button onClick={() => setSelectedAppId(app.id)} className="select-button">
                  Подготовить ОТР
                </button>
              )}
              {app.status === 'Подготовка ОТР' && (
                <button onClick={() => setSelectedAppId(app.id)} className="select-button">
                  Продолжить ОТР
                </button>
              )}
              {app.status === 'ОТР готово' && (
                <button onClick={() => navigate(`/technical/${app.id}`)} className="select-button">
                  Перейти к ТУ
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      {selectedApp && !reviewMode && selectedApp.status === 'Заполнена' && (
        <>
          <section className="tp-stages">
            <h3>Этапы ТП для {selectedApp.applicant}</h3>
            <div className="power-input">
              <input
                type="number"
                value={selectedApp.power}
                onChange={(e) => handlePowerChange(selectedApp.id, e.target.value)}
                placeholder="Мощность объекта (кВт)"
              />
              <button onClick={() => handleFillStages(selectedApp.id)} className="fill-stages-button">
                Заполнить этапы
              </button>
            </div>
            <div className="manual-inputs">
              <input
                type="text"
                value={selectedApp.designDeadline}
                onChange={(e) => handleDesignDeadlineChange(selectedApp.id, e.target.value)}
                placeholder="Срок проектирования (дни)"
              />
              <input
                type="text"
                value={selectedApp.operationDeadline}
                onChange={(e) => handleOperationDeadlineChange(selectedApp.id, e.target.value)}
                placeholder="Срок ввода в эксплуатацию (дни)"
              />
            </div>
            <ul className="stages-list">
              {selectedApp.stages.map(stage => (
                <li key={stage.id} className="stage-item">
                  <span>{stage.name}</span>: <strong>{stage.duration}</strong>
                </li>
              ))}
            </ul>
          </section>
          <section className="asso-data">
            <h3>Данные АССО для {selectedApp.applicant}</h3>
            <div className="asso-form">
              <select name="applicantType" value={selectedApp.assoData.applicantType} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Юридическое лицо">Юридическое лицо</option>
                <option value="Физическое лицо">Физическое лицо</option>
              </select>
              <select name="requestType" value={selectedApp.assoData.requestType} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Электронная заявка">Электронная заявка</option>
                <option value="Бумажная заявка">Бумажная заявка</option>
              </select>
              <select name="submissionMethod" value={selectedApp.assoData.submissionMethod} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Онлайн">Онлайн</option>
                <option value="Лично">Лично</option>
              </select>
              <select name="requestTypeAso" value={selectedApp.assoData.requestTypeAso} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Техническое присоединение">Техническое присоединение</option>
                <option value="Изменение условий">Изменение условий</option>
              </select>
              <select name="connectionType" value={selectedApp.assoData.connectionType} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Новая точка">Новая точка</option>
                <option value="Расширение">Расширение</option>
              </select>
              <select name="loadNature" value={selectedApp.assoData.loadNature} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Промышленная">Промышленная</option>
                <option value="Бытовая">Бытовая</option>
              </select>
              <select name="notificationMethod" value={selectedApp.assoData.notificationMethod} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Электронная почта">Электронная почта</option>
                <option value="SMS">SMS</option>
              </select>
              <select name="documentDelivery" value={selectedApp.assoData.documentDelivery} onChange={(e) => handleAssoChange(selectedApp.id, e)}>
                <option value="Электронно">Электронно</option>
                <option value="Бумажно">Бумажно</option>
              </select>
            </div>
          </section>
          <section className="object-data">
            <h3>Информация по объекту ТП для {selectedApp.applicant}</h3>
            <div className="object-form">
              <input
                type="text"
                name="energyDevice"
                value={selectedApp.objectData.energyDevice}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                placeholder="Энергопринимающее устройство"
              />
              <input
                type="text"
                name="yearOfOperation"
                value={selectedApp.objectData.yearOfOperation}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                placeholder="Год ввода в эксплуатацию"
              />
              <select name="objectType" value={selectedApp.objectData.objectType} onChange={(e) => handleObjectChange(selectedApp.id, e)}>
                <option value="Промышленный объект">Промышленный объект</option>
                <option value="Жилой объект">Жилой объект</option>
              </select>
              <select name="locationType" value={selectedApp.objectData.locationType} onChange={(e) => handleObjectChange(selectedApp.id, e)}>
                <option value="Городская местность">Городская местность</option>
                <option value="Сельская местность">Сельская местность</option>
              </select>
              <input
                type="text"
                name="cadastralNumber"
                value={selectedApp.objectData.cadastralNumber}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                placeholder="Кадастровый номер"
              />
            </div>
          </section>
          <button onClick={() => handleSubmitForReview(selectedApp.id)} className="submit-review-button">
            Отправить на проверку
          </button>
        </>
      )}
      {selectedApp && reviewMode && selectedApp.status === 'На проверке' && (
        <section className="task-review">
          <h3>Проверка задачи для {selectedApp.applicant}</h3>
          <div className="task-details">
            <h4>Реквизиты</h4>
            <p>Мощность: {selectedApp.power} кВт</p>
            <p>Срок проектирования: {selectedApp.designDeadline}</p>
            <p>Срок ввода: {selectedApp.operationDeadline}</p>
            <h4>Данные АССО</h4>
            <p>Тип заявителя: {selectedApp.assoData.applicantType}</p>
            <h4>Информация по объекту</h4>
            <p>Энергопринимающее устройство: {selectedApp.objectData.energyDevice}</p>
            <h4>Прикрепленные файлы</h4>
            <ul>
              {selectedApp.files.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => handleAcceptTask(selectedApp.id)} className="accept-button">
            Принять к исполнению
          </button>
        </section>
      )}
      {selectedApp && (selectedApp.status === 'Принята к исполнению' || selectedApp.status === 'Подготовка ОТР') && (
        <section className="otr-preparation">
          <h3>Подготовка ОТР для {selectedApp.applicant}</h3>
          <div className="otr-form">
            <select
              name="tariffType"
              value={selectedApp.otr?.tariffType || 'Тариф 1'}
              onChange={(e) => updateApp(selectedApp.id, { otr: { ...selectedApp.otr, tariffType: e.target.value } })}
            >
              <option value="Тариф 1">Тариф 1</option>
              <option value="Тариф 2">Тариф 2</option>
            </select>
            <input
              type="text"
              name="distance"
              value={selectedApp.otr?.distance || ''}
              onChange={(e) => updateApp(selectedApp.id, { otr: { ...selectedApp.otr, distance: e.target.value } })}
              placeholder="Удаленность объекта (км)"
            />
            <div>
              <h4>Структура сети точек присоединения</h4>
              <select onChange={(e) => handleFillNetworkStructure(selectedApp.id, parseInt(e.target.value))}>
                <option value="">Выберите структуру</option>
                {networkStructureCatalog.map(struct => (
                  <option key={struct.id} value={struct.id}>{struct.chain[0]}</option>
                ))}
              </select>
              <button onClick={() => handleFillNetworkStructure(selectedApp.id, networkStructureCatalog[0].id)} className="fill-button">
                Заполнить
              </button>
              <ul>
                {selectedApp.otr?.networkStructure?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Мероприятия, выполняемые СО</h4>
              <button onClick={() => handleAddSoActivity(selectedApp.id)} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.soActivities?.map((act, idx) => (
                <div key={act.id} className="activity-row">
                  <input
                    type="text"
                    value={act.section}
                    onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'section', e.target.value)}
                    placeholder="Раздел ТУ"
                  />
                  <input
                    type="text"
                    value={act.voltage}
                    onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'voltage', e.target.value)}
                    placeholder="Напряжение"
                  />
                  <input
                    type="text"
                    value={act.length}
                    onChange={(e) => handleUpdateSoActivity(selectedApp.id, idx, 'length', e.target.value)}
                    placeholder="Протяженность"
                  />
                </div>
              ))}
            </div>
            <div>
              <h4>Мероприятия, выполняемые заявителем</h4>
              <button onClick={() => handleAddApplicantActivity(selectedApp.id)} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.applicantActivities?.map((act, idx) => (
                <div key={act.id} className="activity-row">
                  <input
                    type="text"
                    value={act.section}
                    onChange={(e) => handleUpdateApplicantActivity(selectedApp.id, idx, e.target.value)}
                    placeholder="Раздел ТУ"
                  />
                </div>
              ))}
            </div>
            <div>
              <h4>Подписывающие лица</h4>
              <button onClick={() => handleAddSignatory(selectedApp.id)} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.signatories?.map((sign, idx) => (
                <div key={sign.id} className="signatory-row">
                  <input
                    type="text"
                    value={sign.name}
                    onChange={(e) => handleUpdateSignatory(selectedApp.id, idx, 'name', e.target.value)}
                    placeholder="ФИО"
                  />
                  <input
                    type="text"
                    value={sign.position}
                    onChange={(e) => handleUpdateSignatory(selectedApp.id, idx, 'position', e.target.value)}
                    placeholder="Должность"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => handleSaveOtr(selectedApp.id)} className="create-tu-button">
              Создать новое предложение к ТУ
            </button>
          </div>
        </section>
      )}
      {selectedApp && selectedApp.status === 'ОТР готово' && (
        <section className="otr-ready">
          <h3>ОТР готово для {selectedApp.applicant}</h3>
          <button onClick={() => navigate(`/technical/${selectedApp.id}`)} className="select-button">
            Перейти к ТУ
          </button>
        </section>
      )}
    </div>
  );
};

export default EmployeePanel;