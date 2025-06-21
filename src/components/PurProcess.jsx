import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/pur-process.scss';

const PurProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);

  const handleCompletePur = () => {
    dispatch(updateTechnicalCondition({ id: technicalConditions.find(tc => tc.applicationId === parseInt(appId)).id, contractStep: 'completed' }));
    navigate(`/contract/${appId}`);
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <div className="pur-process">
      <h2>Подготовка ПУР для заявки #{appId}</h2>
      <p>Этот процесс пока в разработке. Добавьте логику подготовки ПУР здесь.</p>
      <button onClick={handleCompletePur} className="next-button">Завершить ПУР</button>
    </div>
  );
};

export default PurProcess;