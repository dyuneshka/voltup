import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTechnicalCondition, createContractProcess } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import ContractPreparation from './ContractPreparation';
import EstimatePreparation from './EstimatePreparation';
import DiscrepancyProtocol from './DiscrepancyProtocol';
import '../styles/contract-process.scss';

const ContractProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [step, setStep] = useState('prepareContract');
  const [contractData, setContractData] = useState({
    contract: {
      number: '',
      date: '',
      signatories: [{ id: 1, name: '', position: '' }],
      files: [],
    },
    estimate: {
      files: [],
    },
    tariffLetter: {
      files: [],
    },
    tariffResponse: {
      status: 'Ожидание',
      comments: '',
    },
    tariffResolution: {
      number: '',
      parent: '',
      text: '',
      isActive: false,
      files: [],
    },
    amendedContract: {
      status: 'Черновик',
    },
    signing: {
      comments: '',
      hasRemarks: false,
    },
    mailSent: false,
    consumerAgreement: {
      hasDiscrepancies: false,
    },
    discrepancyProtocol: {
      number: '',
      date: '',
      discrepancies: [{ id: 1, text: '' }],
      signatories: [{ id: 1, name: '', position: '' }],
    },
  });

  useEffect(() => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc && tc.status === 'Согласовано' && !tc.contractProcessStarted) {
      dispatch(createContractProcess({ id: tc.id, contractProcessStarted: true }));
      setStep('prepareContract');
    } else if (tc && tc.contractProcessStarted) {
      setStep(tc.contractStep || 'prepareContract');
      setContractData(prev => ({
        ...prev,
        ...(tc.contractData || {}),
      }));
    }
  }, [appId, technicalConditions, dispatch]);

  const handleSignatoryChange = (idx, field, value, section = 'contract') => {
    setContractData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        signatories: prev[section].signatories.map((s, i) => i === idx ? { ...s, [field]: value } : s),
      },
    }));
  };

  const handleAddSignatory = (section = 'contract') => {
    setContractData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        signatories: [...prev[section].signatories, { id: prev[section].signatories.length + 1, name: '', position: '' }],
      },
    }));
  };

  const handleDiscrepancyChange = (idx, value) => {
    setContractData(prev => ({
      ...prev,
      discrepancyProtocol: {
        ...prev.discrepancyProtocol,
        discrepancies: prev.discrepancyProtocol.discrepancies.map((d, i) => i === idx ? { ...d, text: value } : d),
      },
    }));
  };

  const handleAddDiscrepancy = () => {
    setContractData(prev => ({
      ...prev,
      discrepancyProtocol: {
        ...prev.discrepancyProtocol,
        discrepancies: [...prev.discrepancyProtocol.discrepancies, { id: prev.discrepancyProtocol.discrepancies.length + 1, text: '' }],
      },
    }));
  };

  const handlePrepareContract = () => {
    if (!contractData.contract.number || !contractData.contract.date) {
      alert('Заполните номер и дату договора!');
      return;
    }
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'prepareEstimate' }));
      setStep('prepareEstimate');
    }
  };

  const handlePrepareEstimate = () => {
    const mockFiles = ['estimate_001.pdf'];
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData: { ...contractData, estimate: { files: mockFiles } }, contractStep: 'sendTariffLetter' }));
      setStep('sendTariffLetter');
    }
  };

  const handleSendTariffLetter = () => {
    const mockFiles = ['tariff_letter_001.pdf'];
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData: { ...contractData, tariffLetter: { files: mockFiles } }, contractStep: 'receiveTariffResponse' }));
      setStep('receiveTariffResponse');
    }
  };

  const handleTariffResponse = (action) => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (!tc) return;

    if (action === 'approved') {
      setContractData(prev => ({
        ...prev,
        tariffResponse: { ...prev.tariffResponse, status: 'Тариф утвержден' },
      }));
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'registerResolution' }));
      setStep('registerResolution');
    } else if (action === 'rejected') {
      setContractData(prev => ({
        ...prev,
        tariffResponse: { ...prev.tariffResponse, status: 'Получен отказ', comments: 'Требуется уточнение данных' },
      }));
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'prepareContract' }));
      setStep('prepareContract');
    }
  };

  const handleRegisterResolution = () => {
    if (!contractData.tariffResolution.number || !contractData.tariffResolution.text) {
      alert('Заполните номер и текст постановления!');
      return;
    }
    const mockFiles = ['resolution_001.pdf'];
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData: { ...contractData, tariffResolution: { ...contractData.tariffResolution, files: mockFiles } }, contractStep: 'amendContract' }));
      setStep('amendContract');
    }
  };

  const handleAmendContract = () => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData: { ...contractData, amendedContract: { status: 'Скорректировано' } }, contractStep: 'approveContract' }));
      setStep('approveContract');
    }
  };

  const handleApproveContract = () => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'signContract' }));
      setStep('signContract');
    }
  };

  const handleSignContract = () => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (!tc) return;

    if (contractData.signing.hasRemarks) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'prepareContract' }));
      setStep('prepareContract');
    } else {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'sendByMail' }));
      setStep('sendByMail');
    }
  };

  const handleSendByMail = () => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData: { ...contractData, mailSent: true }, contractStep: 'finalizeWithConsumer' }));
      setStep('finalizeWithConsumer');
    }
  };

  const handleFinalizeWithConsumer = () => {
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (!tc) return;

    if (contractData.consumerAgreement.hasDiscrepancies) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'prepareDiscrepancy' }));
      setStep('prepareDiscrepancy');
    } else {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'completed' }));
      setStep('completed');
    }
  };

  const handlePrepareDiscrepancy = () => {
    if (!contractData.discrepancyProtocol.number || !contractData.discrepancyProtocol.date) {
      alert('Заполните номер и дату протокола!');
      return;
    }
    const tc = (technicalConditions || []).find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ id: tc.id, contractData, contractStep: 'completed' }));
      setStep('completed');
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const getStepStatus = (stepName) => {
    const steps = [
      'prepareContract', 'prepareEstimate', 'sendTariffLetter', 'receiveTariffResponse',
      'registerResolution', 'amendContract', 'approveContract', 'signContract',
      'sendByMail', 'finalizeWithConsumer', 'prepareDiscrepancy', 'completed'
    ];
    const currentIndex = steps.indexOf(step);
    const stepIndex = steps.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepName) => {
    const icons = {
      prepareContract: 'description',
      prepareEstimate: 'calculate',
      sendTariffLetter: 'mail',
      receiveTariffResponse: 'inbox',
      registerResolution: 'gavel',
      amendContract: 'edit',
      approveContract: 'approval',
      signContract: 'how_to_reg',
      sendByMail: 'local_shipping',
      finalizeWithConsumer: 'handshake',
      prepareDiscrepancy: 'report_problem',
      completed: 'check_circle'
    };
    return icons[stepName] || 'circle';
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <EmployeeLayout 
      title="Заключение договора ТП" 
      subtitle={`Заявка #${appId} - Процесс заключения договора технического присоединения`}
    >
      <div className="contract-process">
        {/* Прогресс-бар */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Прогресс заключения договора</h3>
            <div className="progress-stats">
              <span className="current-step">{step === 'completed' ? 'Завершено' : `Этап ${['prepareContract', 'prepareEstimate', 'sendTariffLetter', 'receiveTariffResponse', 'registerResolution', 'amendContract', 'approveContract', 'signContract', 'sendByMail', 'finalizeWithConsumer', 'prepareDiscrepancy'].indexOf(step) + 1} из 11`}</span>
            </div>
          </div>
          
          <div className="progress-timeline">
            {[
              { key: 'prepareContract', label: 'Подготовка договора' },
              { key: 'prepareEstimate', label: 'Сметный расчет' },
              { key: 'sendTariffLetter', label: 'Письмо регулятору' },
              { key: 'receiveTariffResponse', label: 'Ответ регулятора' },
              { key: 'registerResolution', label: 'Постановление' },
              { key: 'amendContract', label: 'Корректировка' },
              { key: 'approveContract', label: 'Согласование' },
              { key: 'signContract', label: 'Подписание' },
              { key: 'sendByMail', label: 'Отправка почтой' },
              { key: 'finalizeWithConsumer', label: 'Заключение' },
              { key: 'prepareDiscrepancy', label: 'Разногласия' },
              { key: 'completed', label: 'Завершено' }
            ].map((stepInfo, index) => (
              <div key={stepInfo.key} className={`timeline-item ${getStepStatus(stepInfo.key)}`}>
                <div className="timeline-icon">
                  <span className="material-icons">{getStepIcon(stepInfo.key)}</span>
                </div>
                <div className="timeline-content">
                  <span className="step-label">{stepInfo.label}</span>
                </div>
                {index < 11 && <div className="timeline-connector"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Основной контент */}
        <div className="contract-content">
          {step === 'prepareContract' && (
            <ContractPreparation appId={appId} onNext={setStep} />
          )}
          
          {step === 'prepareEstimate' && (
            <EstimatePreparation appId={appId} onNext={setStep} />
          )}
          
          {step === 'prepareDiscrepancy' && (
            <DiscrepancyProtocol appId={appId} onNext={setStep} />
          )}
          
          {step === 'sendTariffLetter' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">description</span>
                </div>
                <div className="step-info">
                  <h3>Подготовка договора ТП</h3>
                  <p>Создание и заполнение договора технического присоединения</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="form-section">
                  <h4>Основная информация</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Номер договора</label>
                      <input
                        type="text"
                        value={contractData.contract.number}
                        onChange={(e) => setContractData(prev => ({ ...prev, contract: { ...prev.contract, number: e.target.value } }))}
                        placeholder="TP-2025-001"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Дата договора</label>
                      <input
                        type="text"
                        value={contractData.contract.date}
                        onChange={(e) => setContractData(prev => ({ ...prev, contract: { ...prev.contract, date: e.target.value } }))}
                        placeholder="21.06.2025"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Подписывающие лица</h4>
                  <div className="signatories-list">
                    {(contractData.contract.signatories || []).map((sign, idx) => (
                      <div key={sign.id} className="signatory-item">
                        <div className="signatory-avatar">
                          <span className="material-icons">person</span>
                        </div>
                        <div className="signatory-fields">
                          <input
                            type="text"
                            value={sign.name}
                            onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value)}
                            placeholder="ФИО подписанта"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={sign.position}
                            onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value)}
                            placeholder="Должность"
                            className="form-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleAddSignatory()} className="add-btn">
                    <span className="material-icons">add</span>
                    Добавить подписанта
                  </button>
                </div>

                <div className="step-actions">
                  <button onClick={handlePrepareContract} className="primary-btn">
                    <span className="material-icons">save</span>
                    Сохранить и продолжить
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'prepareEstimate' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">calculate</span>
                </div>
                <div className="step-info">
                  <h3>Подготовка сметного расчета</h3>
                  <p>Формирование сметной документации для договора</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="files-section">
                  <h4>Прикрепленные файлы</h4>
                  <div className="files-list">
                    {(contractData.estimate.files || []).length > 0 ? (
                      contractData.estimate.files.map((file, index) => (
                        <div key={index} className="file-item">
                          <span className="material-icons">description</span>
                          <span className="file-name">{file}</span>
                          <button className="download-btn">
                            <span className="material-icons">download</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="no-files">
                        <span className="material-icons">folder_open</span>
                        <p>Файлы не прикреплены</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handlePrepareEstimate} className="primary-btn">
                    <span className="material-icons">check_circle</span>
                    Сметный расчет готов
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'sendTariffLetter' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">mail</span>
                </div>
                <div className="step-info">
                  <h3>Направление письма в тарифный регулятор</h3>
                  <p>Отправка документов для согласования тарифов</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="files-section">
                  <h4>Документы для отправки</h4>
                  <div className="files-list">
                    {(contractData.tariffLetter.files || []).length > 0 ? (
                      contractData.tariffLetter.files.map((file, index) => (
                        <div key={index} className="file-item">
                          <span className="material-icons">mail</span>
                          <span className="file-name">{file}</span>
                          <button className="download-btn">
                            <span className="material-icons">download</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="no-files">
                        <span className="material-icons">mail_outline</span>
                        <p>Документы не подготовлены</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleSendTariffLetter} className="primary-btn">
                    <span className="material-icons">send</span>
                    Отправить регулятору
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'receiveTariffResponse' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">inbox</span>
                </div>
                <div className="step-info">
                  <h3>Ответ от тарифного регулятора</h3>
                  <p>Ожидание и обработка ответа от регулирующего органа</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="status-section">
                  <h4>Статус ответа</h4>
                  <div className={`status-badge ${contractData.tariffResponse.status === 'Тариф утвержден' ? 'approved' : contractData.tariffResponse.status === 'Получен отказ' ? 'rejected' : 'pending'}`}>
                    <span className="material-icons">
                      {contractData.tariffResponse.status === 'Тариф утвержден' ? 'check_circle' : 
                       contractData.tariffResponse.status === 'Получен отказ' ? 'error' : 'pending'}
                    </span>
                    {contractData.tariffResponse.status}
                  </div>
                  
                  {contractData.tariffResponse.comments && (
                    <div className="comments-section">
                      <label>Комментарии:</label>
                      <p>{contractData.tariffResponse.comments}</p>
                    </div>
                  )}
                </div>

                <div className="step-actions">
                  <button onClick={() => handleTariffResponse('approved')} className="success-btn">
                    <span className="material-icons">check_circle</span>
                    Тариф утвержден
                  </button>
                  <button onClick={() => handleTariffResponse('rejected')} className="warning-btn">
                    <span className="material-icons">warning</span>
                    Получен отказ
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'registerResolution' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">gavel</span>
                </div>
                <div className="step-info">
                  <h3>Регистрация постановления</h3>
                  <p>Внесение постановления в реестр нормативных актов</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="form-section">
                  <h4>Данные постановления</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Номер постановления</label>
                      <input
                        type="text"
                        value={contractData.tariffResolution.number}
                        onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, number: e.target.value } }))}
                        placeholder="TR-2025-001"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Родительский документ</label>
                      <input
                        type="text"
                        value={contractData.tariffResolution.parent}
                        onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, parent: e.target.value } }))}
                        placeholder="Основание для постановления"
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Текст постановления</label>
                    <textarea
                      value={contractData.tariffResolution.text}
                      onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, text: e.target.value } }))}
                      placeholder="Введите текст постановления..."
                      className="form-textarea"
                      rows={4}
                    />
                  </div>
                  
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={contractData.tariffResolution.isActive}
                        onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, isActive: e.target.checked } }))}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Действующее постановление
                    </label>
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleRegisterResolution} className="primary-btn">
                    <span className="material-icons">save</span>
                    Зарегистрировать
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'amendContract' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">edit</span>
                </div>
                <div className="step-info">
                  <h3>Корректировка договора ТП</h3>
                  <p>Внесение изменений в договор согласно постановлению</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="status-section">
                  <h4>Статус корректировки</h4>
                  <div className={`status-badge ${contractData.amendedContract.status === 'Скорректировано' ? 'completed' : 'pending'}`}>
                    <span className="material-icons">
                      {contractData.amendedContract.status === 'Скорректировано' ? 'check_circle' : 'pending'}
                    </span>
                    {contractData.amendedContract.status}
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleAmendContract} className="primary-btn">
                    <span className="material-icons">check_circle</span>
                    Корректировка завершена
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'approveContract' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">approval</span>
                </div>
                <div className="step-info">
                  <h3>Согласование договора ТП</h3>
                  <p>Финальное согласование договора всеми сторонами</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="approval-section">
                  <h4>Согласование</h4>
                  <p>Договор готов к подписанию. Все необходимые согласования получены.</p>
                </div>

                <div className="step-actions">
                  <button onClick={handleApproveContract} className="primary-btn">
                    <span className="material-icons">approval</span>
                    Согласовано
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'signContract' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">how_to_reg</span>
                </div>
                <div className="step-info">
                  <h3>Подписание договора</h3>
                  <p>Процесс подписания договора сторонами</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="form-section">
                  <h4>Замечания по подписанию</h4>
                  <div className="form-group">
                    <label>Комментарии</label>
                    <textarea
                      value={contractData.signing.comments}
                      onChange={(e) => setContractData(prev => ({ ...prev, signing: { ...prev.signing, comments: e.target.value } }))}
                      placeholder="Укажите замечания, если есть..."
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                  
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={contractData.signing.hasRemarks}
                        onChange={(e) => setContractData(prev => ({ ...prev, signing: { ...prev.signing, hasRemarks: e.target.checked } }))}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Есть замечания
                    </label>
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleSignContract} className="primary-btn" disabled={contractData.signing.hasRemarks}>
                    <span className="material-icons">how_to_reg</span>
                    Принять к исполнению
                  </button>
                  <button onClick={() => setStep('sendByMail')} className="secondary-btn" disabled={contractData.signing.hasRemarks}>
                    <span className="material-icons">check_circle</span>
                    Нет замечаний
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'sendByMail' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">local_shipping</span>
                </div>
                <div className="step-info">
                  <h3>Отправка договора почтой</h3>
                  <p>Отправка подписанного договора потребителю</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="mail-section">
                  <h4>Отправка почтой</h4>
                  <p>Договор подготовлен к отправке заказным письмом с уведомлением о вручении.</p>
                </div>

                <div className="step-actions">
                  <button onClick={handleSendByMail} className="primary-btn">
                    <span className="material-icons">local_shipping</span>
                    Отправлено почтой
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'finalizeWithConsumer' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">handshake</span>
                </div>
                <div className="step-info">
                  <h3>Заключение договора с потребителем</h3>
                  <p>Финальное согласование с потребителем</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="form-section">
                  <h4>Согласование с потребителем</h4>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={contractData.consumerAgreement.hasDiscrepancies}
                        onChange={(e) => setContractData(prev => ({ ...prev, consumerAgreement: { ...prev.consumerAgreement, hasDiscrepancies: e.target.checked } }))}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      Получен протокол разногласий
                    </label>
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleFinalizeWithConsumer} className="primary-btn">
                    <span className="material-icons">handshake</span>
                    Принять к исполнению
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'prepareDiscrepancy' && (
            <div className="contract-step">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">report_problem</span>
                </div>
                <div className="step-info">
                  <h3>Подготовка протокола разногласий</h3>
                  <p>Оформление протокола разногласий по договору</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="form-section">
                  <h4>Данные протокола</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Номер протокола</label>
                      <input
                        type="text"
                        value={contractData.discrepancyProtocol.number}
                        onChange={(e) => setContractData(prev => ({ ...prev, discrepancyProtocol: { ...prev.discrepancyProtocol, number: e.target.value } }))}
                        placeholder="PR-2025-001"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Дата протокола</label>
                      <input
                        type="text"
                        value={contractData.discrepancyProtocol.date}
                        onChange={(e) => setContractData(prev => ({ ...prev, discrepancyProtocol: { ...prev.discrepancyProtocol, date: e.target.value } }))}
                        placeholder="21.06.2025"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Разногласия</h4>
                  <div className="discrepancies-list">
                    {(contractData.discrepancyProtocol.discrepancies || []).map((disc, idx) => (
                      <div key={disc.id} className="discrepancy-item">
                        <input
                          type="text"
                          value={disc.text}
                          onChange={(e) => handleDiscrepancyChange(idx, e.target.value)}
                          placeholder="Описание разногласия"
                          className="form-input"
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleAddDiscrepancy} className="add-btn">
                    <span className="material-icons">add</span>
                    Добавить разногласие
                  </button>
                </div>

                <div className="form-section">
                  <h4>Подписанты протокола</h4>
                  <div className="signatories-list">
                    {(contractData.discrepancyProtocol.signatories || []).map((sign, idx) => (
                      <div key={sign.id} className="signatory-item">
                        <div className="signatory-avatar">
                          <span className="material-icons">person</span>
                        </div>
                        <div className="signatory-fields">
                          <input
                            type="text"
                            value={sign.name}
                            onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value, 'discrepancyProtocol')}
                            placeholder="ФИО подписанта"
                            className="form-input"
                          />
                          <input
                            type="text"
                            value={sign.position}
                            onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value, 'discrepancyProtocol')}
                            placeholder="Должность"
                            className="form-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleAddSignatory('discrepancyProtocol')} className="add-btn">
                    <span className="material-icons">add</span>
                    Добавить подписанта
                  </button>
                </div>

                <div className="step-actions">
                  <button onClick={handlePrepareDiscrepancy} className="primary-btn">
                    <span className="material-icons">save</span>
                    Сохранить протокол
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="contract-step completed">
              <div className="step-header">
                <div className="step-icon">
                  <span className="material-icons">check_circle</span>
                </div>
                <div className="step-info">
                  <h3>Договор ТП завершен</h3>
                  <p>Процесс заключения договора технического присоединения успешно завершен</p>
                </div>
              </div>
              
              <div className="step-content">
                <div className="completion-section">
                  <div className="completion-icon">
                    <span className="material-icons">celebration</span>
                  </div>
                  <h4>Поздравляем!</h4>
                  <p>Договор технического присоединения успешно заключен и готов к исполнению.</p>
                  
                  <div className="completion-details">
                    <div className="detail-item">
                      <span className="material-icons">description</span>
                      <span>Договор подписан</span>
                    </div>
                    <div className="detail-item">
                      <span className="material-icons">local_shipping</span>
                      <span>Отправлен потребителю</span>
                    </div>
                    <div className="detail-item">
                      <span className="material-icons">check_circle</span>
                      <span>Процесс завершен</span>
                    </div>
                  </div>
                </div>

                <div className="step-actions">
                  <button onClick={handleComplete} className="primary-btn">
                    <span className="material-icons">dashboard</span>
                    Вернуться к дашборду
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ContractProcess; 