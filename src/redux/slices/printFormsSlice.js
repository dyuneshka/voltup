import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Печатные формы
  printForms: [
    {
      id: 1,
      name: 'Акт о выполнении ТУ',
      type: 'print',
      category: 'Акты',
      description: 'Акт о выполнении технических условий',
      documentType: 'Акт',
      status: 'active',
      template: 'act-tu-template',
      icon: '📄'
    },
    {
      id: 2,
      name: 'Заявка на временное технологическое присоединение до 150 кВт',
      type: 'print',
      category: 'Заявки',
      description: 'Заявка на временное технологическое присоединение передвижных объектов до 150 кВт',
      documentType: 'Заявка',
      status: 'active',
      template: 'application-temp-150-template',
      icon: '📋'
    },
    {
      id: 3,
      name: 'Заявка на технологическое присоединение ЮЛ (ИП), ФЛ свыше 150 кВт',
      type: 'print',
      category: 'Заявки',
      description: 'Заявка на технологическое присоединение юридических лиц и ИП свыше 150 кВт',
      documentType: 'Заявка',
      status: 'active',
      template: 'application-over-150-template',
      icon: '📋'
    },
    {
      id: 4,
      name: 'Заявка на технологическое присоединение ФЛ до 15 кВт',
      type: 'print',
      category: 'Заявки',
      description: 'Заявка на технологическое присоединение физических лиц до 15 кВт',
      documentType: 'Заявка',
      status: 'active',
      template: 'application-fl-15-template',
      icon: '📋'
    },
    {
      id: 5,
      name: 'Заявка на технологическое присоединение до 150 кВт',
      type: 'print',
      category: 'Заявки',
      description: 'Заявка на технологическое присоединение до 150 кВт по 2, 3 категории',
      documentType: 'Заявка',
      status: 'active',
      template: 'application-150-template',
      icon: '📋'
    },
    {
      id: 6,
      name: 'Типовая форма технических условий',
      type: 'print',
      category: 'Технические условия',
      description: 'Типовая форма технических условий на технологическое присоединение',
      documentType: 'Технические условия',
      status: 'active',
      template: 'tu-template',
      icon: '⚡'
    },
    {
      id: 7,
      name: 'Условия договора на технологическое присоединение до 150 кВт',
      type: 'print',
      category: 'Договоры',
      description: 'Условия договора на технологическое присоединение до 150 кВт',
      documentType: 'Договор',
      status: 'active',
      template: 'contract-150-template',
      icon: '📜'
    },
    {
      id: 8,
      name: 'Типовая форма договора на технологическое присоединение выше 150 кВт',
      type: 'print',
      category: 'Договоры',
      description: 'Типовая форма договора на технологическое присоединение выше 150 кВт',
      documentType: 'Договор',
      status: 'active',
      template: 'contract-over-150-template',
      icon: '📜'
    },
    {
      id: 9,
      name: 'Счет на оплату',
      type: 'print',
      category: 'Финансы',
      description: 'Счет на оплату услуг технологического присоединения',
      documentType: 'Счет',
      status: 'active',
      template: 'invoice-template',
      icon: '💰'
    },
    {
      id: 10,
      name: 'Акт об осуществлении ТП',
      type: 'print',
      category: 'Акты',
      description: 'Акт об осуществлении технологического присоединения',
      documentType: 'Акт',
      status: 'active',
      template: 'act-tp-template',
      icon: '📄'
    }
  ],

  // Отчетные формы
  reportForms: [
    {
      id: 1,
      name: 'Мониторинг тарифов на технологическое присоединение',
      type: 'report',
      category: 'Мониторинг',
      description: 'Отчет по мониторингу тарифов на технологическое присоединение',
      status: 'active',
      template: 'tariff-monitoring-template',
      icon: '📊',
      filters: ['period', 'organization', 'region']
    },
    {
      id: 2,
      name: 'Мониторинг объемов технологического присоединения',
      type: 'report',
      category: 'Мониторинг',
      description: 'Мониторинг объемов технологического присоединения энергопринимающих устройств',
      status: 'active',
      template: 'volume-monitoring-template',
      icon: '📈',
      filters: ['period', 'organization', 'power_range']
    },
    {
      id: 3,
      name: 'Мониторинг движения денежных средств по договорам',
      type: 'report',
      category: 'Финансы',
      description: 'Мониторинг движения денежных средств по договорам технологического присоединения',
      status: 'active',
      template: 'cash-flow-template',
      icon: '💳',
      filters: ['period', 'organization', 'contract_type']
    },
    {
      id: 4,
      name: 'Информация по энергопринимающим устройствам свыше 5 МВт',
      type: 'report',
      category: 'Аналитика',
      description: 'Информация по энергопринимающим устройствам заявителей свыше 5 МВт',
      status: 'active',
      template: 'high-power-template',
      icon: '⚡',
      filters: ['period', 'organization', 'power_range']
    },
    {
      id: 5,
      name: 'Информация о результатах инвестиционной деятельности',
      type: 'report',
      category: 'Инвестиции',
      description: 'Информация о результатах инвестиционной деятельности по технологическому присоединению',
      status: 'active',
      template: 'investment-template',
      icon: '🏗️',
      filters: ['period', 'organization', 'investment_type']
    },
    {
      id: 6,
      name: 'Мониторинг договоров между МРСК/РСК и ОАО «ФСК ЕЭС»',
      type: 'report',
      category: 'Мониторинг',
      description: 'Мониторинг договоров технологического присоединения между МРСК/РСК и ОАО «ФСК ЕЭС»',
      status: 'active',
      template: 'mrs-fsk-template',
      icon: '🔗',
      filters: ['period', 'organization', 'contract_status']
    },
    {
      id: 7,
      name: 'Мониторинг заключения договоров с ДЗО',
      type: 'report',
      category: 'Мониторинг',
      description: 'Мониторинг заключения договоров об осуществлении технологического присоединения с ДЗО',
      status: 'active',
      template: 'dzo-contracts-template',
      icon: '📋',
      filters: ['period', 'organization', 'dzo_type']
    },
    {
      id: 8,
      name: 'Информация по ТП в разрезе видов экономической деятельности',
      type: 'report',
      category: 'Аналитика',
      description: 'Информация по технологическому присоединению в разрезе отдельных видов экономической деятельности',
      status: 'active',
      template: 'economic-activity-template',
      icon: '📊',
      filters: ['period', 'organization', 'activity_type']
    },
    {
      id: 9,
      name: 'Мониторинг объемов ТП до 150 кВт',
      type: 'report',
      category: 'Мониторинг',
      description: 'Мониторинг объемов технологического присоединения до 150 кВт, включая малый и средний бизнес',
      status: 'active',
      template: 'small-business-template',
      icon: '🏢',
      filters: ['period', 'organization', 'business_type']
    },
    {
      id: 10,
      name: 'Реестр заявок на технологическое присоединение ДЗО',
      type: 'report',
      category: 'Реестры',
      description: 'Реестр заявок на технологическое присоединение ДЗО ПАО «Россети»',
      status: 'active',
      template: 'applications-registry-template',
      icon: '📋',
      filters: ['period', 'organization', 'application_status']
    },
    {
      id: 11,
      name: 'Реестр действующих договоров на 31.12',
      type: 'report',
      category: 'Реестры',
      description: 'Реестр действующих на 31.12 договоров об осуществлении технологического присоединения',
      status: 'active',
      template: 'active-contracts-template',
      icon: '📜',
      filters: ['year', 'organization', 'contract_status']
    },
    {
      id: 12,
      name: 'Реестр заявок на ТП за год',
      type: 'report',
      category: 'Реестры',
      description: 'Реестр заявок на технологическое присоединение, поданных заявителями в ДЗО ПАО «Россети»',
      status: 'active',
      template: 'yearly-applications-template',
      icon: '📋',
      filters: ['year', 'organization', 'application_type']
    },
    {
      id: 13,
      name: 'Расшифровка КПЭ 2.9 «Соблюдение сроков ТП»',
      type: 'report',
      category: 'КПЭ',
      description: 'Расшифровка КПЭ 2.9 «Соблюдение сроков осуществления технологического присоединения»',
      status: 'active',
      template: 'kpi-2-9-template',
      icon: '🎯',
      filters: ['year', 'organization', 'kpi_type']
    }
  ],

  // Документы для печати
  documents: [
    {
      id: 1,
      number: 'Д-2024-001',
      type: 'Договор',
      applicant: 'ООО "ЭнергоСтрой"',
      status: 'Активен',
      date: '2024-01-15',
      power: '150 кВт',
      printForms: [7, 9],
      reports: [1, 2, 3]
    },
    {
      id: 2,
      number: 'ТУ-2024-002',
      type: 'Технические условия',
      applicant: 'ИП Сидоров',
      status: 'Выполнены',
      date: '2024-01-10',
      power: '75 кВт',
      printForms: [6, 10],
      reports: [2, 9]
    },
    {
      id: 3,
      number: 'З-2024-003',
      type: 'Заявка',
      applicant: 'ООО "ТехСтрой"',
      status: 'В обработке',
      date: '2024-02-01',
      power: '200 кВт',
      printForms: [3, 5],
      reports: [1, 2, 4]
    },
    {
      id: 4,
      number: 'А-2024-004',
      type: 'Акт',
      applicant: 'ООО "СтройИнвест"',
      status: 'Подписан',
      date: '2024-01-20',
      power: '500 кВт',
      printForms: [1, 10],
      reports: [2, 5]
    }
  ],

  // Настройки печати
  printSettings: {
    copies: 1,
    orientation: 'portrait',
    paperSize: 'A4',
    margins: 'normal',
    quality: 'high'
  },

  // Фильтры
  filters: {
    formType: 'all', // all, print, report
    category: 'all',
    documentType: 'all',
    status: 'all'
  },

  // Состояние интерфейса
  ui: {
    activeTab: 'print', // print, report, documents
    selectedForm: null,
    selectedDocument: null,
    showPrintPreview: false,
    showReportFilters: false,
    showPrintSettings: false
  },

  // История печати
  printHistory: [
    {
      id: 1,
      formName: 'Акт о выполнении ТУ',
      documentNumber: 'Д-2024-001',
      date: '2024-02-15',
      user: 'Иванов А.П.',
      copies: 2,
      status: 'Печать завершена'
    },
    {
      id: 2,
      formName: 'Счет на оплату',
      documentNumber: 'Д-2024-001',
      date: '2024-02-14',
      user: 'Петров В.С.',
      copies: 1,
      status: 'Сохранен в PDF'
    }
  ]
};

const printFormsSlice = createSlice({
  name: 'printForms',
  initialState,
  reducers: {
    addForm: (state, action) => {
      state.forms.push(action.payload);
    },

    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },

    setSelectedForm: (state, action) => {
      state.ui.selectedForm = action.payload;
    },

    setSelectedDocument: (state, action) => {
      state.ui.selectedDocument = action.payload;
    },

    setShowPrintPreview: (state, action) => {
      state.ui.showPrintPreview = action.payload;
    },

    setShowReportFilters: (state, action) => {
      state.ui.showReportFilters = action.payload;
    },

    setShowPrintSettings: (state, action) => {
      state.ui.showPrintSettings = action.payload;
    },

    updatePrintSettings: (state, action) => {
      state.printSettings = { ...state.printSettings, ...action.payload };
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    addPrintHistory: (state, action) => {
      const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        user: 'Текущий пользователь',
        status: 'Печать завершена',
        ...action.payload
      };
      state.printHistory.unshift(newRecord);
    },

    generatePrintForm: (state, action) => {
      const { formId, documentId, settings } = action.payload;
      // Логика генерации печатной формы
      console.log('Генерация печатной формы:', { formId, documentId, settings });
    },

    generateReport: (state, action) => {
      const { reportId, filters, settings } = action.payload;
      // Логика генерации отчета
      console.log('Генерация отчета:', { reportId, filters, settings });
    },

    saveFormAsPDF: (state, action) => {
      const { formId, documentId, filename } = action.payload;
      // Логика сохранения в PDF
      console.log('Сохранение в PDF:', { formId, documentId, filename });
    },

    sendFormByEmail: (state, action) => {
      const { formId, documentId, email, subject } = action.payload;
      // Логика отправки по email
      console.log('Отправка по email:', { formId, documentId, email, subject });
    }
  },
});

export const { 
  addForm, 
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
} = printFormsSlice.actions;
export default printFormsSlice.reducer; 