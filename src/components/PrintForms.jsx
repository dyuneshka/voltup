import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/print-forms.scss';

const PrintForms = () => {
  const { applications } = useSelector(state => state.auth);

  if (!applications || !applications.length) {
    return <div className="print-forms"><h2>Формирование печатных форм</h2><p>Нет заявок для обработки.</p></div>;
  }

  return (
    <div className="print-forms">
      <h2>Формирование печатных форм</h2>
      <ul>
        {applications.filter(app => app.status === 'Одобрена').map(app => (
          <li key={app.id}>{app.name} - Форма готова</li>
        ))}
      </ul>
    </div>
  );
};

export default PrintForms;