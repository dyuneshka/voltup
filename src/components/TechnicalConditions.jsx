import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/technical.scss';

const TechnicalConditions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { applications } = useSelector(state => state.application);
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
  }, [appId, applications]);

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

  const handleCreateTu = () => {
    if (!selectedOtr) return;
    const newTu = {
      id: Date.now(),
      applicationId: parseInt(appId),
      voltage: selectedOtr.soActivities?.[0]?.voltage || '10 кВ',
      status: 'Черновик',
      conditions: `Технические условия для объекта ${selectedOtr.networkStructure?.[0]} с мощностью ${applications.find(a => a.id === parseInt(appId))?.power} кВт`,
      signatories: tuData.signatories.filter(s => s.name && s.position),
      requiresSso: tuData.requiresSso,
      createdDate: '18.06.2025',
    };
    dispatch(createTechnicalCondition(newTu));
    navigate('/approval');
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="technical-conditions">
      <h2>Технические условия для заявки #{appId}</h2>
      {selectedOtr && (
        <>
          <div className="otr-details">
            <p>Тип тарифа: {selectedOtr.tariffType || 'Тариф 1'}</p>
            <p>Удаленность: {selectedOtr.distance || '25 км'}</p>
            <p>Структура сети: {selectedOtr.networkStructure?.join(', ') || 'Точка 1, Подстанция A, ЛЭП 10 кВ'}</p>
            <h4>Мероприятия СО</h4>
            <ul>
              {selectedOtr.soActivities?.map(act => (
                <li key={act.id}>{act.section || 'Раздел 1'} - {act.voltage || '10 кВ'} - {act.length || '5 км'}</li>
              )) || <li>Раздел 1 - 10 кВ - 5 км</li>}
            </ul>
            <h4>Мероприятия заявителя</h4>
            <ul>
              {selectedOtr.applicantActivities?.map(act => (
                <li key={act.id}>{act.section || 'Раздел 2'}</li>
              )) || <li>Раздел 2</li>}
            </ul>
          </div>
          <div className="tu-form">
            <h3>Подписывающие лица</h3>
            {tuData.signatories.map((sign, idx) => (
              <div key={sign.id} className="signatory-row">
                <input
                  type="text"
                  value={sign.name}
                  onChange={(e) => handleSignatoryChange(idx, 'name', e.target.value)}
                  placeholder="ФИО"
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
            ))}
            <button onClick={handleAddSignatory} className="add-button">Добавить</button>
            <label>
              <input
                type="checkbox"
                checked={tuData.requiresSso}
                onChange={(e) => setTuData(prev => ({ ...prev, requiresSso: e.target.checked }))}
              /> Требуется заявка в ССО
            </label>
            <button onClick={handleCreateTu} className="create-tu-button">
              Создать документ ТУ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TechnicalConditions;