import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { approveTechnicalCondition, createContractProcess } from '../redux/slices/technicalSlice'; // Добавлен импорт
import '../styles/technical.scss';

const TechnicalApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);

  const tc = technicalConditions.find(tc => tc.applicationId === parseInt(appId)) || {
    id: Date.now(),
    applicationId: parseInt(appId),
    voltage: '10 кВ',
    status: 'На согласовании',
    conditions: 'Условия для подключения объекта на 500 кВт',
    signatories: [{ id: 1, name: 'Петров А.А.', position: 'Главный инженер' }],
    createdDate: '18.06.2025',
  };

  const handleApprove = (status) => {
    dispatch(approveTechnicalCondition({ id: tc.id, status, comment }));
    setResult(status);
    setComment('');
    if (status === 'Согласовано') {
      dispatch(createContractProcess({ id: tc.id, contractProcessStarted: true }));
      navigate(`/contract/${appId}`);
    }
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="technical-approval">
      <h2>Согласование и утверждение ТУ для заявки #{appId}</h2>
      <div className="tu-details">
        <p>Напряжение: {tc.voltage}</p>
        <p>Статус: {tc.status}</p>
        <p>Условия: {tc.conditions}</p>
        <p>Дата создания: {tc.createdDate}</p>
        <h4>Подписывающие лица</h4>
        <ul>
          {tc.signatories.map(sign => (
            <li key={sign.id}>{sign.name} - {sign.position}</li>
          ))}
        </ul>
      </div>
      {!result && (
        <>
          <div className="approval-actions">
            <button onClick={() => handleApprove('Согласовано')} className="approve-button">Согласовано</button>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Укажите замечания (например, уточнить напряжение)"
              className="form-input"
            />
            <button onClick={() => handleApprove('Есть замечания')} className="reject-button">Есть замечания</button>
            <button onClick={() => handleApprove('Требуется изменение')} className="revise-button">Требуется изменение</button>
          </div>
        </>
      )}
      {result && <p>Результат: {result} {comment && `- Комментарий: ${comment}`}</p>}
    </div>
  );
};

export default TechnicalApproval;