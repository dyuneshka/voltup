import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/contract.scss';

const ContractProcess = () => {
  const { contracts } = useSelector(state => state.contract);
  const { user } = useSelector(state => state.auth);

  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  return (
    <div className="contract-process">
      <h2>Договоры</h2>
      <ul>
        {contracts.map(c => (
          <li key={c.id}>
            Заявка #{c.applicationId} - {c.cost} руб., Статус: {c.status}, Подписал: {c.signedBy || 'Не подписан'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContractProcess;