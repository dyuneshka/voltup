import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/high-power-tu.scss';

const HighPowerTuCheck = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="high-power-tu-check"><h2>Проверка ТУ (150 кВт - 5 мВт)</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="high-power-tu-check">
      <h2>Проверка ТУ (150 кВт - 5 мВт)</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Проверка в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default HighPowerTuCheck;