import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateTechnicalCondition } from '../redux/slices/technicalSlice';
import '../styles/pur-process.scss';

const PurProcess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { technicalConditions } = useSelector(state => state.technical);
  const [purData, setPurData] = useState({
    projectName: '',
    customer: '',
    power: '',
    voltage: '',
    connectionPoint: '',
    constructionType: '',
    estimatedCost: '',
    timeline: '',
    documents: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Эмуляция загрузки данных заявки
    if (appId) {
      setPurData(prev => ({
        ...prev,
        projectName: `Проект ПУР для заявки #${appId}`,
        customer: 'ООО "Энергия"',
        power: '500 кВт',
        voltage: '10 кВ',
        connectionPoint: 'ТП-10/0.4 кВ "Центральная"',
        constructionType: 'Воздушная линия',
        estimatedCost: '2,500,000 руб.',
        timeline: '6 месяцев'
      }));
    }
  }, [appId]);

  const handleInputChange = (field, value) => {
    setPurData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setPurData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))]
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompletePur = async () => {
    setIsSubmitting(true);
    try {
      // Эмуляция отправки данных
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch(updateTechnicalCondition({ 
        id: technicalConditions.find(tc => tc.applicationId === parseInt(appId))?.id, 
        contractStep: 'completed' 
      }));
      
      navigate(`/contract/${appId}`);
    } catch (error) {
      console.error('Ошибка при создании ПУР:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  const steps = [
    { number: 1, title: 'Основная информация', icon: 'info' },
    { number: 2, title: 'Технические характеристики', icon: 'engineering' },
    { number: 3, title: 'Экономические показатели', icon: 'account_balance' },
    { number: 4, title: 'Документы и завершение', icon: 'description' }
  ];

  return (
    <div className="pur-process">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">assignment</span>
            Подготовка ПУР
          </h1>
          <p className="page-subtitle">
            Подготовка проекта технического присоединения для заявки #{appId}
          </p>
        </div>
      </div>

      <div className="page-content">
        {/* Прогресс-бар */}
        <div className="progress-section">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                <div className="step-icon">
                  <span className="material-icons">{step.icon}</span>
                </div>
                <div className="step-info">
                  <span className="step-number">{step.number}</span>
                  <span className="step-title">{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Форма ПУР */}
        <div className="form-container">
          {currentStep === 1 && (
            <div className="form-step">
              <h3 className="step-header">
                <span className="material-icons">info</span>
                Основная информация
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Название проекта</label>
                  <input
                    type="text"
                    value={purData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="form-input"
                    placeholder="Введите название проекта"
                  />
                </div>
                
                <div className="form-group">
                  <label>Заказчик</label>
                  <input
                    type="text"
                    value={purData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className="form-input"
                    placeholder="Введите название заказчика"
                  />
                </div>
                
                <div className="form-group">
                  <label>Мощность</label>
                  <input
                    type="text"
                    value={purData.power}
                    onChange={(e) => handleInputChange('power', e.target.value)}
                    className="form-input"
                    placeholder="Введите мощность"
                  />
                </div>
                
                <div className="form-group">
                  <label>Напряжение</label>
                  <input
                    type="text"
                    value={purData.voltage}
                    onChange={(e) => handleInputChange('voltage', e.target.value)}
                    className="form-input"
                    placeholder="Введите напряжение"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h3 className="step-header">
                <span className="material-icons">engineering</span>
                Технические характеристики
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Точка присоединения</label>
                  <input
                    type="text"
                    value={purData.connectionPoint}
                    onChange={(e) => handleInputChange('connectionPoint', e.target.value)}
                    className="form-input"
                    placeholder="Введите точку присоединения"
                  />
                </div>
                
                <div className="form-group">
                  <label>Тип строительства</label>
                  <select
                    value={purData.constructionType}
                    onChange={(e) => handleInputChange('constructionType', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Выберите тип</option>
                    <option value="Воздушная линия">Воздушная линия</option>
                    <option value="Кабельная линия">Кабельная линия</option>
                    <option value="Подстанция">Подстанция</option>
                    <option value="Комбинированный">Комбинированный</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h3 className="step-header">
                <span className="material-icons">account_balance</span>
                Экономические показатели
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Сметная стоимость</label>
                  <input
                    type="text"
                    value={purData.estimatedCost}
                    onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                    className="form-input"
                    placeholder="Введите сметную стоимость"
                  />
                </div>
                
                <div className="form-group">
                  <label>Срок выполнения</label>
                  <input
                    type="text"
                    value={purData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="form-input"
                    placeholder="Введите срок выполнения"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h3 className="step-header">
                <span className="material-icons">description</span>
                Документы и завершение
              </h3>
              
              <div className="form-group">
                <label>Загрузка документов</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="material-icons">cloud_upload</span>
                    <span>Выберите файлы или перетащите их сюда</span>
                  </label>
                </div>
                
                {purData.documents.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Загруженные файлы:</h4>
                    <ul>
                      {purData.documents.map((doc, index) => (
                        <li key={index}>
                          <span className="material-icons">description</span>
                          <span>{doc.name}</span>
                          <span className="file-size">({(doc.size / 1024).toFixed(1)} KB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Навигация по шагам */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button onClick={handlePrevStep} className="nav-btn prev-btn">
                <span className="material-icons">arrow_back</span>
                Назад
              </button>
            )}
            
            {currentStep < 4 ? (
              <button onClick={handleNextStep} className="nav-btn next-btn">
                Далее
                <span className="material-icons">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={handleCompletePur} 
                className="nav-btn complete-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-icons rotating">refresh</span>
                    Создание ПУР...
                  </>
                ) : (
                  <>
                    <span className="material-icons">check_circle</span>
                    Завершить ПУР
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurProcess;