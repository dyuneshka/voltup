import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setActiveTab, 
  setSelectedDocument, 
  setShowCreateModal, 
  setShowPowerCenterModal,
  setShowReportFilters,
  setEditingMode,
  setFilters,
  createDailyModeMeasurement,
  updateDailyModeMeasurement,
  addPowerCenterToMeasurement,
  removePowerCenterFromMeasurement,
  updateTransformerData,
  calculateMeasurementLoad,
  conductDailyModeMeasurement,
  createPowerCenterCalculation,
  updatePowerCenterCalculation,
  fillPowerCenters,
  addPowerCenterToCalculation,
  removePowerCenterFromCalculation,
  calculatePowerCenterLoad,
  conductPowerCenterCalculation,
  generatePowerCenterReport,
  updateScheduledTask,
  runScheduledTask
} from '../redux/slices/powerCalculationSlice';
import '../styles/power-calculation.scss';

const PowerCalculation = () => {
  const dispatch = useDispatch();
  const { 
    dailyModeMeasurements, 
    powerCenterCalculations, 
    powerCenterReports,
    organizations,
    powerCenters,
    voltageClasses,
    ui, 
    filters,
    scheduledTasks
  } = useSelector(state => state.powerCalculation);
  
  const [newDocument, setNewDocument] = useState({
    organization: '',
    measurementDate: new Date().toISOString().split('T')[0],
    modeDay: 'Зимний',
    responsible: ''
  });

  const [newCalculation, setNewCalculation] = useState({
    organization: '',
    responsible: ''
  });

  const [reportFilters, setReportFilters] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    organization: '',
    voltageClass: 'all'
  });

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleCreateDocument = (type) => {
    if (type === 'measurement') {
      dispatch(createDailyModeMeasurement(newDocument));
      setNewDocument({
        organization: '',
        measurementDate: new Date().toISOString().split('T')[0],
        modeDay: 'Зимний',
        responsible: ''
      });
    } else if (type === 'calculation') {
      dispatch(createPowerCenterCalculation(newCalculation));
      setNewCalculation({
        organization: '',
        responsible: ''
      });
    }
    dispatch(setShowCreateModal(false));
  };

  const handleSelectDocument = (document) => {
    dispatch(setSelectedDocument(document));
  };

  const handleAddPowerCenter = (documentId, powerCenter) => {
    if (ui.activeTab === 'measurements') {
      dispatch(addPowerCenterToMeasurement({ documentId, powerCenter }));
    } else if (ui.activeTab === 'calculations') {
      dispatch(addPowerCenterToCalculation({ documentId, powerCenter }));
    }
    dispatch(setShowPowerCenterModal(false));
  };

  const handleRemovePowerCenter = (documentId, powerCenterId) => {
    if (ui.activeTab === 'measurements') {
      dispatch(removePowerCenterFromMeasurement({ documentId, powerCenterId }));
    } else if (ui.activeTab === 'calculations') {
      dispatch(removePowerCenterFromCalculation({ documentId, powerCenterId }));
    }
  };

  const handleUpdateTransformer = (documentId, powerCenterId, transformerId, updates) => {
    dispatch(updateTransformerData({ documentId, powerCenterId, transformerId, updates }));
  };

  const handleCalculateLoad = (documentId) => {
    if (ui.activeTab === 'measurements') {
      dispatch(calculateMeasurementLoad({ documentId }));
    } else if (ui.activeTab === 'calculations') {
      dispatch(calculatePowerCenterLoad({ documentId }));
    }
  };

  const handleConductDocument = (documentId) => {
    if (ui.activeTab === 'measurements') {
      dispatch(conductDailyModeMeasurement({ documentId }));
    } else if (ui.activeTab === 'calculations') {
      dispatch(conductPowerCenterCalculation({ documentId }));
    }
  };

  const handleFillPowerCenters = (documentId, organizationId) => {
    if (ui.activeTab === 'calculations') {
      dispatch(fillPowerCenters({ documentId, organizationId }));
    }
  };

  const handleGenerateReport = () => {
    dispatch(generatePowerCenterReport(reportFilters));
    dispatch(setShowReportFilters(false));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredMeasurements = dailyModeMeasurements.filter(doc => {
    if (filters.organization !== 'all' && doc.organization !== filters.organization) return false;
    if (filters.status !== 'all' && doc.status !== filters.status) return false;
    return true;
  });

  const filteredCalculations = powerCenterCalculations.filter(doc => {
    if (filters.organization !== 'all' && doc.organization !== filters.organization) return false;
    if (filters.status !== 'all' && doc.status !== filters.status) return false;
    return true;
  });

  const renderMeasurementsTab = () => (
    <div className="tab-content">
      <div className="documents-header">
        <div className="header-actions">
          <button 
            className="btn-create"
            onClick={() => dispatch(setShowCreateModal(true))}
          >
            <span className="icon">➕</span>
            Создать документ
          </button>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Организация:</label>
            <select 
              value={filters.organization} 
              onChange={(e) => handleFilterChange('organization', e.target.value)}
            >
              <option value="all">Все организации</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Статус:</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="Черновик">Черновик</option>
              <option value="Проведен">Проведен</option>
            </select>
          </div>
        </div>
      </div>

      <div className="documents-grid">
        {filteredMeasurements.map(doc => (
          <div 
            key={doc.id} 
            className={`document-card ${ui.selectedDocument?.id === doc.id ? 'selected' : ''}`}
            onClick={() => handleSelectDocument(doc)}
          >
            <div className="card-header">
              <div className="document-info">
                <h3>{doc.number}</h3>
                <span className="organization">{doc.organization}</span>
              </div>
              <div className="document-status">
                <span className={`status ${(doc.status || '').toLowerCase()}`}>
                  {doc.status || 'Не определен'}
                </span>
              </div>
            </div>

            <div className="card-content">
              <div className="document-details">
                <div className="detail-item">
                  <span className="label">Дата замера:</span>
                  <span className="value">{doc.measurementDate}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Режимный день:</span>
                  <span className="value">{doc.modeDay}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ответственный:</span>
                  <span className="value">{doc.responsible}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Центров питания:</span>
                  <span className="value">{doc.powerCenters.length}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setEditingMode(true));
                }}
                title="Редактировать"
              >
                <span className="icon">✏️</span>
              </button>
              <button 
                className="btn-calculate"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculateLoad(doc.id);
                }}
                title="Рассчитать нагрузку"
              >
                <span className="icon">🧮</span>
              </button>
              <button 
                className="btn-conduct"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConductDocument(doc.id);
                }}
                title="Провести документ"
                disabled={doc.status === 'Проведен'}
              >
                <span className="icon">✅</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalculationsTab = () => (
    <div className="tab-content">
      <div className="documents-header">
        <div className="header-actions">
          <button 
            className="btn-create"
            onClick={() => dispatch(setShowCreateModal(true))}
          >
            <span className="icon">➕</span>
            Создать расчет
          </button>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Организация:</label>
            <select 
              value={filters.organization} 
              onChange={(e) => handleFilterChange('organization', e.target.value)}
            >
              <option value="all">Все организации</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Статус:</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="Черновик">Черновик</option>
              <option value="Проведен">Проведен</option>
            </select>
          </div>
        </div>
      </div>

      <div className="documents-grid">
        {filteredCalculations.map(doc => (
          <div 
            key={doc.id} 
            className={`document-card ${ui.selectedDocument?.id === doc.id ? 'selected' : ''}`}
            onClick={() => handleSelectDocument(doc)}
          >
            <div className="card-header">
              <div className="document-info">
                <h3>{doc.number}</h3>
                <span className="organization">{doc.organization}</span>
              </div>
              <div className="document-status">
                <span className={`status ${(doc.status || '').toLowerCase()}`}>
                  {doc.status || 'Не определен'}
                </span>
              </div>
            </div>

            <div className="card-content">
              <div className="document-details">
                <div className="detail-item">
                  <span className="label">Дата расчета:</span>
                  <span className="value">{doc.calculationDate}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ответственный:</span>
                  <span className="value">{doc.responsible}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Центров питания:</span>
                  <span className="value">{doc.powerCenters.length}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Статус загрузки:</span>
                  <span className="value">
                    {doc.powerCenters.filter(pc => pc.status === 'Дефицит').length} дефицит,
                    {doc.powerCenters.filter(pc => pc.status === 'Профицит').length} профицит
                  </span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setEditingMode(true));
                }}
                title="Редактировать"
              >
                <span className="icon">✏️</span>
              </button>
              <button 
                className="btn-fill"
                onClick={(e) => {
                  e.stopPropagation();
                  const org = organizations.find(o => o.name === doc.organization);
                  if (org) {
                    handleFillPowerCenters(doc.id, org.id);
                  }
                }}
                title="Заполнить центры питания"
              >
                <span className="icon">📋</span>
              </button>
              <button 
                className="btn-calculate"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculateLoad(doc.id);
                }}
                title="Рассчитать"
              >
                <span className="icon">🧮</span>
              </button>
              <button 
                className="btn-conduct"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConductDocument(doc.id);
                }}
                title="Провести документ"
                disabled={doc.status === 'Проведен'}
              >
                <span className="icon">✅</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="tab-content">
      <div className="reports-header">
        <div className="header-actions">
          <button 
            className="btn-generate"
            onClick={() => dispatch(setShowReportFilters(true))}
          >
            <span className="icon">📊</span>
            Сформировать отчет
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {powerCenterReports.map(report => (
          <div key={report.id} className="report-card">
            <div className="card-header">
              <div className="report-info">
                <h3>Отчет о загрузке центров питания</h3>
                <span className="date">{report.reportDate}</span>
              </div>
              <div className="report-status">
                <span className={`status ${(report.status || '').toLowerCase()}`}>
                  {report.status || 'Не определен'}
                </span>
              </div>
            </div>

            <div className="card-content">
              <div className="report-details">
                <div className="detail-item">
                  <span className="label">Организация:</span>
                  <span className="value">{report.organization}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Класс напряжения:</span>
                  <span className="value">{report.voltageClass}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Центров питания:</span>
                  <span className="value">{report.data.length}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Статус загрузки:</span>
                  <span className="value">
                    {report.data.filter(item => item.status === 'Дефицит').length} дефицит,
                    {report.data.filter(item => item.status === 'Профицит').length} профицит,
                    {report.data.filter(item => item.status === 'Норма').length} норма
                  </span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-view"
                onClick={() => handleSelectDocument(report)}
                title="Просмотреть отчет"
              >
                <span className="icon">👁️</span>
              </button>
              <button 
                className="btn-print"
                title="Печать отчета"
              >
                <span className="icon">🖨️</span>
              </button>
              <button 
                className="btn-save"
                title="Сохранить отчет"
              >
                <span className="icon">💾</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentDetails = () => {
    if (!ui.selectedDocument) return null;

    const doc = ui.selectedDocument;

    if (ui.activeTab === 'measurements') {
      return (
        <div className="document-details-panel">
          <div className="panel-header">
            <h3>Документ: {doc.number}</h3>
            <button 
              className="close-btn"
              onClick={() => dispatch(setSelectedDocument(null))}
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            <div className="document-info-section">
              <h4>Информация о документе</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Организация:</span>
                  <span className="value">{doc.organization}</span>
                </div>
                <div className="info-item">
                  <span className="label">Дата замера:</span>
                  <span className="value">{doc.measurementDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Режимный день:</span>
                  <span className="value">{doc.modeDay}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ответственный:</span>
                  <span className="value">{doc.responsible}</span>
                </div>
                <div className="info-item">
                  <span className="label">Статус:</span>
                  <span className={`value status ${(doc.status || '').toLowerCase()}`}>
                    {doc.status || 'Не определен'}
                  </span>
                </div>
              </div>
            </div>

            <div className="power-centers-section">
              <div className="section-header">
                <h4>Центры питания</h4>
                <button 
                  className="btn-add"
                  onClick={() => dispatch(setShowPowerCenterModal(true))}
                >
                  <span className="icon">➕</span>
                  Добавить центр питания
                </button>
              </div>

              <div className="power-centers-list">
                {doc.powerCenters.map(pc => (
                  <div key={pc.id} className="power-center-card">
                    <div className="pc-header">
                      <h5>{pc.name}</h5>
                      <div className="pc-meta">
                        <span className="voltage">{pc.voltage}</span>
                        <span className={`seasonality ${pc.seasonality ? 'yes' : 'no'}`}>
                          {pc.seasonality ? 'Сезонность' : 'Нет сезонности'}
                        </span>
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => handleRemovePowerCenter(doc.id, pc.id)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="transformers-section">
                      <h6>Трансформаторы</h6>
                      <div className="transformers-table">
                        <div className="table-header">
                          <div className="cell">Наименование</div>
                          <div className="cell">Мощность, МВА</div>
                          <div className="cell">Макс. нагрузка, МВА</div>
                          <div className="cell">Макс. нагрузка, %</div>
                          <div className="cell">Авар. нагрузка, МВА</div>
                          <div className="cell">Авар. нагрузка, %</div>
                        </div>
                        <div className="table-body">
                          {pc.transformers.map(transformer => (
                            <div key={transformer.id} className="table-row">
                              <div className="cell">{transformer.name}</div>
                              <div className="cell">{transformer.power}</div>
                              <div className="cell">
                                <input
                                  type="number"
                                  value={transformer.maxLoad}
                                  onChange={(e) => handleUpdateTransformer(
                                    doc.id, pc.id, transformer.id, 
                                    { maxLoad: parseFloat(e.target.value) }
                                  )}
                                  step="0.1"
                                  min="0"
                                />
                              </div>
                              <div className="cell">{transformer.maxLoadPercent.toFixed(1)}%</div>
                              <div className="cell">
                                <input
                                  type="number"
                                  value={transformer.emergencyLoad}
                                  onChange={(e) => handleUpdateTransformer(
                                    doc.id, pc.id, transformer.id, 
                                    { emergencyLoad: parseFloat(e.target.value) }
                                  )}
                                  step="0.1"
                                  min="0"
                                />
                              </div>
                              <div className="cell">{transformer.emergencyLoadPercent.toFixed(1)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pc-summary">
                        <span>Итого максимальная нагрузка: {pc.totalMaxLoad} МВА ({pc.totalMaxLoadPercent.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="technological-operations-section">
              <h4>Технологические операции</h4>
              <div className="operations-grid">
                <div className="operation-item">
                  <label>Перераспределение мощности, МВА:</label>
                  <input
                    type="number"
                    value={doc.technologicalOperations.redistribution}
                    onChange={(e) => dispatch(updateDailyModeMeasurement({
                      id: doc.id,
                      updates: {
                        technologicalOperations: {
                          ...doc.technologicalOperations,
                          redistribution: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
                <div className="operation-item">
                  <label>Перевод мощности, МВА:</label>
                  <input
                    type="number"
                    value={doc.technologicalOperations.powerTransfer}
                    onChange={(e) => dispatch(updateDailyModeMeasurement({
                      id: doc.id,
                      updates: {
                        technologicalOperations: {
                          ...doc.technologicalOperations,
                          powerTransfer: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
                <div className="operation-item">
                  <label>Снижение потерь, МВА:</label>
                  <input
                    type="number"
                    value={doc.technologicalOperations.lossReduction}
                    onChange={(e) => dispatch(updateDailyModeMeasurement({
                      id: doc.id,
                      updates: {
                        technologicalOperations: {
                          ...doc.technologicalOperations,
                          lossReduction: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (ui.activeTab === 'calculations') {
      return (
        <div className="document-details-panel">
          <div className="panel-header">
            <h3>Расчет: {doc.number}</h3>
            <button 
              className="close-btn"
              onClick={() => dispatch(setSelectedDocument(null))}
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            <div className="document-info-section">
              <h4>Информация о расчете</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Организация:</span>
                  <span className="value">{doc.organization}</span>
                </div>
                <div className="info-item">
                  <span className="label">Дата расчета:</span>
                  <span className="value">{doc.calculationDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ответственный:</span>
                  <span className="value">{doc.responsible}</span>
                </div>
                <div className="info-item">
                  <span className="label">Статус:</span>
                  <span className={`value status ${(doc.status || '').toLowerCase()}`}>
                    {doc.status || 'Не определен'}
                  </span>
                </div>
              </div>
            </div>

            <div className="power-centers-section">
              <div className="section-header">
                <h4>Центры питания</h4>
                <button 
                  className="btn-add"
                  onClick={() => dispatch(setShowPowerCenterModal(true))}
                >
                  <span className="icon">➕</span>
                  Добавить центр питания
                </button>
              </div>

              <div className="power-centers-table">
                <div className="table-header">
                  <div className="cell">Центр питания</div>
                  <div className="cell">Напряжение</div>
                  <div className="cell">Общая мощность, МВА</div>
                  <div className="cell">Текущая нагрузка, МВА</div>
                  <div className="cell">Текущая нагрузка, %</div>
                  <div className="cell">ТП, МВА</div>
                  <div className="cell">Будущая нагрузка, МВА</div>
                  <div className="cell">Будущая нагрузка, %</div>
                  <div className="cell">Дефицит, МВА</div>
                  <div className="cell">Профицит, МВА</div>
                  <div className="cell">Статус</div>
                </div>
                <div className="table-body">
                  {doc.powerCenters.map(pc => (
                    <div key={pc.id} className="table-row">
                      <div className="cell">{pc.name}</div>
                      <div className="cell">{pc.voltage}</div>
                      <div className="cell">
                        <input
                          type="number"
                          value={pc.totalPower}
                          onChange={(e) => dispatch(updatePowerCenterCalculation({
                            id: doc.id,
                            updates: {
                              powerCenters: doc.powerCenters.map(p => 
                                p.id === pc.id ? { ...p, totalPower: parseFloat(e.target.value) } : p
                              )
                            }
                          }))}
                          step="0.1"
                          min="0"
                        />
                      </div>
                      <div className="cell">
                        <input
                          type="number"
                          value={pc.currentLoad}
                          onChange={(e) => dispatch(updatePowerCenterCalculation({
                            id: doc.id,
                            updates: {
                              powerCenters: doc.powerCenters.map(p => 
                                p.id === pc.id ? { ...p, currentLoad: parseFloat(e.target.value) } : p
                              )
                            }
                          }))}
                          step="0.1"
                          min="0"
                        />
                      </div>
                      <div className="cell">{pc.currentLoadPercent.toFixed(1)}%</div>
                      <div className="cell">
                        <input
                          type="number"
                          value={pc.technologicalConnections}
                          onChange={(e) => dispatch(updatePowerCenterCalculation({
                            id: doc.id,
                            updates: {
                              powerCenters: doc.powerCenters.map(p => 
                                p.id === pc.id ? { ...p, technologicalConnections: parseFloat(e.target.value) } : p
                              )
                            }
                          }))}
                          step="0.1"
                          min="0"
                        />
                      </div>
                      <div className="cell">{pc.futureLoad.toFixed(1)}</div>
                      <div className="cell">{pc.futureLoadPercent.toFixed(1)}%</div>
                      <div className="cell">{pc.deficit.toFixed(1)}</div>
                      <div className="cell">{pc.surplus.toFixed(1)}</div>
                      <div className="cell">
                        <span className={`status ${(pc.status || '').toLowerCase()}`}>
                          {pc.status || 'Не определен'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (ui.activeTab === 'reports') {
      return (
        <div className="document-details-panel">
          <div className="panel-header">
            <h3>Отчет о загрузке центров питания</h3>
            <button 
              className="close-btn"
              onClick={() => dispatch(setSelectedDocument(null))}
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            <div className="report-info-section">
              <h4>Информация об отчете</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Дата отчета:</span>
                  <span className="value">{doc.reportDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Организация:</span>
                  <span className="value">{doc.organization}</span>
                </div>
                <div className="info-item">
                  <span className="label">Класс напряжения:</span>
                  <span className="value">{doc.voltageClass}</span>
                </div>
                <div className="info-item">
                  <span className="label">Статус:</span>
                  <span className={`value status ${(doc.status || '').toLowerCase()}`}>
                    {doc.status || 'Не определен'}
                  </span>
                </div>
              </div>
            </div>

            <div className="report-data-section">
              <h4>Данные по центрам питания</h4>
              <div className="report-table">
                <div className="table-header">
                  <div className="cell">Центр питания</div>
                  <div className="cell">Напряжение</div>
                  <div className="cell">Общая мощность, МВА</div>
                  <div className="cell">Текущая нагрузка, МВА</div>
                  <div className="cell">Текущая нагрузка, %</div>
                  <div className="cell">Будущая нагрузка, МВА</div>
                  <div className="cell">Будущая нагрузка, %</div>
                  <div className="cell">Дефицит, МВА</div>
                  <div className="cell">Профицит, МВА</div>
                  <div className="cell">Статус</div>
                </div>
                <div className="table-body">
                  {doc.data.map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="cell">{item.powerCenter}</div>
                      <div className="cell">{item.voltage}</div>
                      <div className="cell">{item.totalPower}</div>
                      <div className="cell">{item.currentLoad}</div>
                      <div className="cell">{item.currentLoadPercent.toFixed(1)}%</div>
                      <div className="cell">{item.futureLoad}</div>
                      <div className="cell">{item.futureLoadPercent.toFixed(1)}%</div>
                      <div className="cell">{item.deficit}</div>
                      <div className="cell">{item.surplus}</div>
                      <div className="cell">
                        <span className={`status ${(item.status || '').toLowerCase()}`}>
                          {item.status || 'Не определен'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderCreateModal = () => (
    <div className="modal-overlay">
      <div className="create-modal">
        <div className="modal-header">
          <h3>
            {ui.activeTab === 'measurements' ? 'Создать документ "Измерение режима дня"' : 'Создать документ "Расчет загрузки центров питания"'}
          </h3>
          <button 
            className="close-btn"
            onClick={() => dispatch(setShowCreateModal(false))}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          {ui.activeTab === 'measurements' ? (
            <div className="form-group">
              <label>Организация:</label>
              <select 
                value={newDocument.organization}
                onChange={(e) => setNewDocument({...newDocument, organization: e.target.value})}
              >
                <option value="">Выберите организацию</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
              
              <label>Дата замера:</label>
              <input
                type="date"
                value={newDocument.measurementDate}
                onChange={(e) => setNewDocument({...newDocument, measurementDate: e.target.value})}
              />
              
              <label>Режимный день:</label>
              <select 
                value={newDocument.modeDay}
                onChange={(e) => setNewDocument({...newDocument, modeDay: e.target.value})}
              >
                <option value="Зимний">Зимний</option>
                <option value="Летний">Летний</option>
              </select>
              
              <label>Ответственный:</label>
              <input
                type="text"
                value={newDocument.responsible}
                onChange={(e) => setNewDocument({...newDocument, responsible: e.target.value})}
                placeholder="Введите ФИО ответственного"
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Организация:</label>
              <select 
                value={newCalculation.organization}
                onChange={(e) => setNewCalculation({...newCalculation, organization: e.target.value})}
              >
                <option value="">Выберите организацию</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
              
              <label>Ответственный:</label>
              <input
                type="text"
                value={newCalculation.responsible}
                onChange={(e) => setNewCalculation({...newCalculation, responsible: e.target.value})}
                placeholder="Введите ФИО ответственного"
              />
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              className="btn-cancel"
              onClick={() => dispatch(setShowCreateModal(false))}
            >
              Отмена
            </button>
            <button 
              className="btn-create"
              onClick={() => handleCreateDocument(ui.activeTab === 'measurements' ? 'measurement' : 'calculation')}
              disabled={ui.activeTab === 'measurements' ? 
                !newDocument.organization || !newDocument.responsible :
                !newCalculation.organization || !newCalculation.responsible
              }
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPowerCenterModal = () => (
    <div className="modal-overlay">
      <div className="power-center-modal">
        <div className="modal-header">
          <h3>Выбор центра питания</h3>
          <button 
            className="close-btn"
            onClick={() => dispatch(setShowPowerCenterModal(false))}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="power-centers-list">
            {powerCenters.map(pc => (
              <div 
                key={pc.id} 
                className="power-center-item"
                onClick={() => handleAddPowerCenter(ui.selectedDocument.id, {
                  id: pc.id,
                  name: pc.name,
                  voltage: pc.voltage,
                  seasonality: false,
                  transformers: [
                    {
                      id: Date.now(),
                      name: 'ТР-1',
                      power: 0,
                      maxLoad: 0,
                      maxLoadPercent: 0,
                      emergencyLoad: 0,
                      emergencyLoadPercent: 0
                    }
                  ],
                  totalMaxLoad: 0,
                  totalMaxLoadPercent: 0
                })}
              >
                <div className="pc-info">
                  <h4>{pc.name}</h4>
                  <span className="voltage">{pc.voltage}</span>
                </div>
                <div className="pc-actions">
                  <button className="btn-select">Выбрать</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportFiltersModal = () => (
    <div className="modal-overlay">
      <div className="filters-modal">
        <div className="modal-header">
          <h3>Настройки отчета</h3>
          <button 
            className="close-btn"
            onClick={() => dispatch(setShowReportFilters(false))}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="filters-form">
            <div className="form-group">
              <label>Дата отчета:</label>
              <input
                type="date"
                value={reportFilters.reportDate}
                onChange={(e) => setReportFilters({...reportFilters, reportDate: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Организация:</label>
              <select 
                value={reportFilters.organization}
                onChange={(e) => setReportFilters({...reportFilters, organization: e.target.value})}
              >
                <option value="">Выберите организацию</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.name}>{org.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Класс напряжения:</label>
              <select 
                value={reportFilters.voltageClass}
                onChange={(e) => setReportFilters({...reportFilters, voltageClass: e.target.value})}
              >
                <option value="all">Все классы напряжения</option>
                {voltageClasses.map(vc => (
                  <option key={vc.id} value={vc.value}>{vc.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn-cancel"
              onClick={() => dispatch(setShowReportFilters(false))}
            >
              Отмена
            </button>
            <button 
              className="btn-generate"
              onClick={handleGenerateReport}
              disabled={!reportFilters.organization}
            >
              Сформировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="power-calculation">
      {/* Заголовок с градиентом */}
      <div className="calculation-header">
        <div className="header-content">
          <h1>
            <span className="icon">⚡</span>
            Расчет профицита/дефицита мощности на подстанциях
          </h1>
          <p>Функционал расчета профицита/дефицита мощности на ПС и документации загрузки элементов сети</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{dailyModeMeasurements.length}</span>
            <span className="stat-label">Измерений режима дня</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{powerCenterCalculations.length}</span>
            <span className="stat-label">Расчетов загрузки</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{powerCenterReports.length}</span>
            <span className="stat-label">Отчетов</span>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="tabs-section">
        <div className="tabs">
          <button 
            className={`tab ${ui.activeTab === 'measurements' ? 'active' : ''}`}
            onClick={() => handleTabChange('measurements')}
          >
            <span className="icon">📊</span>
            Измерения режима дня
          </button>
          <button 
            className={`tab ${ui.activeTab === 'calculations' ? 'active' : ''}`}
            onClick={() => handleTabChange('calculations')}
          >
            <span className="icon">🧮</span>
            Расчет загрузки ЦП
          </button>
          <button 
            className={`tab ${ui.activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleTabChange('reports')}
          >
            <span className="icon">📋</span>
            Отчеты
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="main-content">
        <div className="content-left">
          {ui.activeTab === 'measurements' && renderMeasurementsTab()}
          {ui.activeTab === 'calculations' && renderCalculationsTab()}
          {ui.activeTab === 'reports' && renderReportsTab()}
        </div>
        
        <div className="content-right">
          {renderDocumentDetails()}
        </div>
      </div>

      {/* Модальные окна */}
      {ui.showCreateModal && renderCreateModal()}
      {ui.showPowerCenterModal && renderPowerCenterModal()}
      {ui.showReportFilters && renderReportFiltersModal()}
    </div>
  );
};

export default PowerCalculation;