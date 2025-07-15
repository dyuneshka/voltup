import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTariff, 
  updateTariff, 
  deleteTariff, 
  setFilters, 
  setActiveTab, 
  setShowAddForm,
  toggleTariffStatus
} from '../redux/slices/tariffManagementSlice';
import '../styles/tariff-management.scss';

const TariffManagement = () => {
  const dispatch = useDispatch();
  const { 
    tariffs, 
    workTypes, 
    capitalCostTypes, 
    filters, 
    activeTab, 
    showAddForm 
  } = useSelector(state => state.tariffManagement);
  
  const [editingTariff, setEditingTariff] = useState(null);
  const [formData, setFormData] = useState({
    voltage: 'НН',
    powerFrom: 0,
    powerTo: '',
    settlementType: 'Городской',
    rate: 'С1',
    workType: '',
    capitalCostType: '',
    costIndex: 1.0,
    ratePerKw: 0,
    standardizedRate: 0,
    multiplyByIndex: false,
    multiplyByPower: true,
    multiplyByQuantity: false
  });

  const getVoltageColor = (voltage) => {
    switch (voltage) {
      case 'НН': return '#4CAF50';
      case 'СН2': return '#2196F3';
      case 'СН1': return '#FF9800';
      case 'ВН': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Активный' ? '#4CAF50' : '#F44336';
  };

  const getSettlementTypeColor = (type) => {
    return type === 'Городской' ? '#2196F3' : '#FF9800';
  };

  const filteredTariffs = tariffs.filter(tariff => {
    if (filters.voltage !== 'all' && tariff.voltage !== filters.voltage) return false;
    if (filters.settlementType !== 'all' && tariff.settlementType !== filters.settlementType) return false;
    if (filters.status !== 'all' && tariff.status !== filters.status) return false;
    if (filters.workType !== 'all' && tariff.workType !== filters.workType) return false;
    return true;
  });

  const handleAddTariff = () => {
    dispatch(addTariff(formData));
    setFormData({
      voltage: 'НН',
      powerFrom: 0,
      powerTo: '',
      settlementType: 'Городской',
      rate: 'С1',
      workType: '',
      capitalCostType: '',
      costIndex: 1.0,
      ratePerKw: 0,
      standardizedRate: 0,
      multiplyByIndex: false,
      multiplyByPower: true,
      multiplyByQuantity: false
    });
    dispatch(setShowAddForm(false));
  };

  const handleUpdateTariff = () => {
    dispatch(updateTariff({ id: editingTariff.id, updates: formData }));
    setEditingTariff(null);
    setFormData({
      voltage: 'НН',
      powerFrom: 0,
      powerTo: '',
      settlementType: 'Городской',
      rate: 'С1',
      workType: '',
      capitalCostType: '',
      costIndex: 1.0,
      ratePerKw: 0,
      standardizedRate: 0,
      multiplyByIndex: false,
      multiplyByPower: true,
      multiplyByQuantity: false
    });
  };

  const handleEditTariff = (tariff) => {
    setEditingTariff(tariff);
    setFormData({
      voltage: tariff.voltage,
      powerFrom: tariff.powerFrom,
      powerTo: tariff.powerTo || '',
      settlementType: tariff.settlementType,
      rate: tariff.rate,
      workType: tariff.workType,
      capitalCostType: tariff.capitalCostType,
      costIndex: tariff.costIndex,
      ratePerKw: tariff.ratePerKw,
      standardizedRate: tariff.standardizedRate,
      multiplyByIndex: tariff.multiplyByIndex,
      multiplyByPower: tariff.multiplyByPower,
      multiplyByQuantity: tariff.multiplyByQuantity
    });
  };

  const handleDeleteTariff = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тариф?')) {
      dispatch(deleteTariff(id));
    }
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const getVoltageDescription = (voltage) => {
    switch (voltage) {
      case 'НН': return 'до 0,4 кВ';
      case 'СН2': return 'от 1 до 20 кВ';
      case 'СН1': return '35 кВ';
      case 'ВН': return '110 кВ и выше';
      default: return '';
    }
  };

  return (
    <div className="tariff-management">
      {/* Заголовок с градиентом */}
      <div className="tariff-header">
        <div className="header-content">
          <h1>
            <span className="icon">💰</span>
            Управление Тарифами на ТП
          </h1>
          <p>Настройка тарифных ставок для технологического присоединения</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{tariffs.length}</span>
            <span className="stat-label">Всего тарифов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {tariffs.filter(t => t.status === 'Активный').length}
            </span>
            <span className="stat-label">Активных</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {tariffs.filter(t => t.status === 'Неактивный').length}
            </span>
            <span className="stat-label">Неактивных</span>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="tabs-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => handleTabChange('new')}
          >
            <span className="icon">🆕</span>
            Тарифы новые
          </button>
          <button 
            className={`tab ${activeTab === 'old' ? 'active' : ''}`}
            onClick={() => handleTabChange('old')}
          >
            <span className="icon">📋</span>
            Тарифы
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Напряжение:</label>
            <select 
              value={filters.voltage} 
              onChange={(e) => handleFilterChange('voltage', e.target.value)}
            >
              <option value="all">Все напряжения</option>
              <option value="НН">НН (до 0,4 кВ)</option>
              <option value="СН2">СН2 (от 1 до 20 кВ)</option>
              <option value="СН1">СН1 (35 кВ)</option>
              <option value="ВН">ВН (110 кВ и выше)</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Тип населенного пункта:</label>
            <select 
              value={filters.settlementType} 
              onChange={(e) => handleFilterChange('settlementType', e.target.value)}
            >
              <option value="all">Все типы</option>
              <option value="Городской">Городской</option>
              <option value="Сельский">Сельский</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Статус:</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="Активный">Активный</option>
              <option value="Неактивный">Неактивный</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Вид работ:</label>
            <select 
              value={filters.workType} 
              onChange={(e) => handleFilterChange('workType', e.target.value)}
            >
              <option value="all">Все виды работ</option>
              {workTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Кнопка добавления */}
      <div className="actions-section">
        <button 
          className="btn-add"
          onClick={() => dispatch(setShowAddForm(true))}
        >
          <span className="icon">➕</span>
          Добавить тариф
        </button>
      </div>

      {/* Форма добавления/редактирования */}
      {(showAddForm || editingTariff) && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3>{editingTariff ? 'Редактирование тарифа' : 'Добавление нового тарифа'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  dispatch(setShowAddForm(false));
                  setEditingTariff(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Напряжение:</label>
                  <select 
                    value={formData.voltage}
                    onChange={(e) => setFormData({...formData, voltage: e.target.value})}
                  >
                    <option value="НН">НН (до 0,4 кВ)</option>
                    <option value="СН2">СН2 (от 1 до 20 кВ)</option>
                    <option value="СН1">СН1 (35 кВ)</option>
                    <option value="ВН">ВН (110 кВ и выше)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Мощность от (кВт):</label>
                  <input 
                    type="number"
                    value={formData.powerFrom}
                    onChange={(e) => setFormData({...formData, powerFrom: Number(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Мощность до (кВт):</label>
                  <input 
                    type="number"
                    value={formData.powerTo}
                    onChange={(e) => setFormData({...formData, powerTo: e.target.value ? Number(e.target.value) : ''})}
                    placeholder="Без ограничений"
                  />
                </div>
                
                <div className="form-group">
                  <label>Тип населенного пункта:</label>
                  <select 
                    value={formData.settlementType}
                    onChange={(e) => setFormData({...formData, settlementType: e.target.value})}
                  >
                    <option value="Городской">Городской</option>
                    <option value="Сельский">Сельский</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Ставка:</label>
                  <input 
                    type="text"
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                    placeholder="С1, С2, С3, С4"
                  />
                </div>
                
                <div className="form-group">
                  <label>Вид работы по ТП:</label>
                  <select 
                    value={formData.workType}
                    onChange={(e) => setFormData({...formData, workType: e.target.value})}
                  >
                    <option value="">Выберите вид работ</option>
                    {workTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Вид капитальных затрат:</label>
                  <select 
                    value={formData.capitalCostType}
                    onChange={(e) => setFormData({...formData, capitalCostType: e.target.value})}
                  >
                    <option value="">Выберите вид затрат</option>
                    {capitalCostTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Индекс сметной стоимости:</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={formData.costIndex}
                    onChange={(e) => setFormData({...formData, costIndex: Number(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Ставка (руб./кВт):</label>
                  <input 
                    type="number"
                    value={formData.ratePerKw}
                    onChange={(e) => setFormData({...formData, ratePerKw: Number(e.target.value)})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Стандартизированная ставка:</label>
                  <input 
                    type="number"
                    value={formData.standardizedRate}
                    onChange={(e) => setFormData({...formData, standardizedRate: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="form-checkboxes">
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={formData.multiplyByIndex}
                      onChange={(e) => setFormData({...formData, multiplyByIndex: e.target.checked})}
                    />
                    Умножать на индекс
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={formData.multiplyByPower}
                      onChange={(e) => setFormData({...formData, multiplyByPower: e.target.checked})}
                    />
                    Умножать на мощность
                  </label>
                </div>
                <div className="checkbox-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={formData.multiplyByQuantity}
                      onChange={(e) => setFormData({...formData, multiplyByQuantity: e.target.checked})}
                    />
                    Умножать на количество
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  dispatch(setShowAddForm(false));
                  setEditingTariff(null);
                }}
              >
                Отмена
              </button>
              <button 
                className="btn-save"
                onClick={editingTariff ? handleUpdateTariff : handleAddTariff}
              >
                {editingTariff ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Таблица тарифов */}
      <div className="tariffs-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="cell">Напряжение</div>
            <div className="cell">Мощность</div>
            <div className="cell">Тип нас. пункта</div>
            <div className="cell">Ставка</div>
            <div className="cell">Вид работы</div>
            <div className="cell">Ставка (руб./кВт)</div>
            <div className="cell">Статус</div>
            <div className="cell">Действия</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredTariffs.map(tariff => (
            <div key={tariff.id} className="table-row">
              <div className="cell">
                <div className="voltage-info">
                  <span 
                    className="voltage-badge"
                    style={{ backgroundColor: getVoltageColor(tariff.voltage) }}
                  >
                    {tariff.voltage}
                  </span>
                  <span className="voltage-description">{getVoltageDescription(tariff.voltage)}</span>
                </div>
              </div>
              
              <div className="cell">
                <div className="power-range">
                  {tariff.powerFrom} - {tariff.powerTo || '∞'} кВт
                </div>
              </div>
              
              <div className="cell">
                <span 
                  className="settlement-type"
                  style={{ color: getSettlementTypeColor(tariff.settlementType) }}
                >
                  {tariff.settlementType}
                </span>
              </div>
              
              <div className="cell">
                <span className="rate">{tariff.rate}</span>
              </div>
              
              <div className="cell">
                <div className="work-type">
                  <span className="work-name">{tariff.workType}</span>
                  <span className="capital-cost">{tariff.capitalCostType}</span>
                </div>
              </div>
              
              <div className="cell">
                <div className="rate-info">
                  <span className="rate-per-kw">{tariff.ratePerKw.toLocaleString()} ₽/кВт</span>
                  <span className="standardized-rate">
                    Стандарт: {tariff.standardizedRate.toLocaleString()} ₽
                  </span>
                </div>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(tariff.status) }}
                >
                  {tariff.status}
                </span>
              </div>
              
              <div className="cell">
                <div className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditTariff(tariff)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-toggle"
                    onClick={() => dispatch(toggleTariffStatus(tariff.id))}
                    title={tariff.status === 'Активный' ? 'Деактивировать' : 'Активировать'}
                  >
                    {tariff.status === 'Активный' ? '🔴' : '🟢'}
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTariff(tariff.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Информационная панель */}
      <div className="info-panel">
        <div className="info-section">
          <h4>📋 Инструкция по заполнению</h4>
          <ul>
            <li><strong>Напряжение:</strong> НН - до 0,4 кВ, СН2 - от 1 до 20 кВ, СН1 - 35 кВ, ВН - 110 кВ и выше</li>
            <li><strong>Тип нас. пункта:</strong> Городской или Сельский</li>
            <li><strong>Ставка:</strong> Автоматически заполняется обозначением из вида работ</li>
            <li><strong>Индекс сметной стоимости:</strong> Коэффициент для регулировки формулы расчета</li>
            <li><strong>Флаги умножения:</strong> Определяют параметры для расчета стоимости</li>
          </ul>
        </div>
        
        <div className="info-section">
          <h4>💡 Пример расчета</h4>
          <p>Для ставки С2: Индекс = 0,5, Умножать на индекс = Да, Умножать на количество = Да</p>
          <p>Формула: Стоимость = Ставка × 0,5 × Протяженность ВЛ</p>
        </div>
      </div>
    </div>
  );
};

export default TariffManagement; 