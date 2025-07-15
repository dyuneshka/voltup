import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  amendments: [
    {
      id: 1,
      applicationNumber: 'ДС-2024-001',
      contractNumber: 'Д-2024-001',
      applicantName: 'ООО "ЭнергоСтрой"',
      address: 'г. Москва, ул. Энергетическая, д. 15',
      power: '150 кВт',
      voltage: '0,4 кВ',
      amendmentType: 'Изменение мощности',
      status: 'В процессе',
      stage: 'Подготовка документов',
      progress: 60,
      steps: [
        { id: 1, name: 'Подача заявки', status: 'completed', date: '2024-01-10', inspector: 'Иванов А.П.' },
        { id: 2, name: 'Проверка документов', status: 'completed', date: '2024-01-12', inspector: 'Петров В.С.' },
        { id: 3, name: 'Согласование условий', status: 'in-progress', date: '2024-01-15', inspector: 'Сидоров М.И.' },
        { id: 4, name: 'Подписание ДС', status: 'pending', date: null, inspector: null },
        { id: 5, name: 'ДС вступило в силу', status: 'pending', date: null, inspector: null }
      ],
      documents: [
        { id: 1, name: 'Заявка на ДС', status: 'approved', date: '2024-01-10' },
        { id: 2, name: 'Обоснование изменений', status: 'approved', date: '2024-01-11' },
        { id: 3, name: 'Технические условия', status: 'review', date: '2024-01-15' },
        { id: 4, name: 'Проект ДС', status: 'pending', date: null }
      ],
      comments: [
        { id: 1, author: 'Иванов А.П.', text: 'Заявка принята к рассмотрению', date: '2024-01-10' },
        { id: 2, author: 'Петров В.С.', text: 'Документы соответствуют требованиям', date: '2024-01-12' },
        { id: 3, author: 'Сидоров М.И.', text: 'Требуется уточнение технических условий', date: '2024-01-15' }
      ],
      deadline: '2024-01-25',
      priority: 'Высокий',
      reason: 'Увеличение потребления электроэнергии в связи с расширением производства'
    },
    {
      id: 2,
      applicationNumber: 'ДС-2024-002',
      contractNumber: 'Д-2024-002',
      applicantName: 'ИП Сидоров',
      address: 'г. Москва, ул. Строительная, д. 8',
      power: '75 кВт',
      voltage: '0,4 кВ',
      amendmentType: 'Изменение адреса',
      status: 'Завершено',
      stage: 'ДС вступило в силу',
      progress: 100,
      steps: [
        { id: 1, name: 'Подача заявки', status: 'completed', date: '2024-01-05', inspector: 'Козлов М.И.' },
        { id: 2, name: 'Проверка документов', status: 'completed', date: '2024-01-07', inspector: 'Козлов М.И.' },
        { id: 3, name: 'Согласование условий', status: 'completed', date: '2024-01-10', inspector: 'Козлов М.И.' },
        { id: 4, name: 'Подписание ДС', status: 'completed', date: '2024-01-12', inspector: 'Козлов М.И.' },
        { id: 5, name: 'ДС вступило в силу', status: 'completed', date: '2024-01-15', inspector: 'Козлов М.И.' }
      ],
      documents: [
        { id: 1, name: 'Заявка на ДС', status: 'approved', date: '2024-01-05' },
        { id: 2, name: 'Свидетельство о праве собственности', status: 'approved', date: '2024-01-06' },
        { id: 3, name: 'Технические условия', status: 'approved', date: '2024-01-10' },
        { id: 4, name: 'Дополнительное соглашение', status: 'approved', date: '2024-01-12' }
      ],
      comments: [
        { id: 1, author: 'Козлов М.И.', text: 'Дополнительное соглашение успешно заключено', date: '2024-01-15' }
      ],
      deadline: '2024-01-15',
      priority: 'Средний',
      reason: 'Переезд на новый адрес'
    },
    {
      id: 3,
      applicationNumber: 'ДС-2024-003',
      contractNumber: 'Д-2024-003',
      applicantName: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Инженерная, д. 22',
      power: '200 кВт',
      voltage: '0,4 кВ',
      amendmentType: 'Изменение схемы подключения',
      status: 'На рассмотрении',
      stage: 'Подача заявки',
      progress: 20,
      steps: [
        { id: 1, name: 'Подача заявки', status: 'in-progress', date: '2024-01-18', inspector: 'Новиков А.В.' },
        { id: 2, name: 'Проверка документов', status: 'pending', date: null, inspector: null },
        { id: 3, name: 'Согласование условий', status: 'pending', date: null, inspector: null },
        { id: 4, name: 'Подписание ДС', status: 'pending', date: null, inspector: null },
        { id: 5, name: 'ДС вступило в силу', status: 'pending', date: null, inspector: null }
      ],
      documents: [
        { id: 1, name: 'Заявка на ДС', status: 'review', date: '2024-01-18' },
        { id: 2, name: 'Новая схема подключения', status: 'pending', date: null },
        { id: 3, name: 'Обоснование изменений', status: 'pending', date: null },
        { id: 4, name: 'Проект ДС', status: 'pending', date: null }
      ],
      comments: [
        { id: 1, author: 'Новиков А.В.', text: 'Требуется доработка схемы подключения', date: '2024-01-18' }
      ],
      deadline: '2024-01-30',
      priority: 'Критический',
      reason: 'Изменение схемы электроснабжения объекта'
    },
    {
      id: 4,
      applicationNumber: 'ДС-2024-004',
      contractNumber: 'Д-2024-004',
      applicantName: 'ООО "Торговый центр"',
      address: 'г. Москва, ул. Торговая, д. 25',
      power: '300 кВт',
      voltage: '0,4 кВ',
      amendmentType: 'Изменение категории надежности',
      status: 'В процессе',
      stage: 'Согласование условий',
      progress: 80,
      steps: [
        { id: 1, name: 'Подача заявки', status: 'completed', date: '2024-01-20', inspector: 'Смирнов П.К.' },
        { id: 2, name: 'Проверка документов', status: 'completed', date: '2024-01-22', inspector: 'Смирнов П.К.' },
        { id: 3, name: 'Согласование условий', status: 'in-progress', date: '2024-01-25', inspector: 'Смирнов П.К.' },
        { id: 4, name: 'Подписание ДС', status: 'pending', date: null, inspector: null },
        { id: 5, name: 'ДС вступило в силу', status: 'pending', date: null, inspector: null }
      ],
      documents: [
        { id: 1, name: 'Заявка на ДС', status: 'approved', date: '2024-01-20' },
        { id: 2, name: 'Обоснование изменений', status: 'approved', date: '2024-01-21' },
        { id: 3, name: 'Технические условия', status: 'review', date: '2024-01-25' },
        { id: 4, name: 'Проект ДС', status: 'pending', date: null }
      ],
      comments: [
        { id: 1, author: 'Смирнов П.К.', text: 'Заявка принята к рассмотрению', date: '2024-01-20' },
        { id: 2, author: 'Смирнов П.К.', text: 'Документы проверены, требуется согласование', date: '2024-01-22' }
      ],
      deadline: '2024-01-28',
      priority: 'Высокий',
      reason: 'Повышение категории надежности электроснабжения'
    }
  ],
  filters: {
    status: 'all',
    priority: 'all',
    amendmentType: 'all'
  }
};

const contractAmendmentSlice = createSlice({
  name: 'contractAmendment',
  initialState,
  reducers: {
    addAmendment: (state, action) => {
      state.amendments.push(action.payload);
    },
    updateAmendment: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.amendments.findIndex(amendment => amendment.id === id);
      if (index !== -1) {
        state.amendments[index] = { ...state.amendments[index], ...updates };
      }
    },
    updateStep: (state, action) => {
      const { amendmentId, stepId, status, inspector } = action.payload;
      const amendment = state.amendments.find(a => a.id === amendmentId);
      if (amendment) {
        const step = amendment.steps.find(s => s.id === stepId);
        if (step) {
          step.status = status;
          step.date = new Date().toISOString().split('T')[0];
          step.inspector = inspector;
        }
      }
    },
    addComment: (state, action) => {
      const { amendmentId, comment } = action.payload;
      const amendment = state.amendments.find(a => a.id === amendmentId);
      if (amendment) {
        amendment.comments.push(comment);
      }
    },
    updateDocumentStatus: (state, action) => {
      const { amendmentId, documentId, status } = action.payload;
      const amendment = state.amendments.find(a => a.id === amendmentId);
      if (amendment) {
        const document = amendment.documents.find(doc => doc.id === documentId);
        if (document) {
          document.status = status;
          document.date = new Date().toISOString().split('T')[0];
        }
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
});

export const { 
  addAmendment, 
  updateAmendment, 
  updateStep, 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} = contractAmendmentSlice.actions;
export default contractAmendmentSlice.reducer; 