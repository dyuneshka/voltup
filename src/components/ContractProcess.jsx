import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTechnicalCondition, createContractProcess } from '../redux/slices/technicalSlice';
import '../styles/contract.scss';

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
    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
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
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'prepareEstimate' }));
    setStep('prepareEstimate');
  };

  const handlePrepareEstimate = () => {
    const mockFiles = ['estimate_001.pdf'];
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData: { ...contractData, estimate: { files: mockFiles } }, contractStep: 'sendTariffLetter' }));
    setStep('sendTariffLetter');
  };

  const handleSendTariffLetter = () => {
    const mockFiles = ['tariff_letter_001.pdf'];
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData: { ...contractData, tariffLetter: { files: mockFiles } }, contractStep: 'receiveTariffResponse' }));
    setStep('receiveTariffResponse');
  };

  const handleTariffResponse = (action) => {
    if (action === 'approved') {
      setContractData(prev => ({
        ...prev,
        tariffResponse: { ...prev.tariffResponse, status: 'Тариф утвержден' },
      }));
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'registerResolution' }));
      setStep('registerResolution');
    } else if (action === 'rejected') {
      setContractData(prev => ({
        ...prev,
        tariffResponse: { ...prev.tariffResponse, status: 'Получен отказ', comments: 'Требуется уточнение данных' },
      }));
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'prepareContract' }));
      setStep('prepareContract');
    }
  };

  const handleRegisterResolution = () => {
    if (!contractData.tariffResolution.number || !contractData.tariffResolution.text) {
      alert('Заполните номер и текст постановления!');
      return;
    }
    const mockFiles = ['resolution_001.pdf'];
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData: { ...contractData, tariffResolution: { ...contractData.tariffResolution, files: mockFiles } }, contractStep: 'amendContract' }));
    setStep('amendContract');
  };

  const handleAmendContract = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData: { ...contractData, amendedContract: { status: 'Скорректировано' } }, contractStep: 'approveContract' }));
    setStep('approveContract');
  };

  const handleApproveContract = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'signContract' }));
    setStep('signContract');
  };

  const handleSignContract = () => {
    if (contractData.signing.hasRemarks) {
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'prepareContract' }));
      setStep('prepareContract');
    } else {
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'sendByMail' }));
      setStep('sendByMail');
    }
  };

  const handleSendByMail = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData: { ...contractData, mailSent: true }, contractStep: 'finalizeWithConsumer' }));
    setStep('finalizeWithConsumer');
  };

  const handleFinalizeWithConsumer = () => {
    if (contractData.consumerAgreement.hasDiscrepancies) {
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'prepareDiscrepancy' }));
      setStep('prepareDiscrepancy');
    } else {
      dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'completed' }));
      setStep('completed');
    }
  };

  const handlePrepareDiscrepancy = () => {
    if (!contractData.discrepancyProtocol.number || !contractData.discrepancyProtocol.date) {
      alert('Заполните номер и дату протокола!');
      return;
    }
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractData, contractStep: 'completed' }));
    setStep('completed');
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="contract-process">
      <h2>Заключение договора ТП для заявки #{appId}</h2>
      {step === 'prepareContract' && (
        <div className="contract-step">
          <h3>Подготовить договор ТП</h3>
          <div className="form">
            <input
              type="text"
              value={contractData.contract.number}
              onChange={(e) => setContractData(prev => ({ ...prev, contract: { ...prev.contract, number: e.target.value } }))}
              placeholder="Номер договора (например, TP-2025-001)"
            />
            <input
              type="text"
              value={contractData.contract.date}
              onChange={(e) => setContractData(prev => ({ ...prev, contract: { ...prev.contract, date: e.target.value } }))}
              placeholder="Дата (например, 21.06.2025)"
            />
            <h4>Подписывающие лица</h4>
            {contractData.contract.signatories.map((sign, idx) => (
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
            <button onClick={() => handleAddSignatory()} className="add-button">Добавить</button>
            <button onClick={handlePrepareContract} className="save-button">Провести и закрыть</button>
            <button onClick={() => setStep('prepareEstimate')} className="next-button">Договор сформирован</button>
          </div>
        </div>
      )}
      {step === 'prepareEstimate' && (
        <div className="estimate-step">
          <h3>Подготовить сметный расчет</h3>
          <p>Прикрепленные файлы: {contractData.estimate.files.join(', ') || 'Нет файлов'}</p>
          <button onClick={handlePrepareEstimate} className="next-button">Сметный расчет сформирован</button>
        </div>
      )}
      {step === 'sendTariffLetter' && (
        <div className="tariff-letter-step">
          <h3>Направить письмо в тарифный регулятор</h3>
          <p>Прикрепленные файлы: {contractData.tariffLetter.files.join(', ') || 'Нет файлов'}</p>
          <button onClick={handleSendTariffLetter} className="next-button">Выполнено</button>
        </div>
      )}
      {step === 'receiveTariffResponse' && (
        <div className="tariff-response-step">
          <h3>Получить ответ от тарифного регулятора</h3>
          <p>Статус: {contractData.tariffResponse.status}</p>
          {contractData.tariffResponse.comments && <p>Замечания: {contractData.tariffResponse.comments}</p>}
          <button onClick={() => handleTariffResponse('approved')} className="next-button">Тариф утвержден</button>
          <button onClick={() => handleTariffResponse('rejected')} className="next-button">Получен отказ</button>
        </div>
      )}
      {step === 'registerResolution' && (
        <div className="resolution-step">
          <h3>Зарегистрировать постановление</h3>
          <div className="form">
            <input
              type="text"
              value={contractData.tariffResolution.number}
              onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, number: e.target.value } }))}
              placeholder="Номер постановления (например, TR-2025-001)"
            />
            <input
              type="text"
              value={contractData.tariffResolution.parent}
              onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, parent: e.target.value } }))}
              placeholder="Родительский документ"
            />
            <textarea
              value={contractData.tariffResolution.text}
              onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, text: e.target.value } }))}
              placeholder="Текст постановления"
            />
            <label>
              <input
                type="checkbox"
                checked={contractData.tariffResolution.isActive}
                onChange={(e) => setContractData(prev => ({ ...prev, tariffResolution: { ...prev.tariffResolution, isActive: e.target.checked } }))}
              /> Действующее
            </label>
            <button onClick={handleRegisterResolution} className="save-button">Записать и закрыть</button>
            <button onClick={() => setStep('amendContract')} className="next-button">Постановление зарегистрировано</button>
          </div>
        </div>
      )}
      {step === 'amendContract' && (
        <div className="amend-step">
          <h3>Скорректировать договор ТП</h3>
          <p>Статус: {contractData.amendedContract.status}</p>
          <button onClick={handleAmendContract} className="next-button">Выполнено</button>
        </div>
      )}
      {step === 'approveContract' && (
        <div className="approve-step">
          <h3>Согласовать договор ТП</h3>
          <button onClick={handleApproveContract} className="next-button">Согласовано</button>
        </div>
      )}
      {step === 'signContract' && (
        <div className="sign-step">
          <h3>Подписание договора</h3>
          <textarea
            value={contractData.signing.comments}
            onChange={(e) => setContractData(prev => ({ ...prev, signing: { ...prev.signing, comments: e.target.value } }))}
            placeholder="Укажите замечания (если есть)"
          />
          <label>
            <input
              type="checkbox"
              checked={contractData.signing.hasRemarks}
              onChange={(e) => setContractData(prev => ({ ...prev, signing: { ...prev.signing, hasRemarks: e.target.checked } }))}
            /> Есть замечания
          </label>
          <button onClick={handleSignContract} className="next-button">Принять к исполнению</button>
          <button onClick={() => setStep('sendByMail')} className="next-button" disabled={contractData.signing.hasRemarks}>Нет замечаний</button>
        </div>
      )}
      {step === 'sendByMail' && (
        <div className="mail-step">
          <h3>Отправить договор ТП почтой</h3>
          <button onClick={handleSendByMail} className="next-button">Отправлено почтой</button>
        </div>
      )}
      {step === 'finalizeWithConsumer' && (
        <div className="consumer-step">
          <h3>Заключение договора с потребителем</h3>
          <label>
            <input
              type="checkbox"
              checked={contractData.consumerAgreement.hasDiscrepancies}
              onChange={(e) => setContractData(prev => ({ ...prev, consumerAgreement: { ...prev.consumerAgreement, hasDiscrepancies: e.target.checked } }))}
            /> Получен протокол разногласий
          </label>
          <button onClick={handleFinalizeWithConsumer} className="next-button">Принять к исполнению</button>
        </div>
      )}
      {step === 'prepareDiscrepancy' && (
        <div className="discrepancy-step">
          <h3>Подготовить протокол разногласий</h3>
          <div className="form">
            <input
              type="text"
              value={contractData.discrepancyProtocol.number}
              onChange={(e) => setContractData(prev => ({ ...prev, discrepancyProtocol: { ...prev.discrepancyProtocol, number: e.target.value } }))}
              placeholder="Номер протокола (например, PR-2025-001)"
            />
            <input
              type="text"
              value={contractData.discrepancyProtocol.date}
              onChange={(e) => setContractData(prev => ({ ...prev, discrepancyProtocol: { ...prev.discrepancyProtocol, date: e.target.value } }))}
              placeholder="Дата (например, 21.06.2025)"
            />
            <h4>Разногласия</h4>
            {contractData.discrepancyProtocol.discrepancies.map((disc, idx) => (
              <div key={disc.id} className="discrepancy-row">
                <input
                  type="text"
                  value={disc.text}
                  onChange={(e) => handleDiscrepancyChange(idx, e.target.value)}
                  placeholder="Текст разногласия"
                />
              </div>
            ))}
            <button onClick={handleAddDiscrepancy} className="add-button">Добавить разногласие</button>
            <h4>Подписанты</h4>
            {contractData.discrepancyProtocol.signatories.map((sign, idx) => (
              <div key={sign.id} className="signatory-row">
                <input
                  type="text"
                  value={sign.name}
                  onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value, 'discrepancyProtocol')}
                  placeholder="ФИО"
                />
                <input
                  type="text"
                  value={sign.position}
                  onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value, 'discrepancyProtocol')}
                  placeholder="Должность"
                />
              </div>
            ))}
            <button onClick={() => handleAddSignatory('discrepancyProtocol')} className="add-button">Добавить подписанта</button>
            <button onClick={handlePrepareDiscrepancy} className="save-button">Записать и закрыть</button>
            <button onClick={() => setStep('completed')} className="next-button">Протокол разногласий сформирован</button>
          </div>
        </div>
      )}
      {step === 'completed' && (
        <div className="completed-step">
          <h3>Договор ТП завершен</h3>
          <button onClick={handleComplete} className="back-button">Вернуться к дашборду</button>
        </div>
      )}
    </div>
  );
};

export default ContractProcess;