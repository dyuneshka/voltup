import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyApplication } from '../redux/slices/applicationSlice'; // Предполагаемое действие
import '../styles/application-review.scss';

const ApplicationReview = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector(state => state.application);
  const { user } = useSelector(state => state.auth);
  const [selectedApp, setSelectedApp] = useState(null);

  // Эмуляция данных заявок
  useEffect(() => {
    if (applications.length === 0) {
      const mockApplications = [
        { id: 1, applicant: 'ООО "Энергия"', status: 'Подана', documents: ['passport.pdf', 'contract.docx'], verificationStatus: null },
        { id: 2, applicant: 'ИП Иванов', status: 'На проверке', documents: ['invoice.pdf', 'agreement.pdf'], verificationStatus: null },
        { id: 3, applicant: 'ЗАО "Свет"', status: 'Подана', documents: ['id_card.jpg', 'request.pdf'], verificationStatus: null },
      ];
      mockApplications.forEach(app => dispatch(verifyApplication(app.id))); // Эмуляция верификации
    }
  }, [dispatch, applications]);

  const handleVerify = (appId) => {
    const result = Math.random() > 0.3; // 70% шанс успеха
    dispatch(verifyApplication(appId, result ? 'Успешно' : 'Ошибка в документах'));
    setSelectedApp(null);
  };

  if (!user || user.role !== 'employee') {
    return <p>Доступ запрещен.</p>;
  }

  return (
    <div className="application-review">
      <h2>Проверка заявок</h2>
      <ul className="applications-list">
        {applications.map(app => (
          <li key={app.id} className="application-item">
            <span>{app.applicant} - {app.status}</span>
            {app.verificationStatus === null ? (
              <button onClick={() => setSelectedApp(app.id)} className="verify-button">
                Проверить документы
              </button>
            ) : (
              <span className={`verification-status ${app.verificationStatus === 'Успешно' ? 'success' : 'error'}`}>
                {app.verificationStatus}
              </span>
            )}
            {selectedApp === app.id && app.verificationStatus === null && (
              <button onClick={() => handleVerify(app.id)} className="confirm-button">
                Подтвердить верификацию
              </button>
            )}
          </li>
        ))}
      </ul>
      {selectedApp && (
        <div className="document-preview">
          <h3>Документы для проверки</h3>
          <ul>
            {applications.find(app => app.id === selectedApp)?.documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;