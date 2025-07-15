import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  highVoltageTus: [
    {
      id: 1,
      applicationNumber: 'ТУ-ВН-2024-001',
      applicantName: 'ООО "ЭнергоСтрой"',
      address: 'г. Москва, ул. Энергетическая, д. 15',
      power: '50 МВт',
      voltage: '110 кВ',
      status: 'В процессе проверки',
      stage: 'Проверка документации',
      progress: 60,
      documents: [
        { id: 1, name: 'Проект ТУ', status: 'Проверен', date: '2024-01-15' },
        { id: 2, name: 'Схема подключения', status: 'На проверке', date: '2024-01-16' },
        { id: 3, name: 'Расчеты токов КЗ', status: 'Ожидает', date: null }
      ],
      comments: [
        { id: 1, author: 'Иванов А.П.', text: 'Документация соответствует требованиям', date: '2024-01-15' },
        { id: 2, author: 'Петров В.С.', text: 'Требуется уточнение схемы подключения', date: '2024-01-16' }
      ],
      deadline: '2024-01-25',
      priority: 'Высокий'
    },
    {
      id: 2,
      applicationNumber: 'ТУ-ВН-2024-002',
      applicantName: 'ОАО "МосЭнерго"',
      address: 'г. Москва, ул. Строительная, д. 8',
      power: '100 МВт',
      voltage: '220 кВ',
      status: 'Завершена',
      stage: 'Проверка завершена',
      progress: 100,
      documents: [
        { id: 1, name: 'Проект ТУ', status: 'Проверен', date: '2024-01-10' },
        { id: 2, name: 'Схема подключения', status: 'Проверен', date: '2024-01-11' },
        { id: 3, name: 'Расчеты токов КЗ', status: 'Проверен', date: '2024-01-12' }
      ],
      comments: [
        { id: 1, author: 'Козлов М.И.', text: 'Все требования выполнены', date: '2024-01-12' }
      ],
      deadline: '2024-01-15',
      priority: 'Средний'
    },
    {
      id: 3,
      applicationNumber: 'ТУ-ВН-2024-003',
      applicantName: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Инженерная, д. 22',
      power: '200 МВт',
      voltage: '330 кВ',
      status: 'На рассмотрении',
      stage: 'Начальная проверка',
      progress: 25,
      documents: [
        { id: 1, name: 'Проект ТУ', status: 'Ожидает', date: null },
        { id: 2, name: 'Схема подключения', status: 'Ожидает', date: null },
        { id: 3, name: 'Расчеты токов КЗ', status: 'Ожидает', date: null }
      ],
      comments: [],
      deadline: '2024-01-30',
      priority: 'Критический'
    }
  ],
  filters: {
    status: 'all',
    priority: 'all'
  }
};

const highVoltageTuSlice = createSlice({
  name: 'highVoltageTu',
  initialState,
  reducers: {
    addHighVoltageTu: (state, action) => {
      state.highVoltageTus.push(action.payload);
    },
    updateHighVoltageTu: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.highVoltageTus.findIndex(tu => tu.id === id);
      if (index !== -1) {
        state.highVoltageTus[index] = { ...state.highVoltageTus[index], ...updates };
      }
    },
    addComment: (state, action) => {
      const { tuId, comment } = action.payload;
      const tu = state.highVoltageTus.find(t => t.id === tuId);
      if (tu) {
        tu.comments.push(comment);
      }
    },
    updateDocumentStatus: (state, action) => {
      const { tuId, documentId, status } = action.payload;
      const tu = state.highVoltageTus.find(t => t.id === tuId);
      if (tu) {
        const document = tu.documents.find(doc => doc.id === documentId);
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
  addHighVoltageTu, 
  updateHighVoltageTu, 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} = highVoltageTuSlice.actions;
export default highVoltageTuSlice.reducer;