import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateContractProject, 
  addNetworkEvent, 
  updateNetworkEvent,
  addConstructionObject,
  updateConstructionObject,
  addTask,
  updateTask,
  bindEventToObject,
  setFilters,
  setActiveTab,
  setSelectedContract,
  setShowCreateObjectModal,
  setShowBindObjectModal
} from '../redux/slices/capitalConstructionSlice';
import '../styles/capital-construction.scss';

const CapitalConstruction = () => {
  const dispatch = useDispatch();
  const { 
    contractProjects, 
    networkEvents, 
    contractConstructionObjects, 
    constructionObjects, 
    tasks, 
    filters, 
    activeTab, 
    selectedContract,
    showCreateObjectModal,
    showBindObjectModal
  } = useSelector(state => state.capitalConstruction);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newObjectData, setNewObjectData] = useState({
    objectName: '',
    contractId: null,
    location: '',
    description: '',
    type: 'Строительство',
    responsible: '',
    budget: 0
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Завершен': return '#4CAF50';
      case 'В работе': return '#2196F3';
      case 'Планирование': return '#FF9800';
      case 'Ожидает': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Высокий': return '#F44336';
      case 'Средний': return '#FF9800';
      case 'Низкий': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getCapitalCostTypeColor = (type) => {
    switch (type) {
      case 'Строительство': return '#2196F3';
      case 'Реконструкция': return '#FF9800';
      case 'Реконструкция и строительство': return '#9C27B0';
      default: return '#757575';
    }
  };

  const filteredContractProjects = contractProjects.filter(contract => {
    if (filters.contractStatus !== 'all' && contract.status !== filters.contractStatus) return false;
    return true;
  });

  const filteredNetworkEvents = networkEvents.filter(event => {
    if (selectedContract && event.contractId !== selectedContract.id) return false;
    if (filters.capitalCostType !== 'all' && event.capitalCostType !== filters.capitalCostType) return false;
    return true;
  });

  const filteredContractObjects = contractConstructionObjects.filter(obj => {
    if (selectedContract && obj.contractId !== selectedContract.id) return false;
    if (filters.objectStatus !== 'all' && obj.status !== filters.objectStatus) return false;
    return true;
  });

  const filteredTasks = tasks.filter(task => {
    if (selectedObject && task.objectId !== selectedObject.id) return false;
    if (filters.taskStatus !== 'all' && task.status !== filters.taskStatus) return false;
    return true;
  });

  const handleCreateObject = () => {
    if (newObjectData.objectName && newObjectData.contractId) {
      dispatch(addConstructionObject(newObjectData));
      setNewObjectData({
        objectName: '',
        contractId: null,
        location: '',
        description: '',
        type: 'Строительство',
        responsible: '',
        budget: 0
      });
      dispatch(setShowCreateObjectModal(false));
    }
  };

  const handleBindObject = (eventId, objectId) => {
    dispatch(bindEventToObject({ eventId, objectId }));
    dispatch(setShowBindObjectModal(false));
  };

  const handleTaskComplete = (taskId) => {
    dispatch(updateTask({ 
      id: taskId, 
      updates: { 
        status: 'Выполнена', 
        completedDate: new Date().toISOString().split('T')[0] 
      } 
    }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const renderContractsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Статус договоров:</label>
          <select 
            value={filters.contractStatus} 
            onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
          >
            <option value="all">Все договоры</option>
            <option value="Планирование">Планирование</option>
            <option value="В работе">В работе</option>
            <option value="Завершен">Завершен</option>
          </select>
        </div>
      </div>

      <div className="contracts-grid">
        {filteredContractProjects.map(contract => (
          <div 
            key={contract.id} 
            className={`contract-card ${selectedContract?.id === contract.id ? 'selected' : ''}`}
            onClick={() => dispatch(setSelectedContract(contract))}
          >
            <div className="card-header">
              <div className="contract-info">
                <h3>{contract.contractNumber}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(contract.status) }}
                >
                  {contract.status}
                </span>
              </div>
              <div className="oks-flag">
                <span className="flag-icon">🏗️</span>
                <span className="flag-text">ОКС</span>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Заявитель:</span>
                <span className="value">{contract.applicantName}</span>
              </div>
              <div className="info-row">
                <span className="label">Адрес:</span>
                <span className="value">{contract.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Мощность:</span>
                <span className="value">{contract.power}</span>
              </div>
              <div className="info-row">
                <span className="label">Ответственный:</span>
                <span className="value">{contract.responsible}</span>
              </div>
              <div className="info-row">
                <span className="label">Бюджет:</span>
                <span className="value">{contract.budget.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Прогресс выполнения</span>
                <span className="progress-percentage">{contract.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${contract.progress}%`, backgroundColor: getStatusColor(contract.status) }}
                ></div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-primary">
                <span className="icon">👁️</span>
                Просмотр
              </button>
              <button className="btn-secondary">
                <span className="icon">📋</span>
                Мероприятия
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Тип капитальных затрат:</label>
          <select 
            value={filters.capitalCostType} 
            onChange={(e) => handleFilterChange('capitalCostType', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="Строительство">Строительство</option>
            <option value="Реконструкция">Реконструкция</option>
            <option value="Реконструкция и строительство">Реконструкция и строительство</option>
          </select>
        </div>
      </div>

      <div className="events-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="cell">Мероприятие</div>
            <div className="cell">Тип затрат</div>
            <div className="cell">Объект строительства</div>
            <div className="cell">Статус</div>
            <div className="cell">Ответственный</div>
            <div className="cell">Бюджет</div>
            <div className="cell">Прогресс</div>
            <div className="cell">Действия</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredNetworkEvents.map(event => (
            <div key={event.id} className="table-row">
              <div className="cell">
                <div className="event-info">
                  <span className="event-name">{event.eventName}</span>
                  <span className="event-description">{event.description}</span>
                </div>
              </div>
              
              <div className="cell">
                <span 
                  className="cost-type-badge"
                  style={{ backgroundColor: getCapitalCostTypeColor(event.capitalCostType) }}
                >
                  {event.capitalCostType}
                </span>
              </div>
              
              <div className="cell">
                <span className="construction-object">
                  {event.constructionObject || 'Не привязан'}
                </span>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {event.status}
                </span>
              </div>
              
              <div className="cell">
                <span className="responsible">{event.responsible}</span>
              </div>
              
              <div className="cell">
                <span className="budget">{event.budget.toLocaleString()} ₽</span>
              </div>
              
              <div className="cell">
                <div className="progress-info">
                  <span className="progress-percentage">{event.progress}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${event.progress}%`, backgroundColor: getStatusColor(event.status) }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="cell">
                <div className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => setSelectedEvent(event)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-bind"
                    onClick={() => dispatch(setShowBindObjectModal(true))}
                    title="Привязать объект"
                  >
                    🔗
                  </button>
                  <button 
                    className="btn-otr"
                    title="Открыть ОТР"
                  >
                    📄
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContractObjectsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Статус объектов:</label>
          <select 
            value={filters.objectStatus} 
            onChange={(e) => handleFilterChange('objectStatus', e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="Планирование">Планирование</option>
            <option value="В работе">В работе</option>
            <option value="Завершен">Завершен</option>
          </select>
        </div>
      </div>

      <div className="objects-grid">
        {filteredContractObjects.map(obj => (
          <div 
            key={obj.id} 
            className={`object-card ${selectedObject?.id === obj.id ? 'selected' : ''}`}
            onClick={() => setSelectedObject(obj)}
          >
            <div className="card-header">
              <div className="object-info">
                <h3>{obj.objectNumber}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(obj.status) }}
                >
                  {obj.status}
                </span>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Наименование:</span>
                <span className="value">{obj.objectName}</span>
              </div>
              <div className="info-row">
                <span className="label">Местоположение:</span>
                <span className="value">{obj.location}</span>
              </div>
              <div className="info-row">
                <span className="label">Ответственный:</span>
                <span className="value">{obj.responsible}</span>
              </div>
              <div className="info-row">
                <span className="label">Бюджет:</span>
                <span className="value">{obj.budget.toLocaleString()} ₽</span>
              </div>
              <div className="info-row">
                <span className="label">Мероприятий:</span>
                <span className="value">{obj.events.length}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Прогресс выполнения</span>
                <span className="progress-percentage">{obj.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${obj.progress}%`, backgroundColor: getStatusColor(obj.status) }}
                ></div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-primary">
                <span className="icon">👁️</span>
                Просмотр
              </button>
              <button className="btn-secondary">
                <span className="icon">📋</span>
                Задачи
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderObjectsTab = () => (
    <div className="tab-content">
      <div className="objects-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="cell">Номер объекта</div>
            <div className="cell">Наименование</div>
            <div className="cell">Тип</div>
            <div className="cell">Статус</div>
            <div className="cell">Ответственный</div>
            <div className="cell">Бюджет</div>
            <div className="cell">Прогресс</div>
            <div className="cell">Действия</div>
          </div>
        </div>
        
        <div className="table-body">
          {constructionObjects.map(obj => (
            <div key={obj.id} className="table-row">
              <div className="cell">
                <span className="object-number">{obj.objectNumber}</span>
              </div>
              
              <div className="cell">
                <div className="object-info">
                  <span className="object-name">{obj.objectName}</span>
                  <span className="object-location">{obj.location}</span>
                </div>
              </div>
              
              <div className="cell">
                <span className="object-type">{obj.type}</span>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(obj.status) }}
                >
                  {obj.status}
                </span>
              </div>
              
              <div className="cell">
                <span className="responsible">{obj.responsible}</span>
              </div>
              
              <div className="cell">
                <span className="budget">{obj.budget.toLocaleString()} ₽</span>
              </div>
              
              <div className="cell">
                <div className="progress-info">
                  <span className="progress-percentage">{obj.progress}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${obj.progress}%`, backgroundColor: getStatusColor(obj.status) }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="cell">
                <div className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => setSelectedObject(obj)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-view"
                    title="Просмотр"
                  >
                    👁️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Статус задач:</label>
          <select 
            value={filters.taskStatus} 
            onChange={(e) => handleFilterChange('taskStatus', e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="Ожидает">Ожидает</option>
            <option value="В работе">В работе</option>
            <option value="Выполнена">Выполнена</option>
          </select>
        </div>
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className={`task-card ${selectedTask?.id === task.id ? 'selected' : ''}`}
            onClick={() => setSelectedTask(task)}
          >
            <div className="card-header">
              <div className="task-info">
                <h3>{task.taskName}</h3>
                <div className="task-badges">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-content">
              <div className="info-row">
                <span className="label">Описание:</span>
                <span className="value">{task.description}</span>
              </div>
              <div className="info-row">
                <span className="label">Исполнитель:</span>
                <span className="value">{task.assignedTo}</span>
              </div>
              <div className="info-row">
                <span className="label">Сроки:</span>
                <span className="value">{task.startDate} - {task.endDate}</span>
              </div>
              {task.completedDate && (
                <div className="info-row">
                  <span className="label">Завершена:</span>
                  <span className="value completed">{task.completedDate}</span>
                </div>
              )}
            </div>

            <div className="card-actions">
              {task.status !== 'Выполнена' && (
                <button 
                  className="btn-complete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskComplete(task.id);
                  }}
                >
                  <span className="icon">✅</span>
                  Завершить
                </button>
              )}
              <button className="btn-primary">
                <span className="icon">👁️</span>
                Просмотр
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="capital-construction">
      {/* Заголовок с градиентом */}
      <div className="construction-header">
        <div className="header-content">
          <h1>
            <span className="icon">🏗️</span>
            Рабочий стол сотрудника ОКС
          </h1>
          <p>Управление объектами капитального строительства и контролем технологического присоединения</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{contractProjects.length}</span>
            <span className="stat-label">Договоров</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{constructionObjects.length}</span>
            <span className="stat-label">Объектов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{tasks.filter(t => t.status !== 'Выполнена').length}</span>
            <span className="stat-label">Активных задач</span>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="tabs-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contracts')}
          >
            <span className="icon">📋</span>
            Проекты договоров
          </button>
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => handleTabChange('events')}
          >
            <span className="icon">⚡</span>
            Мероприятия
          </button>
          <button 
            className={`tab ${activeTab === 'contractObjects' ? 'active' : ''}`}
            onClick={() => handleTabChange('contractObjects')}
          >
            <span className="icon">🏢</span>
            Объекты по договору
          </button>
          <button 
            className={`tab ${activeTab === 'objects' ? 'active' : ''}`}
            onClick={() => handleTabChange('objects')}
          >
            <span className="icon">🏗️</span>
            Объекты строительства
          </button>
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => handleTabChange('tasks')}
          >
            <span className="icon">✅</span>
            Задачи
          </button>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="actions-section">
        <button 
          className="btn-add"
          onClick={() => dispatch(setShowCreateObjectModal(true))}
        >
          <span className="icon">➕</span>
          Создать объект строительства
        </button>
        <button 
          className="btn-bind"
          onClick={() => dispatch(setShowBindObjectModal(true))}
        >
          <span className="icon">🔗</span>
          Привязать объект
        </button>
      </div>

      {/* Контент вкладок */}
      {activeTab === 'contracts' && renderContractsTab()}
      {activeTab === 'events' && renderEventsTab()}
      {activeTab === 'contractObjects' && renderContractObjectsTab()}
      {activeTab === 'objects' && renderObjectsTab()}
      {activeTab === 'tasks' && renderTasksTab()}

      {/* Модальное окно создания объекта */}
      {showCreateObjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Создание нового объекта строительства</h3>
              <button 
                className="close-btn"
                onClick={() => dispatch(setShowCreateObjectModal(false))}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Наименование объекта:</label>
                <input 
                  type="text"
                  value={newObjectData.objectName}
                  onChange={(e) => setNewObjectData({...newObjectData, objectName: e.target.value})}
                  placeholder="Введите наименование объекта"
                />
              </div>
              
              <div className="form-group">
                <label>Договор:</label>
                <select 
                  value={newObjectData.contractId || ''}
                  onChange={(e) => setNewObjectData({...newObjectData, contractId: Number(e.target.value)})}
                >
                  <option value="">Выберите договор</option>
                  {contractProjects.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contractNumber} - {contract.applicantName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Местоположение:</label>
                <input 
                  type="text"
                  value={newObjectData.location}
                  onChange={(e) => setNewObjectData({...newObjectData, location: e.target.value})}
                  placeholder="Введите адрес объекта"
                />
              </div>
              
              <div className="form-group">
                <label>Описание:</label>
                <textarea 
                  value={newObjectData.description}
                  onChange={(e) => setNewObjectData({...newObjectData, description: e.target.value})}
                  placeholder="Описание объекта"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Тип объекта:</label>
                <select 
                  value={newObjectData.type}
                  onChange={(e) => setNewObjectData({...newObjectData, type: e.target.value})}
                >
                  <option value="Строительство">Строительство</option>
                  <option value="Реконструкция">Реконструкция</option>
                  <option value="Реконструкция и строительство">Реконструкция и строительство</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Ответственный:</label>
                <input 
                  type="text"
                  value={newObjectData.responsible}
                  onChange={(e) => setNewObjectData({...newObjectData, responsible: e.target.value})}
                  placeholder="ФИО ответственного"
                />
              </div>
              
              <div className="form-group">
                <label>Бюджет (₽):</label>
                <input 
                  type="number"
                  value={newObjectData.budget}
                  onChange={(e) => setNewObjectData({...newObjectData, budget: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => dispatch(setShowCreateObjectModal(false))}
              >
                Отмена
              </button>
              <button 
                className="btn-save"
                onClick={handleCreateObject}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно привязки объекта */}
      {showBindObjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Привязка мероприятия к объекту строительства</h3>
              <button 
                className="close-btn"
                onClick={() => dispatch(setShowBindObjectModal(false))}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Выберите мероприятие:</label>
                <select>
                  <option value="">Выберите мероприятие</option>
                  {networkEvents.filter(e => !e.constructionObject).map(event => (
                    <option key={event.id} value={event.id}>
                      {event.eventName} - {event.capitalCostType}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Выберите объект строительства:</label>
                <select>
                  <option value="">Выберите объект</option>
                  {constructionObjects.map(obj => (
                    <option key={obj.id} value={obj.id}>
                      {obj.objectNumber} - {obj.objectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => dispatch(setShowBindObjectModal(false))}
              >
                Отмена
              </button>
              <button 
                className="btn-save"
                onClick={() => handleBindObject(1, 1)}
              >
                Привязать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapitalConstruction; 