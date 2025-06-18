import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/other-applicants-tu.scss';

const OtherApplicantsTuCheck = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="other-applicants-tu-check"><h2>Проверка ТУ (иные до 150 кВт)</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="other-applicants-tu-check">
      <h2>Проверка ТУ (иные до 150 кВт)</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Проверка в процессе</li>
        ))}
      </ul>
    </div>
  );
};

export default OtherApplicantsTuCheck;