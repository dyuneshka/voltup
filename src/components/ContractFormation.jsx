import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createContract, completeContractProcess } from '../redux/slices/constructionSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/contract-formation.scss';

const ContractFormation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { constructionControl } = useSelector(state => state.construction);
  const [contractType, setContractType] = useState('');
  const [contractData, setContractData] = useState({
    number: '',
    date: '',
    contractor: '',
    contractorInn: '',
    contractorAddress: '',
    contractAmount: '',
    currency: 'RUB',
    startDate: '',
    endDate: '',
    description: '',
    terms: '',
    documents: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const control = (constructionControl || []).find(cc => cc.applicationId === parseInt(appId));

  const contractTypes = [
    {
      id: 'construction',
      name: 'Договор подряда на строительство',
      description: 'Выполнение строительно-монтажных работ',
      icon: 'construction'
    },
    {
      id: 'supply',
      name: 'Договор поставки материалов',
      description: 'Поставка строительных материалов и оборудования',
      icon: 'local_shipping'
    },
    {
      id: 'services',
      name: 'Договор оказания услуг',
      description: 'Оказание технических и консультационных услуг',
      icon: 'engineering'
    }
  ];

  const handleContractTypeSelect = (type) => {
    setContractType(type);
    setContractData(prev => ({
      ...prev,
      number: `Д-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }));
  };

  const handleInputChange = (field, value) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    }));

    setContractData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const handleSubmit = async () => {
    if (!contractType || !contractData.number || !contractData.contractor) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const contract = {
        id: Date.now(),
        applicationId: parseInt(appId),
        type: contractType,
        ...contractData,
        status: 'draft',
        createdBy: user.name,
        createdDate: new Date().toISOString()
      };

      dispatch(createContract(contract));
      
      if (control) {
        dispatch(completeContractProcess({
          controlId: control.id,
          contractData: contract
        }));
      }

      // Переход к следующему этапу
      setTimeout(() => {
        navigate(`/construction/${appId}`);
      }, 2000);
    } catch (error) {
      console.error('Ошибка при создании договора:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContractTypeInfo = () => {
    return contractTypes.find(type => type.id === contractType);
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <EmployeeLayout 
      title="Формирование договора" 
      subtitle={`Заявка #${appId} - Создание договорных документов`}
    >
      <div className="contract-formation">
        {/* Выбор типа договора */}
        <div className="contract-type-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">description</span>
              Выбор типа договора
            </h4>
          </div>

          <div className="contract-types-grid">
            {contractTypes.map((type) => (
              <div
                key={type.id}
                className={`contract-type-card ${contractType === type.id ? 'selected' : ''}`}
                onClick={() => handleContractTypeSelect(type.id)}
              >
                <div className="type-icon">
                  <span className="material-icons">{type.icon}</span>
                </div>
                <div className="type-info">
                  <h5>{type.name}</h5>
                  <p>{type.description}</p>
                </div>
                <div className="type-check">
                  <span className="material-icons">
                    {contractType === type.id ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Форма договора */}
        {contractType && (
          <div className="contract-form-section">
            <div className="section-header">
              <h4>
                <span className="material-icons">edit</span>
                Заполнение реквизитов договора
              </h4>
              <div className="contract-type-badge">
                <span className="material-icons">{getContractTypeInfo()?.icon}</span>
                {getContractTypeInfo()?.name}
              </div>
            </div>

            <div className="contract-form">
              <div className="form-grid">
                {/* Основные реквизиты */}
                <div className="form-group">
                  <label>Номер договора *</label>
                  <input
                    type="text"
                    value={contractData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="Введите номер договора"
                  />
                </div>

                <div className="form-group">
                  <label>Дата договора *</label>
                  <input
                    type="date"
                    value={contractData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Контрагент (подрядчик/поставщик) *</label>
                  <input
                    type="text"
                    value={contractData.contractor}
                    onChange={(e) => handleInputChange('contractor', e.target.value)}
                    placeholder="Наименование организации"
                  />
                </div>

                <div className="form-group">
                  <label>ИНН контрагента</label>
                  <input
                    type="text"
                    value={contractData.contractorInn}
                    onChange={(e) => handleInputChange('contractorInn', e.target.value)}
                    placeholder="ИНН"
                  />
                </div>

                <div className="form-group">
                  <label>Адрес контрагента</label>
                  <input
                    type="text"
                    value={contractData.contractorAddress}
                    onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                    placeholder="Юридический адрес"
                  />
                </div>

                <div className="form-group">
                  <label>Сумма договора</label>
                  <div className="amount-input">
                    <input
                      type="number"
                      value={contractData.contractAmount}
                      onChange={(e) => handleInputChange('contractAmount', e.target.value)}
                      placeholder="0.00"
                    />
                    <select
                      value={contractData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="RUB">₽</option>
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Дата начала работ</label>
                  <input
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Дата окончания работ</label>
                  <input
                    type="date"
                    value={contractData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Предмет договора</label>
                  <textarea
                    value={contractData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Опишите предмет договора..."
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Условия договора</label>
                  <textarea
                    value={contractData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    placeholder="Дополнительные условия..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Прикрепление документов */}
              <div className="documents-section">
                <div className="section-header">
                  <h5>
                    <span className="material-icons">attach_file</span>
                    Прикрепленные документы
                  </h5>
                </div>

                <div className="file-upload-area">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    id="contract-files"
                    className="file-input"
                  />
                  <label htmlFor="contract-files" className="file-upload-label">
                    <span className="material-icons">cloud_upload</span>
                    <div className="upload-text">
                      <strong>Выберите файлы</strong>
                      <span>или перетащите их сюда</span>
                    </div>
                  </label>
                </div>

                {contractData.documents.length > 0 && (
                  <div className="documents-list">
                    {contractData.documents.map((doc) => (
                      <div key={doc.id} className="document-item">
                        <div className="document-icon">
                          <span className="material-icons">description</span>
                        </div>
                        <div className="document-info">
                          <div className="document-name">{doc.name}</div>
                          <div className="document-meta">
                            {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <button 
                          className="document-remove"
                          onClick={() => {
                            setContractData(prev => ({
                              ...prev,
                              documents: prev.documents.filter(d => d.id !== doc.id)
                            }));
                          }}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Действия */}
              <div className="form-actions">
                <button
                  onClick={() => navigate(`/construction/${appId}`)}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  <span className="material-icons">arrow_back</span>
                  Назад
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  <span className="material-icons">save</span>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить и провести'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default ContractFormation; 