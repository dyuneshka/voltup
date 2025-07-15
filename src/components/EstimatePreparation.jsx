import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/estimate-preparation.scss';

const EstimatePreparation = ({ appId, onNext }) => {
  const dispatch = useDispatch();
  const { technicalConditions } = useSelector(state => state.technical);
  const [estimateData, setEstimateData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    type: 'new',
    works: [
      {
        id: 1,
        name: '',
        unit: '',
        quantity: '',
        unitPrice: '',
        totalPrice: ''
      }
    ],
    totalAmount: '',
    attachments: [],
    notes: ''
  });

  const handleInputChange = (field, value) => {
    setEstimateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkChange = (idx, field, value) => {
    setEstimateData(prev => ({
      ...prev,
      works: prev.works.map((work, i) => {
        if (i === idx) {
          const updatedWork = { ...work, [field]: value };
          // Автоматический расчет общей стоимости
          if (field === 'quantity' || field === 'unitPrice') {
            const quantity = field === 'quantity' ? value : work.quantity;
            const unitPrice = field === 'unitPrice' ? value : work.unitPrice;
            updatedWork.totalPrice = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
          }
          return updatedWork;
        }
        return work;
      })
    }));
  };

  const handleAddWork = () => {
    setEstimateData(prev => ({
      ...prev,
      works: [
        ...prev.works,
        {
          id: prev.works.length + 1,
          name: '',
          unit: '',
          quantity: '',
          unitPrice: '',
          totalPrice: ''
        }
      ]
    }));
  };

  const handleRemoveWork = (idx) => {
    setEstimateData(prev => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== idx)
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setEstimateData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }));
  };

  const calculateTotal = () => {
    return estimateData.works.reduce((sum, work) => {
      return sum + (parseFloat(work.totalPrice) || 0);
    }, 0).toFixed(2);
  };

  const handlePrepareEstimate = () => {
    if (!estimateData.number || !estimateData.date) {
      alert('Заполните номер и дату сметного расчета!');
      return;
    }

    if (estimateData.works.some(work => !work.name || !work.quantity || !work.unitPrice)) {
      alert('Заполните все поля в работах!');
      return;
    }

    const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId));
    if (tc) {
      const totalAmount = calculateTotal();
      const updatedEstimateData = { ...estimateData, totalAmount };
      
      dispatch(updateTechnicalCondition({ 
        id: tc.id, 
        contractData: { 
          ...tc.contractData, 
          estimate: updatedEstimateData 
        },
        contractStep: 'sendTariffLetter' 
      }));
      onNext('sendTariffLetter');
    }
  };

  return (
    <div className="estimate-preparation">
      <div className="step-header">
        <div className="step-icon">
          <span className="material-icons">calculate</span>
        </div>
        <div className="step-info">
          <h3>Подготовка сметного расчета</h3>
          <p>Формирование сметного расчета для нового вида работ</p>
        </div>
      </div>

      <div className="estimate-form">
        {/* Основная информация */}
        <div className="form-section">
          <h4>Основная информация</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Номер сметного расчета *</label>
              <input
                type="text"
                value={estimateData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="СР-2025-001"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Дата составления *</label>
              <input
                type="date"
                value={estimateData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Тип работ</label>
              <select
                value={estimateData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="form-input"
              >
                <option value="new">Новый вид работ</option>
                <option value="standard">Стандартные работы</option>
                <option value="complex">Комплексные работы</option>
              </select>
            </div>
          </div>
        </div>

        {/* Перечень работ */}
        <div className="form-section">
          <h4>Перечень работ</h4>
          <div className="works-table">
            <div className="table-header">
              <div className="header-cell">Наименование работы</div>
              <div className="header-cell">Ед. измерения</div>
              <div className="header-cell">Количество</div>
              <div className="header-cell">Цена за ед. (руб.)</div>
              <div className="header-cell">Сумма (руб.)</div>
              <div className="header-cell">Действия</div>
            </div>
            
            {estimateData.works.map((work, idx) => (
              <div key={work.id} className="table-row">
                <div className="table-cell">
                  <input
                    type="text"
                    value={work.name}
                    onChange={(e) => handleWorkChange(idx, 'name', e.target.value)}
                    placeholder="Наименование работы"
                    className="form-input"
                  />
                </div>
                <div className="table-cell">
                  <select
                    value={work.unit}
                    onChange={(e) => handleWorkChange(idx, 'unit', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Выберите</option>
                    <option value="шт">шт</option>
                    <option value="м">м</option>
                    <option value="м²">м²</option>
                    <option value="м³">м³</option>
                    <option value="км">км</option>
                    <option value="кВт">кВт</option>
                    <option value="компл">компл</option>
                    <option value="услуга">услуга</option>
                  </select>
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    value={work.quantity}
                    onChange={(e) => handleWorkChange(idx, 'quantity', e.target.value)}
                    placeholder="0"
                    className="form-input"
                    step="0.01"
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    value={work.unitPrice}
                    onChange={(e) => handleWorkChange(idx, 'unitPrice', e.target.value)}
                    placeholder="0"
                    className="form-input"
                    step="0.01"
                  />
                </div>
                <div className="table-cell">
                  <input
                    type="number"
                    value={work.totalPrice}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
                <div className="table-cell">
                  <button
                    onClick={() => handleRemoveWork(idx)}
                    className="remove-btn"
                    disabled={estimateData.works.length === 1}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={handleAddWork} className="add-btn">
            <span className="material-icons">add</span>
            Добавить работу
          </button>
        </div>

        {/* Итоговая сумма */}
        <div className="form-section">
          <h4>Итоговая сумма</h4>
          <div className="total-section">
            <div className="total-item">
              <span className="total-label">Общая стоимость работ:</span>
              <span className="total-value">{calculateTotal()} руб.</span>
            </div>
            <div className="total-item">
              <span className="total-label">НДС (20%):</span>
              <span className="total-value">{(parseFloat(calculateTotal()) * 0.2).toFixed(2)} руб.</span>
            </div>
            <div className="total-item total-final">
              <span className="total-label">Итого к оплате:</span>
              <span className="total-value">{(parseFloat(calculateTotal()) * 1.2).toFixed(2)} руб.</span>
            </div>
          </div>
        </div>

        {/* Примечания */}
        <div className="form-section">
          <h4>Примечания</h4>
          <div className="form-group">
            <textarea
              value={estimateData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Дополнительная информация по сметному расчету..."
              className="form-textarea"
              rows="4"
            />
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
              id="estimate-files"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            <label htmlFor="estimate-files" className="file-label">
              <span className="material-icons">upload_file</span>
              Выберите файлы для прикрепления
            </label>
          </div>
          {estimateData.attachments.length > 0 && (
            <div className="attachments-list">
              {estimateData.attachments.map(file => (
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
          <button onClick={handlePrepareEstimate} className="primary-btn">
            <span className="material-icons">save</span>
            Сметный расчет сформирован
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

export default EstimatePreparation; 