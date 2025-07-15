import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/contract-preparation.scss';

const ContractPreparation = ({ appId, onNext }) => {
  const dispatch = useDispatch();
  const { technicalConditions } = useSelector(state => state.technical);
  const [contractData, setContractData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    applicant: {
      name: '',
      address: '',
      inn: '',
      kpp: '',
      ogrn: '',
      bankDetails: {
        bank: '',
        account: '',
        bik: '',
        correspondentAccount: ''
      }
    },
    connectionPoint: {
      address: '',
      voltage: '',
      power: ''
    },
    terms: {
      startDate: '',
      endDate: '',
      cost: '',
      paymentSchedule: []
    },
    signatories: [
      { id: 1, name: '', position: '', organization: 'ПАО Россети' },
      { id: 2, name: '', position: '', organization: 'Заявитель' }
    ],
    attachments: []
  });

  const handleInputChange = (section, field, value) => {
    setContractData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setContractData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSignatoryChange = (idx, field, value) => {
    setContractData(prev => ({
      ...prev,
      signatories: prev.signatories.map((s, i) => 
        i === idx ? { ...s, [field]: value } : s
      )
    }));
  };

  const handleAddPaymentSchedule = () => {
    setContractData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        paymentSchedule: [
          ...prev.terms.paymentSchedule,
          { id: Date.now(), date: '', amount: '', description: '' }
        ]
      }
    }));
  };

  const handlePaymentScheduleChange = (idx, field, value) => {
    setContractData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        paymentSchedule: prev.terms.paymentSchedule.map((p, i) => 
          i === idx ? { ...p, [field]: value } : p
        )
      }
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setContractData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }));
  };

  const handlePrepareContract = () => {
    if (!contractData.number || !contractData.date) {
      alert('Заполните номер и дату договора!');
      return;
    }

    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ 
        id: tc.id, 
        contractData: { ...tc.contractData, contract: contractData },
        contractStep: 'prepareEstimate' 
      }));
      onNext('prepareEstimate');
    }
  };

  return (
    <div className="contract-preparation">
      <div className="step-header">
        <div className="step-icon">
          <span className="material-icons">description</span>
        </div>
        <div className="step-info">
          <h3>Подготовка договора ТП</h3>
          <p>Формирование договора технологического присоединения</p>
        </div>
      </div>

      <div className="contract-form">
        {/* Основная информация */}
        <div className="form-section">
          <h4>Основная информация</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Номер договора *</label>
              <input
                type="text"
                value={contractData.number}
                onChange={(e) => handleInputChange('number', '', e.target.value)}
                placeholder="ТП-2025-001"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Дата договора *</label>
              <input
                type="date"
                value={contractData.date}
                onChange={(e) => handleInputChange('date', '', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Информация о заявителе */}
        <div className="form-section">
          <h4>Информация о заявителе</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Наименование организации</label>
              <input
                type="text"
                value={contractData.applicant.name}
                onChange={(e) => handleInputChange('applicant', 'name', e.target.value)}
                placeholder="ООО Рога и Копыта"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>ИНН</label>
              <input
                type="text"
                value={contractData.applicant.inn}
                onChange={(e) => handleInputChange('applicant', 'inn', e.target.value)}
                placeholder="1234567890"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>КПП</label>
              <input
                type="text"
                value={contractData.applicant.kpp}
                onChange={(e) => handleInputChange('applicant', 'kpp', e.target.value)}
                placeholder="123456789"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>ОГРН</label>
              <input
                type="text"
                value={contractData.applicant.ogrn}
                onChange={(e) => handleInputChange('applicant', 'ogrn', e.target.value)}
                placeholder="1234567890123"
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <label>Юридический адрес</label>
              <input
                type="text"
                value={contractData.applicant.address}
                onChange={(e) => handleInputChange('applicant', 'address', e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-subsection">
            <h5>Банковские реквизиты</h5>
            <div className="form-grid">
              <div className="form-group">
                <label>Банк</label>
                <input
                  type="text"
                  value={contractData.applicant.bankDetails.bank}
                  onChange={(e) => handleNestedChange('applicant', 'bankDetails', 'bank', e.target.value)}
                  placeholder="ПАО Сбербанк"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Расчетный счет</label>
                <input
                  type="text"
                  value={contractData.applicant.bankDetails.account}
                  onChange={(e) => handleNestedChange('applicant', 'bankDetails', 'account', e.target.value)}
                  placeholder="40702810123456789012"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>БИК</label>
                <input
                  type="text"
                  value={contractData.applicant.bankDetails.bik}
                  onChange={(e) => handleNestedChange('applicant', 'bankDetails', 'bik', e.target.value)}
                  placeholder="044525225"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Корр. счет</label>
                <input
                  type="text"
                  value={contractData.applicant.bankDetails.correspondentAccount}
                  onChange={(e) => handleNestedChange('applicant', 'bankDetails', 'correspondentAccount', e.target.value)}
                  placeholder="30101810400000000225"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Точка присоединения */}
        <div className="form-section">
          <h4>Точка присоединения</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Адрес точки присоединения</label>
              <input
                type="text"
                value={contractData.connectionPoint.address}
                onChange={(e) => handleInputChange('connectionPoint', 'address', e.target.value)}
                placeholder="г. Москва, ул. Энергетическая, д. 10"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Класс напряжения</label>
              <select
                value={contractData.connectionPoint.voltage}
                onChange={(e) => handleInputChange('connectionPoint', 'voltage', e.target.value)}
                className="form-input"
              >
                <option value="">Выберите напряжение</option>
                <option value="0.4">0.4 кВ</option>
                <option value="6">6 кВ</option>
                <option value="10">10 кВ</option>
                <option value="35">35 кВ</option>
                <option value="110">110 кВ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Максимальная мощность</label>
              <input
                type="text"
                value={contractData.connectionPoint.power}
                onChange={(e) => handleInputChange('connectionPoint', 'power', e.target.value)}
                placeholder="150 кВт"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Условия договора */}
        <div className="form-section">
          <h4>Условия договора</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Дата начала работ</label>
              <input
                type="date"
                value={contractData.terms.startDate}
                onChange={(e) => handleInputChange('terms', 'startDate', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Дата окончания работ</label>
              <input
                type="date"
                value={contractData.terms.endDate}
                onChange={(e) => handleInputChange('terms', 'endDate', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Стоимость работ (руб.)</label>
              <input
                type="number"
                value={contractData.terms.cost}
                onChange={(e) => handleInputChange('terms', 'cost', e.target.value)}
                placeholder="500000"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-subsection">
            <h5>График платежей</h5>
            <div className="payment-schedule">
              {contractData.terms.paymentSchedule.map((payment, idx) => (
                <div key={payment.id} className="payment-item">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Дата платежа</label>
                      <input
                        type="date"
                        value={payment.date}
                        onChange={(e) => handlePaymentScheduleChange(idx, 'date', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Сумма (руб.)</label>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => handlePaymentScheduleChange(idx, 'amount', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Описание</label>
                      <input
                        type="text"
                        value={payment.description}
                        onChange={(e) => handlePaymentScheduleChange(idx, 'description', e.target.value)}
                        placeholder="Авансовый платеж"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={handleAddPaymentSchedule} className="add-btn">
                <span className="material-icons">add</span>
                Добавить платеж
              </button>
            </div>
          </div>
        </div>

        {/* Подписывающие лица */}
        <div className="form-section">
          <h4>Подписывающие лица</h4>
          <div className="signatories-list">
            {contractData.signatories.map((signatory, idx) => (
              <div key={signatory.id} className="signatory-item">
                <div className="signatory-header">
                  <span className="signatory-organization">{signatory.organization}</span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>ФИО</label>
                    <input
                      type="text"
                      value={signatory.name}
                      onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value)}
                      placeholder="Иванов Иван Иванович"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Должность</label>
                    <input
                      type="text"
                      value={signatory.position}
                      onChange={(e) => handleSignatoryChange(idx, 'position', e.target.value)}
                      placeholder="Генеральный директор"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Прикрепленные файлы */}
        <div className="form-section">
          <h4>Прикрепленные файлы</h4>
          <div className="file-upload">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="file-input"
              id="contract-files"
            />
            <label htmlFor="contract-files" className="file-label">
              <span className="material-icons">upload_file</span>
              Выберите файлы для прикрепления
            </label>
          </div>
          {contractData.attachments.length > 0 && (
            <div className="attachments-list">
              {contractData.attachments.map(file => (
                <div key={file.id} className="attachment-item">
                  <span className="material-icons">description</span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Действия */}
        <div className="step-actions">
          <button onClick={handlePrepareContract} className="primary-btn">
            <span className="material-icons">save</span>
            Провести и закрыть
          </button>
          <button className="secondary-btn">
            <span className="material-icons">preview</span>
            Предварительный просмотр
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPreparation; 