import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateConstructionControl } from '../redux/slices/constructionSlice';
import EmployeeLayout from './EmployeeLayout';
import '../styles/construction-control.scss';

const ConstructionControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const { user } = useSelector(state => state.auth);
  const { constructionControl } = useSelector(state => state.construction);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const control = (constructionControl || []).find(cc => cc.applicationId === parseInt(appId)) || {
    id: Date.now(),
    applicationId: parseInt(appId),
    status: 'В процессе',
    currentStep: 1,
    steps: [
      {
        id: 1,
        name: 'Создание титула ИПР',
        status: 'pending',
        description: 'Формирование задачи на привязку объекта к Титулу ИПР',
        completed: false,
        autoCompleted: true
      },
      {
        id: 2,
        name: 'Дозаполнение ОС',
        status: 'pending',
        description: 'Заполнение информации по объекту строительства',
        completed: false,
        autoCompleted: false
      },
      {
        id: 3,
        name: 'Определение способа выполнения работ',
        status: 'pending',
        description: 'Выбор способа: Хоз.способ, Подряд или Рамочный договор',
        completed: false,
        autoCompleted: false,
        options: ['Хоз.способ', 'Подряд', 'Рамочный договор']
      },
      {
        id: 4,
        name: 'Подготовка заявки и документов по РД',
        status: 'pending',
        description: 'Подготовка документов для рамочного договора',
        completed: false,
        autoCompleted: false,
        dependsOn: 'Рамочный договор'
      },
      {
        id: 5,
        name: 'Взаимодействие с подрядчиком',
        status: 'pending',
        description: 'Контроль выполнения работ подрядчиком',
        completed: false,
        autoCompleted: false
      },
      {
        id: 6,
        name: 'Приемка работ',
        status: 'pending',
        description: 'Финальная приемка выполненных работ',
        completed: false,
        autoCompleted: false
      },
      {
        id: 7,
        name: 'Формирование заявки ЦЗО',
        status: 'pending',
        description: 'Подготовка заявки в центральную закупочную организацию',
        completed: false,
        autoCompleted: false,
        dependsOn: 'Подряд'
      },
      {
        id: 8,
        name: 'Проведение конкурса',
        status: 'pending',
        description: 'Проведение конкурсных процедур',
        completed: false,
        autoCompleted: false
      },
      {
        id: 9,
        name: 'Заключение договора подряда',
        status: 'pending',
        description: 'Формирование и регистрация договора подряда',
        completed: false,
        autoCompleted: false
      },
      {
        id: 10,
        name: 'Проверка наличия ТМЦ на складах',
        status: 'pending',
        description: 'Проверка наличия товарно-материальных ценностей',
        completed: false,
        autoCompleted: false,
        dependsOn: 'Хоз.способ'
      },
      {
        id: 11,
        name: 'Проектирование',
        status: 'pending',
        description: 'Проектирование объекта строительства',
        completed: false,
        autoCompleted: false
      },
      {
        id: 12,
        name: 'Проверка наличия РД',
        status: 'pending',
        description: 'Проверка наличия рамочного договора',
        completed: false,
        autoCompleted: false
      },
      {
        id: 13,
        name: 'Заполнение формы результата проверки',
        status: 'pending',
        description: 'Заполнение результатов проверки ТМЦ и РД',
        completed: false,
        autoCompleted: false
      },
      {
        id: 14,
        name: 'Заполнение заявки на поставку по РД',
        status: 'pending',
        description: 'Подготовка заявки на поставку по рамочному договору',
        completed: false,
        autoCompleted: false
      },
      {
        id: 15,
        name: 'Подготовка заявки-спецификации по РД',
        status: 'pending',
        description: 'Подготовка спецификации по рамочному договору',
        completed: false,
        autoCompleted: false
      },
      {
        id: 16,
        name: 'Взаимодействие с поставщиком',
        status: 'pending',
        description: 'Контроль поставки и взаимодействие с поставщиком',
        completed: false,
        autoCompleted: false
      },
      {
        id: 17,
        name: 'Проведение конкурсных процедур',
        status: 'pending',
        description: 'Проведение конкурсных процедур для закупки',
        completed: false,
        autoCompleted: false
      },
      {
        id: 18,
        name: 'Заключение договора на поставку материалов',
        status: 'pending',
        description: 'Формирование договора на поставку материалов',
        completed: false,
        autoCompleted: false
      }
    ],
    selectedWorkMethod: null,
    documents: [],
    createdDate: new Date().toLocaleDateString('ru-RU'),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
  };

  // Убеждаемся, что все массивы существуют
  const safeControl = {
    ...control,
    steps: control.steps || [],
    documents: control.documents || []
  };

  useEffect(() => {
    setCurrentStep(safeControl.currentStep);
  }, [safeControl.currentStep]);

  const handleStepComplete = async (stepId, data = {}) => {
    setIsSubmitting(true);
    try {
      const updatedSteps = safeControl.steps.map(step => {
        if (step.id === stepId) {
          return { ...step, status: 'completed', completed: true, ...data };
        }
        return step;
      });

      const nextStep = updatedSteps.find(step => !step.completed);
      const newCurrentStep = nextStep ? nextStep.id : safeControl.currentStep;

      dispatch(updateConstructionControl({
        id: safeControl.id,
        currentStep: newCurrentStep,
        steps: updatedSteps,
        ...data
      }));

      setCurrentStep(newCurrentStep);
    } catch (error) {
      console.error('Ошибка при выполнении этапа:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkMethodSelect = async (method) => {
    await handleStepComplete(3, { selectedWorkMethod: method });
  };

  const getStepStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in-progress': return 'in-progress';
      case 'pending': return 'pending';
      default: return 'pending';
    }
  };

  const isStepAvailable = (step) => {
    if (step.dependsOn) {
      const methodStep = safeControl.steps.find(s => s.id === 3);
      return methodStep?.completed && methodStep?.selectedWorkMethod === step.dependsOn;
    }
    return true;
  };

  if (!user || user.role !== 'employee') {
    navigate('/');
    return null;
  }

  return (
    <EmployeeLayout 
      title="Контроль технологического присоединения" 
      subtitle={`Заявка #${appId} - Управление строительными работами`}
    >
      <div className="construction-control">
        {/* Основная информация */}
        <div className="control-overview">
          <div className="overview-header">
            <div className="control-id">
              <span className="material-icons">construction</span>
              <h3>Контроль-{safeControl.id}</h3>
            </div>
            <div className={`status-badge ${safeControl.status === 'Завершен' ? 'completed' : 'in-progress'}`}>
              <span className="material-icons">
                {safeControl.status === 'Завершен' ? 'check_circle' : 'pending'}
              </span>
              {safeControl.status}
            </div>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">schedule</span>
              </div>
              <div className="card-content">
                <label>Срок выполнения</label>
                <span className="value">{safeControl.deadline}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">event</span>
              </div>
              <div className="card-content">
                <label>Дата создания</label>
                <span className="value">{safeControl.createdDate}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-icon">
                <span className="material-icons">trending_up</span>
              </div>
              <div className="card-content">
                <label>Прогресс</label>
                <span className="value">
                  {safeControl.steps.filter(s => s.completed).length} / {safeControl.steps.length}
                </span>
              </div>
            </div>

            {safeControl.selectedWorkMethod && (
              <div className="overview-card">
                <div className="card-icon">
                  <span className="material-icons">build</span>
                </div>
                <div className="card-content">
                  <label>Способ выполнения</label>
                  <span className="value">{safeControl.selectedWorkMethod}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(safeControl.steps.filter(s => s.completed).length / safeControl.steps.length) * 100}%` 
              }}
            ></div>
          </div>
          <div className="progress-text">
            Выполнено {safeControl.steps.filter(s => s.completed).length} из {safeControl.steps.length} этапов
          </div>
        </div>

        {/* Этапы процесса */}
        <div className="steps-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">list</span>
              Этапы контроля технологического присоединения
            </h4>
          </div>

          <div className="steps-list">
            {safeControl.steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`step-item ${getStepStatusClass(step.status)} ${!isStepAvailable(step) ? 'disabled' : ''}`}
              >
                <div className="step-header">
                  <div className="step-number">{step.id}</div>
                  <div className="step-info">
                    <h5>{step.name}</h5>
                    <p>{step.description}</p>
                    {step.dependsOn && (
                      <div className="step-dependency">
                        <span className="material-icons">link</span>
                        Зависит от: {step.dependsOn}
                      </div>
                    )}
                  </div>
                  <div className="step-status">
                    {step.completed ? (
                      <span className="material-icons completed">check_circle</span>
                    ) : step.id === currentStep ? (
                      <span className="material-icons in-progress">pending</span>
                    ) : (
                      <span className="material-icons pending">radio_button_unchecked</span>
                    )}
                  </div>
                </div>

                {/* Действия для текущего этапа */}
                {step.id === currentStep && isStepAvailable(step) && !step.completed && (
                  <div className="step-actions">
                    {step.id === 1 && step.autoCompleted && (
                      <button 
                        onClick={() => handleStepComplete(step.id)}
                        className="action-btn auto-complete"
                        disabled={isSubmitting}
                      >
                        <span className="material-icons">auto_awesome</span>
                        Автоматическое выполнение
                      </button>
                    )}

                    {step.id === 3 && step.options && (
                      <div className="work-method-options">
                        <h6>Выберите способ выполнения работ:</h6>
                        <div className="options-grid">
                          {step.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleWorkMethodSelect(option)}
                              className={`option-btn ${safeControl.selectedWorkMethod === option ? 'selected' : ''}`}
                              disabled={isSubmitting}
                            >
                              <span className="material-icons">
                                {option === 'Хоз.способ' ? 'build' : 
                                 option === 'Подряд' ? 'engineering' : 'description'}
                              </span>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.id === 9 && (
                      <div className="manual-completion">
                        <div className="completion-form">
                          <label>Комментарий к выполнению:</label>
                          <textarea 
                            placeholder="Опишите выполненные действия..."
                            rows={3}
                          />
                          <div className="file-upload">
                            <label>Прикрепить документы:</label>
                            <input type="file" multiple />
                          </div>
                        </div>
                        <div className="contract-actions">
                          <button 
                            onClick={() => navigate(`/contract-formation/${appId}`)}
                            className="action-btn contract-formation"
                            disabled={isSubmitting}
                          >
                            <span className="material-icons">description</span>
                            Сформировать договор подряда
                          </button>
                          <button 
                            onClick={() => handleStepComplete(step.id)}
                            className="action-btn complete"
                            disabled={isSubmitting}
                          >
                            <span className="material-icons">check</span>
                            Договор зарегистрирован
                          </button>
                        </div>
                      </div>
                    )}

                    {step.id !== 1 && step.id !== 3 && step.id !== 9 && (
                      <div className="manual-completion">
                        <div className="completion-form">
                          <label>Комментарий к выполнению:</label>
                          <textarea 
                            placeholder="Опишите выполненные действия..."
                            rows={3}
                          />
                          <div className="file-upload">
                            <label>Прикрепить документы:</label>
                            <input type="file" multiple />
                          </div>
                        </div>
                        <button 
                          onClick={() => handleStepComplete(step.id)}
                          className="action-btn complete"
                          disabled={isSubmitting}
                        >
                          <span className="material-icons">check</span>
                          Выполнено
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Информация о выполнении */}
                {step.completed && (
                  <div className="step-completion-info">
                    <div className="completion-details">
                      <span className="completion-date">
                        Выполнено: {new Date().toLocaleDateString('ru-RU')}
                      </span>
                      {step.selectedWorkMethod && (
                        <span className="selected-method">
                          Выбранный способ: {step.selectedWorkMethod}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Документы */}
        <div className="documents-section">
          <div className="section-header">
            <h4>
              <span className="material-icons">attach_file</span>
              Прикрепленные документы
            </h4>
          </div>
          
          <div className="documents-list">
            {safeControl.documents.length > 0 ? (
              safeControl.documents.map((doc, idx) => (
                <div key={idx} className="document-item">
                  <div className="document-icon">
                    <span className="material-icons">description</span>
                  </div>
                  <div className="document-info">
                    <div className="document-name">{doc.name}</div>
                    <div className="document-meta">{doc.type} • {doc.size}</div>
                  </div>
                  <button className="document-download">
                    <span className="material-icons">download</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="no-documents">
                <span className="material-icons">folder_open</span>
                <p>Документы не прикреплены</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ConstructionControl; 