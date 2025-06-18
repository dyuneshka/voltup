import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/contract.scss';

const DiscrepancyProcess = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="discrepancy-process"><h2>Протокол разногласий и ПУР</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="discrepancy-process">
      <h2>Протокол разногласий и ПУР</h2>
      <ul>
        {applications.filter(app => app.status === 'На проверке').map(app => (
          <li key={app.id}>{app.name} - Разногласия в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default DiscrepancyProcess;