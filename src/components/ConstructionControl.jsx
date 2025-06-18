import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/construction.scss';

const ConstructionControl = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="construction-control"><h2>Контроль технологического присоединения</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="construction-control">
      <h2>Контроль технологического присоединения</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Контроль в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default ConstructionControl;