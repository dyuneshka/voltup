import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tuExecutions: [
    {
      id: 1,
      applicationNumber: 'ТУ-2024-001',
      applicantName: 'ООО "ЭнергоСтрой"',
      address: 'г. Москва, ул. Энергетическая, д. 15',
      power: '150 кВт',
      voltage: '0,4 кВ',
      status: 'В процессе проверки',
      stage: 'Проверка документации',
      progress: 60,
      documents: [
        { id: 1, name: 'Акт выполненных работ', status: 'Проверен', date: '2024-01-15' },
        { id: 2, name: 'Схема подключения', status: 'На проверке', date: '2024-01-16' },
        { id: 3, name: 'Протокол испытаний', status: 'Ожидает', date: null }
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
      applicationNumber: 'ТУ-2024-002',
      applicantName: 'ИП Сидоров',
      address: 'г. Москва, ул. Строительная, д. 8',
      power: '75 кВт',
      voltage: '0,4 кВ',
      status: 'Завершена',
      stage: 'Проверка завершена',
      progress: 100,
      documents: [
        { id: 1, name: 'Акт выполненных работ', status: 'Проверен', date: '2024-01-10' },
        { id: 2, name: 'Схема подключения', status: 'Проверен', date: '2024-01-11' },
        { id: 3, name: 'Протокол испытаний', status: 'Проверен', date: '2024-01-12' }
      ],
      comments: [
        { id: 1, author: 'Козлов М.И.', text: 'Все требования выполнены', date: '2024-01-12' }
      ],
      deadline: '2024-01-15',
      priority: 'Средний'
    },
    {
      id: 3,
      applicationNumber: 'ТУ-2024-003',
      applicantName: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Инженерная, д. 22',
      power: '200 кВт',
      voltage: '0,4 кВ',
      status: 'На рассмотрении',
      stage: 'Начальная проверка',
      progress: 25,
      documents: [
        { id: 1, name: 'Акт выполненных работ', status: 'Ожидает', date: null },
        { id: 2, name: 'Схема подключения', status: 'Ожидает', date: null },
        { id: 3, name: 'Протокол испытаний', status: 'Ожидает', date: null }
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

const tuExecutionSlice = createSlice({
  name: 'tuExecution',
  initialState,
  reducers: {
    addTuExecution: (state, action) => {
      state.tuExecutions.push(action.payload);
    },
    updateTuExecution: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.tuExecutions.findIndex(exec => exec.id === id);
      if (index !== -1) {
        state.tuExecutions[index] = { ...state.tuExecutions[index], ...updates };
      }
    },
    addComment: (state, action) => {
      const { executionId, comment } = action.payload;
      const execution = state.tuExecutions.find(exec => exec.id === executionId);
      if (execution) {
        execution.comments.push(comment);
      }
    },
    updateDocumentStatus: (state, action) => {
      const { executionId, documentId, status } = action.payload;
      const execution = state.tuExecutions.find(exec => exec.id === executionId);
      if (execution) {
        const document = execution.documents.find(doc => doc.id === documentId);
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
  addTuExecution, 
  updateTuExecution, 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} = tuExecutionSlice.actions;
export default tuExecutionSlice.reducer;