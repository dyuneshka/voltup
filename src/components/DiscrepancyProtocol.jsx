import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/discrepancy-protocol.scss';

const DiscrepancyProtocol = ({ appId, onNext }) => {
  const dispatch = useDispatch();
  const { technicalConditions } = useSelector(state => state.technical);
  const [protocolData, setProtocolData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    contractNumber: '',
    discrepancies: [
      {
        id: 1,
        clause: '',
        originalText: '',
        proposedText: '',
        justification: ''
      }
    ],
    signatories: [
      { id: 1, name: '', position: '', organization: 'ПАО Россети', signature: false },
      { id: 2, name: '', position: '', organization: 'Заявитель', signature: false }
    ],
    attachments: [],
    status: 'draft'
  });

  const handleInputChange = (field, value) => {
    setProtocolData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiscrepancyChange = (idx, field, value) => {
    setProtocolData(prev => ({
      ...prev,
      discrepancies: prev.discrepancies.map((disc, i) => 
        i === idx ? { ...disc, [field]: value } : disc
      )
    }));
  };

  const handleAddDiscrepancy = () => {
    setProtocolData(prev => ({
      ...prev,
      discrepancies: [
        ...prev.discrepancies,
        {
          id: prev.discrepancies.length + 1,
          clause: '',
          originalText: '',
          proposedText: '',
          justification: ''
        }
      ]
    }));
  };

  const handleRemoveDiscrepancy = (idx) => {
    setProtocolData(prev => ({
      ...prev,
      discrepancies: prev.discrepancies.filter((_, i) => i !== idx)
    }));
  };

  const handleSignatoryChange = (idx, field, value) => {
    setProtocolData(prev => ({
      ...prev,
      signatories: prev.signatories.map((sign, i) => 
        i === idx ? { ...sign, [field]: value } : sign
      )
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setProtocolData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }));
  };

  const handlePrepareProtocol = () => {
    if (!protocolData.number || !protocolData.date) {
      alert('Заполните номер и дату протокола!');
      return;
    }

    if (protocolData.discrepancies.some(disc => !disc.clause || !disc.originalText || !disc.proposedText)) {
      alert('Заполните все поля в разногласиях!');
      return;
    }

    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      dispatch(updateTechnicalCondition({ 
        id: tc.id, 
        contractData: { 
          ...tc.contractData, 
          discrepancyProtocol: { ...protocolData, status: 'prepared' }
        },
        contractStep: 'approveProtocol' 
      }));
      onNext('approveProtocol');
    }
  };

  const handleApproveProtocol = (action) => {
    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
    if (!tc) return;

    if (action === 'approved') {
      dispatch(updateTechnicalCondition({ 
        id: tc.id, 
        contractData: { 
          ...tc.contractData, 
          discrepancyProtocol: { ...protocolData, status: 'approved' }
        },
        contractStep: 'signProtocol' 
      }));
      onNext('signProtocol');
    } else if (action === 'rejected') {
      dispatch(updateTechnicalCondition({ 
        id: tc.id, 
        contractData: { 
          ...tc.contractData, 
          discrepancyProtocol: { ...protocolData, status: 'rejected' }
        },
        contractStep: 'prepareResolution' 
      }));
      onNext('prepareResolution');
    }
  };

  return (
    <div className="discrepancy-protocol">
      <div className="step-header">
        <div className="step-icon">
          <span className="material-icons">report_problem</span>
        </div>
        <div className="step-info">
          <h3>Протокол разногласий</h3>
          <p>Подготовка и согласование протокола разногласий</p>
        </div>
      </div>

      <div className="protocol-form">
        {/* Основная информация */}
        <div className="form-section">
          <h4>Основная информация</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Номер протокола *</label>
              <input
                type="text"
                value={protocolData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="ПР-2025-001"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Дата составления *</label>
              <input
                type="date"
                value={protocolData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Номер договора</label>
              <input
                type="text"
                value={protocolData.contractNumber}
                onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                placeholder="ТП-2025-001"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Разногласия */}
        <div className="form-section">
          <h4>Разногласия</h4>
          <div className="discrepancies-list">
            {protocolData.discrepancies.map((discrepancy, idx) => (
              <div key={discrepancy.id} className="discrepancy-item">
                <div className="discrepancy-header">
                  <h5>Разногласие #{idx + 1}</h5>
                  <button
                    onClick={() => handleRemoveDiscrepancy(idx)}
                    className="remove-btn"
                    disabled={protocolData.discrepancies.length === 1}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Пункт договора</label>
                    <input
                      type="text"
                      value={discrepancy.clause}
                      onChange={(e) => handleDiscrepancyChange(idx, 'clause', e.target.value)}
                      placeholder="п. 3.1"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Текст в договоре</label>
                    <textarea
                      value={discrepancy.originalText}
                      onChange={(e) => handleDiscrepancyChange(idx, 'originalText', e.target.value)}
                      placeholder="Оригинальный текст пункта договора..."
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Предлагаемый текст</label>
                    <textarea
                      value={discrepancy.proposedText}
                      onChange={(e) => handleDiscrepancyChange(idx, 'proposedText', e.target.value)}
                      placeholder="Предлагаемый текст пункта..."
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Обоснование</label>
                    <textarea
                      value={discrepancy.justification}
                      onChange={(e) => handleDiscrepancyChange(idx, 'justification', e.target.value)}
                      placeholder="Обоснование предлагаемых изменений..."
                      className="form-textarea"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button onClick={handleAddDiscrepancy} className="add-btn">
              <span className="material-icons">add</span>
              Добавить разногласие
            </button>
          </div>
        </div>

        {/* Подписанты */}
        <div className="form-section">
          <h4>Подписанты</h4>
          <div className="signatories-list">
            {protocolData.signatories.map((signatory, idx) => (
              <div key={signatory.id} className="signatory-item">
                <div className="signatory-header">
                  <span className="signatory-organization">{signatory.organization}</span>
                  <div className="signature-status">
                    <input
                      type="checkbox"
                      id={`signature-${idx}`}
                      checked={signatory.signature}
                      onChange={(e) => handleSignatoryChange(idx, 'signature', e.target.checked)}
                      className="signature-checkbox"
                    />
                    <label htmlFor={`signature-${idx}`}>Подписано</label>
                  </div>
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
              id="protocol-files"
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="protocol-files" className="file-label">
              <span className="material-icons">upload_file</span>
              Выберите файлы для прикрепления
            </label>
          </div>
          {protocolData.attachments.length > 0 && (
            <div className="attachments-list">
              {protocolData.attachments.map(file => (
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
          {protocolData.status === 'draft' && (
            <button onClick={handlePrepareProtocol} className="primary-btn">
              <span className="material-icons">save</span>
              Протокол разногласий сформирован
            </button>
          )}
          
          {protocolData.status === 'prepared' && (
            <div className="approval-actions">
              <button 
                onClick={() => handleApproveProtocol('approved')} 
                className="approve-btn"
              >
                <span className="material-icons">check_circle</span>
                Согласовано
              </button>
              <button 
                onClick={() => handleApproveProtocol('rejected')} 
                className="reject-btn"
              >
                <span className="material-icons">cancel</span>
                Сформировать ПУР
              </button>
            </div>
          )}
          
          <button className="secondary-btn">
            <span className="material-icons">preview</span>
            Предварительный просмотр
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscrepancyProtocol; 