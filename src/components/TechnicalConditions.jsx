import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createTechnicalCondition } from '../redux/slices/technicalSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/technical.scss';

const TechnicalConditions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { applications } = useSelector(state => state.application);
  const { technicalConditions } = useSelector(state => state.technical);
  const [selectedOtr, setSelectedOtr] = useState(null);
  const [tuData, setTuData] = useState({
    signatories: [{ id: 1, name: '', position: '' }],
    requiresSso: false,
  });

  useEffect(() => {
    const app = applications.find(a => a.id === parseInt(appId));
    if (app && app.otr) {
      setSelectedOtr(app.otr);
      setTuData(prev => ({
        ...prev,
        signatories: app.otr.signatories || [{ id: 1, name: 'Петров А.А.', position: 'Главный инженер' }],
      }));
    }
  }, [appId, applications, technicalConditions]);

  const handleSignatoryChange = (idx, field, value) => {
    setTuData(prev => ({
      ...prev,
      signatories: prev.signatories.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  const handleAddSignatory = () => {
    setTuData(prev => ({
      ...prev,
      signatories: [...prev.signatories, { id: prev.signatories.length + 1, name: '', position: '' }],
    }));
  };

  const handleRemoveSignatory = (idx) => {
    if (tuData.signatories.length > 1) {
      setTuData(prev => ({
        ...prev,
        signatories: prev.signatories.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleCreateTu = () => {
    if (!selectedOtr) {
      alert('Выберите ОТР для создания ТУ!');
      return;
    }
    const app = applications.find(a => a.id === parseInt(appId));
    if (!app) {
      alert('Заявка не найдена!');
      return;
    }
    const newTu = {
      id: Date.now(),
      applicationId: parseInt(appId),
      voltage: selectedOtr.soActivities?.[0]?.voltage || '10 кВ',
      status: 'Черновик',
      conditions: `Технические условия для объекта ${selectedOtr.networkStructure?.[0]} с мощностью ${app.power} кВт`,
      signatories: tuData.signatories.filter(s => s.name && s.position),
      requiresSso: tuData.requiresSso,
      createdDate: '21.06.2025',
      otrId: selectedOtr.id || Date.now(),
    };
    dispatch(createTechnicalCondition(newTu));
    if (tuData.requiresSso) {
      navigate(`/sso/${appId}`);
    } else {
      // Обновляем статус заявки на "ТУ создано"
      const updatedApp = { ...currentApp, status: 'ТУ создано' };
      // Здесь можно добавить dispatch для обновления статуса заявки
      navigate(`/tu-approval-res/${appId}`);
    }
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const currentApp = applications.find(a => a.id === parseInt(appId));

  return (
    <EmployeeLayout 
      title="Технические условия" 
      subtitle={`Подготовка ТУ для заявки #${appId}`}
    >
      <div className="technical-conditions">
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
                    <span>{currentApp.applicant}</span>
                  </div>
                  <div className="info-item">
                    <label>Мощность:</label>
                    <span>{currentApp.power}</span>
                  </div>
                  <div className="info-item">
                    <label>Напряжение:</label>
                    <span>{currentApp.voltage}</span>
                  </div>
                  <div className="info-item">
                    <label>Тип:</label>
                    <span>{currentApp.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Выбор ОТР */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="material-icons">assignment</span>
            Выбор ОТР
          </h3>
          
          {currentApp?.otr ? (
            <div className="otr-selection">
              <div className="select-wrapper">
                <span className="material-icons">expand_more</span>
                <select 
                  onChange={(e) => setSelectedOtr(JSON.parse(e.target.value))}
                  className="form-select"
                >
                  <option value="">Выберите ОТР</option>
                  <option value={JSON.stringify(currentApp.otr)}>
                    ОТР от {currentApp.otr.tariffType}
                  </option>
                </select>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <span className="material-icons">warning</span>
              <p>Нет данных ОТР для заявки #{appId}. Убедитесь, что ОТР создан в EmployeePanel.</p>
            </div>
          )}
        </div>

        {/* Детали ТУ */}
        {selectedOtr && (
          <>
            <div className="form-section">
              <h3 className="section-title">
                <span className="material-icons">engineering</span>
                Технические условия
              </h3>
              
              <div className="tu-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Напряжение:</label>
                    <span>{selectedOtr.soActivities?.[0]?.voltage || '10 кВ'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Структура сети:</label>
                    <span>{selectedOtr.networkStructure?.join(', ') || 'Не заполнено'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Тип тарифа:</label>
                    <span>{selectedOtr.tariffType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Подписывающие лица */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="material-icons">person_add</span>
                Подписывающие лица
              </h3>
              
              <div className="signatories-list">
                {tuData.signatories.map((sign, idx) => (
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
                    {tuData.signatories.length > 1 && (
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

            {/* Дополнительные опции */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="material-icons">settings</span>
                Дополнительные опции
              </h3>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={tuData.requiresSso}
                    onChange={(e) => setTuData(prev => ({ ...prev, requiresSso: e.target.checked }))}
                    className="form-checkbox"
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Требуется заявка в ССО</span>
                </label>
              </div>
            </div>

            {/* Кнопка создания */}
            <div className="form-actions">
              <button onClick={handleCreateTu} className="create-tu-btn">
                <span className="material-icons">create</span>
                Создать документ ТУ
              </button>
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default TechnicalConditions;