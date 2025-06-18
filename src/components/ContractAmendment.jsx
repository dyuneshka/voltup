import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/contract-amendment.scss';

const ContractAmendment = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="contract-amendment"><h2>Заключение Доп. Соглашения</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="contract-amendment">
      <h2>Заключение Доп. Соглашения</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Доп. Соглашение в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default ContractAmendment;