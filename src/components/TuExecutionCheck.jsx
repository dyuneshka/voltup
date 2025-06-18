import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/tu-execution.scss';

const TuExecutionCheck = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="tu-execution-check"><h2>Проверка исполнения ТУ (0,4 кВ)</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="tu-execution-check">
      <h2>Проверка исполнения ТУ (0,4 кВ)</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Проверка в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default TuExecutionCheck;