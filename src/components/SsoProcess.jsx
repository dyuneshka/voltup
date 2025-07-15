import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTechnicalCondition, startSsoProcess } from '../redux/slices/technicalSlice';
import '../styles/sso-process.scss';

const SsoProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [step, setStep] = useState('prepareNotification');
  const [ssoData, setSsoData] = useState({
    notification: {
      deliveryType: 'Электронная почта',
      sendDate: '',
      text: { documentType: 'Запрос в ССО', description: '' },
      signatories: [{ id: 1, name: '', position: '' }],
      recipient: '',
    },
    application: {
      files: [],
      status: 'Черновик',
    },
    response: {
      status: 'Ожидание',
      contractType: '',
      contractDetails: { number: '', date: '' },
      comments: '',
    },
  });

  useEffect(() => {
    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
    if (tc && tc.requiresSso && !tc.ssoProcessStarted) {
      dispatch(startSsoProcess({ id: tc.id, ssoProcessStarted: true }));
      setStep('prepareNotification');
    } else if (tc && tc.ssoProcessStarted) {
      setStep(tc.ssoStep || 'prepareNotification');
      setSsoData(prev => ({
        ...prev,
        ...(tc.ssoData || {}),
      }));
    }
  }, [appId, technicalConditions, dispatch]);

  const handleSignatoryChange = (idx, field, value) => {
    setSsoData(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        signatories: prev.notification.signatories.map((s, i) => i === idx ? { ...s, [field]: value } : s),
      },
    }));
  };

  const handleAddSignatory = () => {
    setSsoData(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        signatories: [...prev.notification.signatories, { id: prev.notification.signatories.length + 1, name: '', position: '' }],
      },
    }));
  };

  const handleNotificationSave = () => {
    if (!ssoData.notification.sendDate || !ssoData.notification.recipient) {
      alert('Заполните дату отправки и адресата!');
      return;
    }
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: ssoData, ssoStep: 'sendApplication' }));
    setStep('sendApplication');
  };

  const handleApplicationSave = () => {
    const mockFiles = ['sso_request_001.pdf', 'sso_request_002.jpg'];
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: { ...ssoData, application: { ...ssoData.application, files: mockFiles, status: 'Отправлено' } }, ssoStep: 'sendNotification' }));
    setStep('sendNotification');
  };

  const handleNotificationConfirm = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: ssoData, ssoStep: 'receiveResponse' }));
    setStep('receiveResponse');
  };

  const handleResponseAction = (action) => {
    if (action === 'contractReceived') {
      setSsoData(prev => ({
        ...prev,
        response: { ...prev.response, status: 'Договор получен', contractType: 'Договор присоединения', contractDetails: { number: 'SSO-2025-001', date: '21.06.2025' } },
      }));
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: ssoData, ssoStep: 'registerContract' }));
      setStep('registerContract');
    } else if (action === 'commentsReceived') {
      setSsoData(prev => ({
        ...prev,
        response: { ...prev.response, status: 'Есть замечания', comments: 'Требуется уточнение мощности' },
      }));
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: ssoData, ssoStep: 'fixComments' }));
      setStep('fixComments');
    }
  };

  const handleFixComments = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: ssoData, ssoStep: 'sendApplication' }));
    setStep('sendApplication');
  };

  const handleRegisterContract = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, ssoData: { ...ssoData, response: { ...ssoData.response, status: 'Зарегистрировано' } }, ssoStep: 'completed' }));
    setStep('completed');
    navigate('/review');
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="sso-process">
      <h2> Уведомление в ССО для заявки #{appId}</h2>
      {step === 'prepareNotification' && (
        <div className="notification-step">
          <h3>Подготовить уведомление о запросе в ССО</h3>
          <div className="form">
            <select
              value={ssoData.notification.deliveryType}
              onChange={(e) => setSsoData(prev => ({ ...prev, notification: { ...prev.notification, deliveryType: e.target.value } }))}
            >
              <option value="Электронная почта">Электронная почта</option>
              <option value="Курьер">Курьер</option>
            </select>
            <input
              type="text"
              value={ssoData.notification.sendDate}
              onChange={(e) => setSsoData(prev => ({ ...prev, notification: { ...prev.notification, sendDate: e.target.value } }))}
              placeholder="Дата отправки (например, 21.06.2025)"
            />
            <select
              value={ssoData.notification.text.documentType}
              onChange={(e) => setSsoData(prev => ({ ...prev, notification: { ...prev.notification, text: { ...prev.notification.text, documentType: e.target.value } } }))}
            >
              <option value="Запрос в ССО">Запрос в ССО</option>
              <option value="Уточнение условий">Уточнение условий</option>
            </select>
            <input
              type="text"
              value={ssoData.notification.text.description}
              onChange={(e) => setSsoData(prev => ({ ...prev, notification: { ...prev.notification, text: { ...prev.notification.text, description: e.target.value } } }))}
              placeholder="Описание проблемы"
            />
            <h4>Подписывающие лица</h4>
            {ssoData.notification.signatories.map((sign, idx) => (
              <div key={sign.id} className="signatory-row">
                <input
                  type="text"
                  value={sign.name}
                  onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value)}
                  placeholder="ФИО"
                />
                <input
                  type="text"
                  value={sign.position}
                  onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value)}
                  placeholder="Должность"
                />
              </div>
            ))}
            <button onClick={handleAddSignatory} className="add-button">Добавить</button>
            <input
              type="text"
              value={ssoData.notification.recipient}
              onChange={(e) => setSsoData(prev => ({ ...prev, notification: { ...prev.notification, recipient: e.target.value } }))}
              placeholder="Адресат (например, ССО-ООО Энергия)"
            />
            <button onClick={handleNotificationSave} className="save-button">Записать</button>
            <button onClick={() => setStep('sendApplication')} className="next-button">Письмо направлено</button>
          </div>
        </div>
      )}
      {step === 'sendApplication' && (
        <div className="application-step">
          <h3>Подготовить и отправить заявку в ССО</h3>
          <div className="form">
            <p>Прикрепленные файлы: {ssoData.application.files.join(', ') || 'Нет файлов'}</p>
            <button onClick={handleApplicationSave} className="save-button">Заявка направлена</button>
          </div>
        </div>
      )}
      {step === 'sendNotification' && (
        <div className="notification-confirm-step">
          <h3>Отправить уведомление о запросе в ССО заявителю</h3>
          <button onClick={handleNotificationConfirm} className="next-button">Уведомление направлено</button>
        </div>
      )}
      {step === 'receiveResponse' && (
        <div className="response-step">
          <h3>Получить ответ от ССО</h3>
          <button onClick={() => handleResponseAction('contractReceived')} className="next-button">Получен договор ССО</button>
          <button onClick={() => handleResponseAction('commentsReceived')} className="next-button">Есть замечания</button>
          <p>Статус: {ssoData.response.status}</p>
          {ssoData.response.comments && <p>Замечания: {ssoData.response.comments}</p>}
        </div>
      )}
      {step === 'fixComments' && (
        <div className="fix-comments-step">
          <h3>Устранить замечания по заявке в ССО</h3>
          <button onClick={handleFixComments} className="next-button">Выполнено</button>
        </div>
      )}
      {step === 'registerContract' && (
        <div className="register-contract-step">
          <h3>Регистрация договора с ССО</h3>
          <div className="form">
            <select
              value={ssoData.response.contractType}
              onChange={(e) => setSsoData(prev => ({ ...prev, response: { ...prev.response, contractType: e.target.value } }))}
            >
              <option value="Договор присоединения">Договор присоединения</option>
              <option value="Доп. соглашение">Доп. соглашение</option>
            </select>
            <input
              type="text"
              value={ssoData.response.contractDetails.number}
              onChange={(e) => setSsoData(prev => ({ ...prev, response: { ...prev.response, contractDetails: { ...prev.response.contractDetails, number: e.target.value } } }))}
              placeholder="Номер договора"
            />
            <input
              type="text"
              value={ssoData.response.contractDetails.date}
              onChange={(e) => setSsoData(prev => ({ ...prev, response: { ...prev.response, contractDetails: { ...prev.response.contractDetails, date: e.target.value } } }))}
              placeholder="Дата договора"
            />
            <button onClick={handleRegisterContract} className="save-button">Провести и закрыть</button>
            <button onClick={() => setStep('completed')} className="next-button">Договор зарегистрирован</button>
          </div>
        </div>
      )}
      {step === 'completed' && (
        <div className="completed-step">
          <h3>Бизнес-процесс ССО завершен</h3>
          <button onClick={() => navigate('/review')} className="back-button">Вернуться к списку</button>
        </div>
      )}
    </div>
  );
};

export default SsoProcess;