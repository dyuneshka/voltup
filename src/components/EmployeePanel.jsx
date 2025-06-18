import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/employee-panel.scss';

const EmployeePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (applications.length === 0) {
      const mockApplications = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        applicant: `Компания ${index + 1}`,
        power: Math.floor(Math.random() * 1000) + 100,
        stages: [],
        designDeadline: '',
        operationDeadline: '',
        assoData: {
          applicantType: index % 2 === 0 ? 'Юридическое лицо' : 'Физическое лицо',
          requestType: 'Электронная заявка',
          submissionMethod: 'Онлайн',
          requestTypeAso: 'Техническое присоединение',
          connectionType: 'Новая точка',
          loadNature: index % 2 === 0 ? 'Промышленная' : 'Бытовая',
          notificationMethod: 'Электронная почта',
          documentDelivery: 'Электронно',
        },
        objectData: {
          energyDevice: `Подстанция ${index + 1}`,
          yearOfOperation: `${2020 + index}`,
          objectType: 'Промышленный объект',
          locationType: 'Городская местность',
          cadastralNumber: `12:34:567890:${index + 1}`,
        },
        status: 'Заполнена',
        files: [`doc${index + 1}.pdf`, `photo${index + 1}.jpg`],
        otr: null, // Основные технические решения
      }));
      setApplications(mockApplications);
    }
  }, []);

  const handleFillStages = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app.power || isNaN(app.power) || app.power <= 0) {
      alert(`Для заявки ${app.applicant} введите корректную мощность!`);
      return;
    }
    const newStages = [
      { id: 1, name: 'Сбор документации', duration: '30 дней' },
      { id: 2, name: 'Техническая экспертиза', duration: `45 дней (мощность: ${app.power} кВт)` },
      { id: 3, name: 'Согласование', duration: '60 дней' },
      { id: 4, name: 'Срок проектирования', duration: app.designDeadline || 'Не указано' },
      { id: 5, name: 'Срок ввода в эксплуатацию', duration: app.operationDeadline || 'Не указано' },
    ];
    setApplications(applications.map(a => a.id === appId ? { ...a, stages: newStages } : a));
  };

  const handlePowerChange = (appId, value) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, power: value } : a));
  };

  const handleDesignDeadlineChange = (appId, value) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, designDeadline: value } : a));
  };

  const handleOperationDeadlineChange = (appId, value) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, operationDeadline: value } : a));
  };

  const handleAssoChange = (appId, e) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, assoData: { ...a.assoData, [e.target.name]: e.target.value } } : a));
  };

  const handleObjectChange = (appId, e) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, objectData: { ...a.objectData, [e.target.name]: e.target.value } } : a));
  };

  const handleSubmitForReview = (appId) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: 'На проверке' } : a));
    setReviewMode(true);
  };

  const handleAcceptTask = (appId) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: 'Принята к исполнению' } : a));
    setReviewMode(false);
  };

  const handleCreateOtr = (appId) => {
    const app = applications.find(a => a.id === appId);
    const mockOtr = {
      tariffType: 'Тариф 1',
      distance: `${Math.floor(Math.random() * 50)} км`,
      networkStructure: ['Точка 1', 'Подстанция A', 'ЛЭП 10 кВ'],
      soActivities: [{ id: 1, section: 'Раздел 1', voltage: '10 кВ', length: '5 км' }],
      applicantActivities: [{ id: 1, section: 'Раздел 2' }],
      signatories: [{ id: 1, name: 'Иванов И.И.', должность: 'Инженер' }],
    };
    setApplications(applications.map(a => a.id === appId ? { ...a, otr: mockOtr, status: 'ОТР подготовлено' } : a));
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const selectedApp = applications.find(a => a.id === selectedAppId);

  return (
    <div className="employee-panel">
      <h2>Панель сотрудника - Подача ТП</h2>
      <section className="applications-list">
        <h3>Список заявок</h3>
        <ul>
          {applications.map(app => (
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
                <button onClick={() => { setSelectedAppId(app.id); }} className="select-button">
                  Подготовить ОТР
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      {selectedApp && !reviewMode && selectedApp.status === 'Заполнена' && (
        <>
          <section className="tp-stages">
            <h3>Этапы технического присоединения для {selectedApp.applicant}</h3>
            <div className="power-input">
              <input
                type="number"
                value={selectedApp.power}
                onChange={(e) => handlePowerChange(selectedApp.id, e.target.value)}
                placeholder="Мощность объекта (кВт)"
                className="form-input"
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
                className="form-input"
              />
              <input
                type="text"
                value={selectedApp.operationDeadline}
                onChange={(e) => handleOperationDeadlineChange(selectedApp.id, e.target.value)}
                placeholder="Срок ввода в эксплуатацию (дни)"
                className="form-input"
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
              <select
                name="applicantType"
                value={selectedApp.assoData.applicantType}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Юридическое лицо">Юридическое лицо</option>
                <option value="Физическое лицо">Физическое лицо</option>
              </select>
              <select
                name="requestType"
                value={selectedApp.assoData.requestType}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Электронная заявка">Электронная заявка</option>
                <option value="Бумажная заявка">Бумажная заявка</option>
              </select>
              <select
                name="submissionMethod"
                value={selectedApp.assoData.submissionMethod}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Онлайн">Онлайн</option>
                <option value="Лично">Лично</option>
              </select>
              <select
                name="requestTypeAso"
                value={selectedApp.assoData.requestTypeAso}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Техническое присоединение">Техническое присоединение</option>
                <option value="Изменение условий">Изменение условий</option>
              </select>
              <select
                name="connectionType"
                value={selectedApp.assoData.connectionType}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Новая точка">Новая точка</option>
                <option value="Расширение">Расширение</option>
              </select>
              <select
                name="loadNature"
                value={selectedApp.assoData.loadNature}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Промышленная">Промышленная</option>
                <option value="Бытовая">Бытовая</option>
              </select>
              <select
                name="notificationMethod"
                value={selectedApp.assoData.notificationMethod}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Электронная почта">Электронная почта</option>
                <option value="SMS">SMS</option>
              </select>
              <select
                name="documentDelivery"
                value={selectedApp.assoData.documentDelivery}
                onChange={(e) => handleAssoChange(selectedApp.id, e)}
                className="form-input"
              >
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
                className="form-input"
              />
              <input
                type="text"
                name="yearOfOperation"
                value={selectedApp.objectData.yearOfOperation}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                placeholder="Год ввода в эксплуатацию"
                className="form-input"
              />
              <select
                name="objectType"
                value={selectedApp.objectData.objectType}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Промышленный объект">Промышленный объект</option>
                <option value="Жилой объект">Жилой объект</option>
              </select>
              <select
                name="locationType"
                value={selectedApp.objectData.locationType}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                className="form-input"
              >
                <option value="Городская местность">Городская местность</option>
                <option value="Сельская местность">Сельская местность</option>
              </select>
              <input
                type="text"
                name="cadastralNumber"
                value={selectedApp.objectData.cadastralNumber}
                onChange={(e) => handleObjectChange(selectedApp.id, e)}
                placeholder="Кадастровый номер"
                className="form-input"
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
      {selectedApp && selectedApp.status === 'Принята к исполнению' && (
        <section className="otr-preparation">
          <h3>Подготовка ОТР для {selectedApp.applicant}</h3>
          <div className="otr-form">
            <select
              name="tariffType"
              value={selectedApp.otr?.tariffType || 'Тариф 1'}
              onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, tariffType: e.target.value } } : a))}
              className="form-input"
            >
              <option value="Тариф 1">Тариф 1</option>
              <option value="Тариф 2">Тариф 2</option>
            </select>
            <input
              type="text"
              name="distance"
              value={selectedApp.otr?.distance || ''}
              onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, distance: e.target.value } } : a))}
              placeholder="Удаленность объекта (км)"
              className="form-input"
            />
            <button onClick={() => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, networkStructure: ['Точка 1', 'Подстанция A', 'ЛЭП 10 кВ'] } } : a))} className="fill-button">
              Заполнить структуру сети
            </button>
            <div>
              <h4>Мероприятия, выполняемые СО</h4>
              <button onClick={() => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, soActivities: [...(a.otr?.soActivities || []), { id: (a.otr?.soActivities?.length || 0) + 1, section: '', voltage: '', length: '' }] } } : a))} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.soActivities?.map((act, idx) => (
                <div key={act.id} className="activity-row">
                  <input
                    type="text"
                    value={act.section}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, soActivities: a.otr.soActivities.map((x, i) => i === idx ? { ...x, section: e.target.value } : x) } } : a))}
                    placeholder="Раздел ТУ"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={act.voltage}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, soActivities: a.otr.soActivities.map((x, i) => i === idx ? { ...x, voltage: e.target.value } : x) } } : a))}
                    placeholder="Напряжение"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={act.length}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, soActivities: a.otr.soActivities.map((x, i) => i === idx ? { ...x, length: e.target.value } : x) } } : a))}
                    placeholder="Протяженность"
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <div>
              <h4>Мероприятия, выполняемые заявителем</h4>
              <button onClick={() => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, applicantActivities: [...(a.otr?.applicantActivities || []), { id: (a.otr?.applicantActivities?.length || 0) + 1, section: '' }] } } : a))} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.applicantActivities?.map((act, idx) => (
                <div key={act.id} className="activity-row">
                  <input
                    type="text"
                    value={act.section}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, applicantActivities: a.otr.applicantActivities.map((x, i) => i === idx ? { ...x, section: e.target.value } : x) } } : a))}
                    placeholder="Раздел ТУ"
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <div>
              <h4>Подписывающие лица</h4>
              <button onClick={() => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, signatories: [...(a.otr?.signatories || []), { id: (a.otr?.signatories?.length || 0) + 1, name: '', position: '' }] } } : a))} className="add-button">
                Добавить
              </button>
              {selectedApp.otr?.signatories?.map((sign, idx) => (
                <div key={sign.id} className="signatory-row">
                  <input
                    type="text"
                    value={sign.name}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, signatories: a.otr.signatories.map((x, i) => i === idx ? { ...x, name: e.target.value } : x) } } : a))}
                    placeholder="ФИО"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={sign.position}
                    onChange={(e) => setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, otr: { ...a.otr, signatories: a.otr.signatories.map((x, i) => i === idx ? { ...x, position: e.target.value } : x) } } : a))}
                    placeholder="Должность"
                    className="form-input"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => handleCreateOtr(selectedApp.id)} className="create-tu-button">
              Создать новое предложение к ТУ
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default EmployeePanel;