import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/technical.scss';

const SsoProcess = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="sso-process"><h2>Бизнес-процесс ССО</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="sso-process">
      <h2>Бизнес-процесс ССО</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - ССО в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default SsoProcess;