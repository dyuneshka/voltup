import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/high-voltage-tu.scss';

const HighVoltageTuCheck = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="high-voltage-tu-check"><h2>Проверка исполнения ТУ (свыше 0,4 кВ)</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="high-voltage-tu-check">
      <h2>Проверка исполнения ТУ (свыше 0,4 кВ)</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Проверка в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default HighVoltageTuCheck;