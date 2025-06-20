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
  const { technicalConditions } = useSelector(state => state.technical);
  const [selectedOtr, setSelectedOtr] = useState(null);
  const [tuData, setTuData] = useState({
    signatories: [{ id: 1, name: '', position: '' }],
    requiresSso: false,
  });

  useEffect(() => {
    const app = applications.find(a => a.id === parseInt(appId));
    console.log('Application found:', app); // Отладка
    if (app && app.otr) {
      console.log('OTR found:', app.otr); // Отладка
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
      createdDate: '18.06.2025',
      otrId: selectedOtr.id || Date.now(),
    };
    console.log('Creating TU:', newTu); // Отладка
    dispatch(createTechnicalCondition(newTu));
    navigate(`/approval/${appId}`); // Переход с динамическим appId
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="technical-conditions">
      <h2>Подготовка ТУ для заявки #{appId}</h2>
      {applications.find(a => a.id === parseInt(appId))?.otr && (
        <div className="otr-selection">
          <h3>Выберите ОТР</h3>
          <select onChange={(e) => setSelectedOtr(JSON.parse(e.target.value))}>
            <option value="">Выберите ОТР</option>
            {applications
              .find(a => a.id === parseInt(appId))
              ?.otr && <option value={JSON.stringify(applications.find(a => a.id === parseInt(appId)).otr)}>
              ОТР от {applications.find(a => a.id === parseInt(appId)).otr.tariffType}
            </option>}
          </select>
        </div>
      )}
      {selectedOtr && (
        <>
          <div className="tu-details">
            <h3>Технические условия</h3>
            <p>Напряжение: {selectedOtr.soActivities?.[0]?.voltage || '10 кВ'}</p>
            <p>Структура сети: {selectedOtr.networkStructure?.join(', ') || 'Не заполнено'}</p>
            <h4>Подписывающие лица</h4>
            {tuData.signatories.map((sign, idx) => (
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
            <label>
              <input
                type="checkbox"
                checked={tuData.requiresSso}
                onChange={(e) => setTuData(prev => ({ ...prev, requiresSso: e.target.checked }))}
              /> Требуется заявка в ССО
            </label>
          </div>
          <button onClick={handleCreateTu} className="create-tu-button">
            Создать документ ТУ
          </button>
        </>
      )}
    </div>
  );
};

export default TechnicalConditions;