import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setActiveTab, 
  setSelectedForm, 
  setSelectedDocument,
  setShowPrintPreview,
  setShowReportFilters,
  setShowPrintSettings,
  updatePrintSettings,
  setFilters,
  addPrintHistory,
  generatePrintForm,
  generateReport,
  saveFormAsPDF,
  sendFormByEmail
} from '../redux/slices/printFormsSlice';
import '../styles/print-forms.scss';

const PrintForms = () => {
  const dispatch = useDispatch();
  const { 
    printForms, 
    reportForms, 
    documents, 
    printSettings, 
    filters, 
    ui, 
    printHistory 
  } = useSelector(state => state.printForms);
  
  const [reportFilters, setReportFilters] = useState({
    period: '',
    organization: '',
    region: '',
    power_range: '',
    contract_type: '',
    investment_type: '',
    contract_status: '',
    dzo_type: '',
    activity_type: '',
    business_type: '',
    application_status: '',
    year: new Date().getFullYear(),
    application_type: '',
    kpi_type: ''
  });

  const [emailData, setEmailData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleFormSelect = (form) => {
    dispatch(setSelectedForm(form));
  };

  const handleDocumentSelect = (document) => {
    dispatch(setSelectedDocument(document));
  };

  const handlePrintForm = (formId, documentId) => {
    dispatch(generatePrintForm({ formId, documentId, settings: printSettings }));
    dispatch(addPrintHistory({ 
      formName: printForms.find(f => f.id === formId)?.name || 'Неизвестная форма',
      documentNumber: documents.find(d => d.id === documentId)?.number || 'Неизвестный документ',
      copies: printSettings.copies
    }));
    dispatch(setShowPrintPreview(true));
  };

  const handleGenerateReport = (reportId) => {
    dispatch(generateReport({ reportId, filters: reportFilters, settings: printSettings }));
    dispatch(setShowPrintPreview(true));
  };

  const handleSaveAsPDF = (formId, documentId) => {
    const filename = `${documents.find(d => d.id === documentId)?.number || 'document'}_${printForms.find(f => f.id === formId)?.name || 'form'}.pdf`;
    dispatch(saveFormAsPDF({ formId, documentId, filename }));
  };

  const handleSendByEmail = (formId, documentId) => {
    dispatch(sendFormByEmail({ formId, documentId, ...emailData }));
    setEmailData({ email: '', subject: '', message: '' });
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handlePrintSettingsChange = (setting, value) => {
    dispatch(updatePrintSettings({ [setting]: value }));
  };

  const filteredPrintForms = printForms.filter(form => {
    if (filters.category !== 'all' && form.category !== filters.category) return false;
    if (filters.documentType !== 'all' && form.documentType !== filters.documentType) return false;
    return true;
  });

  const filteredReportForms = reportForms.filter(report => {
    if (filters.category !== 'all' && report.category !== filters.category) return false;
    return true;
  });

  const filteredDocuments = documents.filter(doc => {
    if (filters.documentType !== 'all' && doc.type !== filters.documentType) return false;
    if (filters.status !== 'all' && doc.status !== filters.status) return false;
    return true;
  });

  const renderPrintFormsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Категория:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="Акты">Акты</option>
            <option value="Заявки">Заявки</option>
            <option value="Технические условия">Технические условия</option>
            <option value="Договоры">Договоры</option>
            <option value="Финансы">Финансы</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Тип документа:</label>
          <select 
            value={filters.documentType} 
            onChange={(e) => handleFilterChange('documentType', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="Акт">Акт</option>
            <option value="Заявка">Заявка</option>
            <option value="Технические условия">Технические условия</option>
            <option value="Договор">Договор</option>
            <option value="Счет">Счет</option>
          </select>
        </div>
      </div>

      <div className="forms-grid">
        {filteredPrintForms.map(form => (
          <div 
            key={form.id} 
            className={`form-card ${ui.selectedForm?.id === form.id ? 'selected' : ''}`}
            onClick={() => handleFormSelect(form)}
          >
            <div className="card-header">
              <div className="form-icon">
                <span className="icon">{form.icon}</span>
              </div>
              <div className="form-info">
                <h3>{form.name}</h3>
                <span className="category">{form.category}</span>
              </div>
            </div>

            <div className="card-content">
              <p className="description">{form.description}</p>
              <div className="form-meta">
                <span className="document-type">{form.documentType}</span>
                <span className="status active">Активна</span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-preview"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setShowPrintPreview(true));
                }}
                title="Предварительный просмотр"
              >
                <span className="icon">👁️</span>
              </button>
              <button 
                className="btn-edit"
                onClick={(e) => {
                  e.stopPropagation();
                  // Логика редактирования макета
                }}
                title="Редактировать макет"
              >
                <span className="icon">✏️</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportFormsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Категория отчетов:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="Мониторинг">Мониторинг</option>
            <option value="Финансы">Финансы</option>
            <option value="Аналитика">Аналитика</option>
            <option value="Инвестиции">Инвестиции</option>
            <option value="Реестры">Реестры</option>
            <option value="КПЭ">КПЭ</option>
          </select>
        </div>
      </div>

      <div className="reports-grid">
        {filteredReportForms.map(report => (
          <div 
            key={report.id} 
            className={`report-card ${ui.selectedForm?.id === report.id ? 'selected' : ''}`}
            onClick={() => handleFormSelect(report)}
          >
            <div className="card-header">
              <div className="report-icon">
                <span className="icon">{report.icon}</span>
              </div>
              <div className="report-info">
                <h3>{report.name}</h3>
                <span className="category">{report.category}</span>
              </div>
            </div>

            <div className="card-content">
              <p className="description">{report.description}</p>
              <div className="filters-info">
                <span className="filters-count">Фильтров: {report.filters.length}</span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="btn-filters"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setShowReportFilters(true));
                }}
                title="Настройки фильтров"
              >
                <span className="icon">🔍</span>
              </button>
              <button 
                className="btn-generate"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateReport(report.id);
                }}
                title="Сформировать отчет"
              >
                <span className="icon">📊</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="tab-content">
      <div className="filters-section">
        <div className="filter-group">
          <label>Тип документа:</label>
          <select 
            value={filters.documentType} 
            onChange={(e) => handleFilterChange('documentType', e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="Договор">Договор</option>
            <option value="Технические условия">Технические условия</option>
            <option value="Заявка">Заявка</option>
            <option value="Акт">Акт</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Статус:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="Активен">Активен</option>
            <option value="Выполнены">Выполнены</option>
            <option value="В обработке">В обработке</option>
            <option value="Подписан">Подписан</option>
          </select>
        </div>
      </div>

      <div className="documents-table">
        <div className="table-header">
          <div className="table-row header">
            <div className="cell">Номер документа</div>
            <div className="cell">Тип</div>
            <div className="cell">Заявитель</div>
            <div className="cell">Статус</div>
            <div className="cell">Дата</div>
            <div className="cell">Мощность</div>
            <div className="cell">Доступные формы</div>
            <div className="cell">Действия</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="table-row">
              <div className="cell">
                <span className="document-number">{doc.number}</span>
              </div>
              
              <div className="cell">
                <span className="document-type">{doc.type}</span>
              </div>
              
              <div className="cell">
                <span className="applicant">{doc.applicant}</span>
              </div>
              
              <div className="cell">
                <span className={`status ${(doc.status || '').toLowerCase().replace(' ', '-')}`}>
                  {doc.status || 'Не определен'}
                </span>
              </div>
              
              <div className="cell">
                <span className="date">{doc.date}</span>
              </div>
              
              <div className="cell">
                <span className="power">{doc.power}</span>
              </div>
              
              <div className="cell">
                <div className="available-forms">
                  <span className="forms-count">
                    {doc.printForms.length} форм
                  </span>
                  <div className="forms-preview">
                    {doc.printForms.slice(0, 3).map(formId => {
                      const form = printForms.find(f => f.id === formId);
                      return form ? (
                        <span key={formId} className="form-badge" title={form.name}>
                          {form.icon}
                        </span>
                      ) : null;
                    })}
                    {doc.printForms.length > 3 && (
                      <span className="more-forms">+{doc.printForms.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="cell">
                <div className="actions">
                  <button 
                    className="btn-print"
                    onClick={() => handleDocumentSelect(doc)}
                    title="Печать форм"
                  >
                    🖨️
                  </button>
                  <button 
                    className="btn-preview"
                    title="Предварительный просмотр"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-save"
                    title="Сохранить"
                  >
                    💾
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrintPreview = () => (
    <div className="modal-overlay">
      <div className="print-preview-modal">
        <div className="modal-header">
          <h3>Предварительный просмотр</h3>
          <button 
            className="close-btn"
            onClick={() => dispatch(setShowPrintPreview(false))}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="preview-toolbar">
            <div className="toolbar-group">
              <button className="btn-print" title="Печать">
                🖨️ Печать
              </button>
              <button className="btn-save" title="Сохранить">
                💾 Сохранить
              </button>
              <button className="btn-email" title="Отправить по email">
                📧 Email
              </button>
            </div>
            
            <div className="toolbar-group">
              <label>Копий:</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={printSettings.copies}
                onChange={(e) => handlePrintSettingsChange('copies', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="preview-content">
            <div className="preview-page">
              <div className="page-header">
                <h1>Акт о выполнении технических условий</h1>
                <p>№ Д-2024-001 от 15.01.2024</p>
              </div>
              
              <div className="page-content">
                <div className="document-section">
                  <h2>1. Общие сведения</h2>
                  <p><strong>Заявитель:</strong> ООО "ЭнергоСтрой"</p>
                  <p><strong>Адрес:</strong> г. Москва, ул. Энергетическая, д. 15</p>
                  <p><strong>Мощность:</strong> 150 кВт</p>
                  <p><strong>Напряжение:</strong> 0,4 кВ</p>
                </div>
                
                <div className="document-section">
                  <h2>2. Выполненные работы</h2>
                  <ul>
                    <li>Строительство ВЛ 0,4 кВ протяженностью 500м</li>
                    <li>Монтаж трансформаторной подстанции 160 кВА</li>
                    <li>Подключение к электрической сети</li>
                  </ul>
                </div>
                
                <div className="document-section">
                  <h2>3. Заключение</h2>
                  <p>Технические условия выполнены в полном объеме. Объект готов к эксплуатации.</p>
                </div>
              </div>
              
              <div className="page-footer">
                <div className="signatures">
                  <div className="signature-block">
                    <p>Исполнитель:</p>
                    <p>_________________</p>
                    <p>Иванов А.П.</p>
                    <p>15.01.2024</p>
                  </div>
                  <div className="signature-block">
                    <p>Заявитель:</p>
                    <p>_________________</p>
                    <p>Петров В.С.</p>
                    <p>15.01.2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportFilters = () => (
    <div className="modal-overlay">
      <div className="filters-modal">
        <div className="modal-header">
          <h3>Настройки фильтров отчета</h3>
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
              <label>Период:</label>
              <select 
                value={reportFilters.period}
                onChange={(e) => setReportFilters({...reportFilters, period: e.target.value})}
              >
                <option value="">Выберите период</option>
                <option value="2024-01">Январь 2024</option>
                <option value="2024-02">Февраль 2024</option>
                <option value="2024-Q1">1 квартал 2024</option>
                <option value="2024">2024 год</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Организация:</label>
              <select 
                value={reportFilters.organization}
                onChange={(e) => setReportFilters({...reportFilters, organization: e.target.value})}
              >
                <option value="">Все организации</option>
                <option value="org1">ООО "ЭнергоСтрой"</option>
                <option value="org2">ИП Сидоров</option>
                <option value="org3">ООО "ТехСтрой"</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Регион:</label>
              <select 
                value={reportFilters.region}
                onChange={(e) => setReportFilters({...reportFilters, region: e.target.value})}
              >
                <option value="">Все регионы</option>
                <option value="moscow">Москва</option>
                <option value="spb">Санкт-Петербург</option>
                <option value="other">Другие регионы</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Диапазон мощности:</label>
              <select 
                value={reportFilters.power_range}
                onChange={(e) => setReportFilters({...reportFilters, power_range: e.target.value})}
              >
                <option value="">Все диапазоны</option>
                <option value="0-15">До 15 кВт</option>
                <option value="15-150">15-150 кВт</option>
                <option value="150-670">150-670 кВт</option>
                <option value="670+">Свыше 670 кВт</option>
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
              className="btn-apply"
              onClick={() => {
                handleGenerateReport(ui.selectedForm?.id);
                dispatch(setShowReportFilters(false));
              }}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrintSettings = () => (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h3>Настройки печати</h3>
          <button 
            className="close-btn"
            onClick={() => dispatch(setShowPrintSettings(false))}
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="settings-form">
            <div className="form-group">
              <label>Количество копий:</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={printSettings.copies}
                onChange={(e) => handlePrintSettingsChange('copies', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label>Ориентация:</label>
              <select 
                value={printSettings.orientation}
                onChange={(e) => handlePrintSettingsChange('orientation', e.target.value)}
              >
                <option value="portrait">Книжная</option>
                <option value="landscape">Альбомная</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Размер бумаги:</label>
              <select 
                value={printSettings.paperSize}
                onChange={(e) => handlePrintSettingsChange('paperSize', e.target.value)}
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A5">A5</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Поля:</label>
              <select 
                value={printSettings.margins}
                onChange={(e) => handlePrintSettingsChange('margins', e.target.value)}
              >
                <option value="normal">Обычные</option>
                <option value="narrow">Узкие</option>
                <option value="wide">Широкие</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Качество:</label>
              <select 
                value={printSettings.quality}
                onChange={(e) => handlePrintSettingsChange('quality', e.target.value)}
              >
                <option value="draft">Черновик</option>
                <option value="normal">Обычное</option>
                <option value="high">Высокое</option>
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn-cancel"
              onClick={() => dispatch(setShowPrintSettings(false))}
            >
              Отмена
            </button>
            <button 
              className="btn-apply"
              onClick={() => dispatch(setShowPrintSettings(false))}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="print-forms">
      {/* Заголовок с градиентом */}
      <div className="forms-header">
        <div className="header-content">
          <h1>
            <span className="icon">🖨️</span>
            Печатные и отчетные формы АСУТП
          </h1>
          <p>Формирование печатных форм документов и отчетных форм для анализа данных</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{printForms.length}</span>
            <span className="stat-label">Печатных форм</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{reportForms.length}</span>
            <span className="stat-label">Отчетных форм</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{documents.length}</span>
            <span className="stat-label">Документов</span>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="tabs-section">
        <div className="tabs">
          <button 
            className={`tab ${ui.activeTab === 'print' ? 'active' : ''}`}
            onClick={() => handleTabChange('print')}
          >
            <span className="icon">📄</span>
            Печатные формы
          </button>
          <button 
            className={`tab ${ui.activeTab === 'report' ? 'active' : ''}`}
            onClick={() => handleTabChange('report')}
          >
            <span className="icon">📊</span>
            Отчетные формы
          </button>
          <button 
            className={`tab ${ui.activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => handleTabChange('documents')}
          >
            <span className="icon">📋</span>
            Документы
          </button>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="actions-section">
        <button 
          className="btn-settings"
          onClick={() => dispatch(setShowPrintSettings(true))}
        >
          <span className="icon">⚙️</span>
          Настройки печати
        </button>
        <button 
          className="btn-history"
          onClick={() => handleTabChange('history')}
        >
          <span className="icon">📜</span>
          История печати
        </button>
      </div>

      {/* Контент вкладок */}
      {ui.activeTab === 'print' && renderPrintFormsTab()}
      {ui.activeTab === 'report' && renderReportFormsTab()}
      {ui.activeTab === 'documents' && renderDocumentsTab()}

      {/* Модальные окна */}
      {ui.showPrintPreview && renderPrintPreview()}
      {ui.showReportFilters && renderReportFilters()}
      {ui.showPrintSettings && renderPrintSettings()}
    </div>
  );
};

export default PrintForms; 