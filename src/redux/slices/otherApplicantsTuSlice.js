import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otherApplicantsTus: [
    {
      id: 1,
      applicationNumber: 'ТУ-ДЗ-2024-001',
      applicantName: 'ИП Петров А.В.',
      applicantType: 'ИП',
      address: 'г. Москва, ул. Садовая, д. 10',
      power: '25 кВт',
      voltage: '0,4 кВ',
      status: 'В процессе проверки',
      stage: 'Проверка документации',
      progress: 60,
      documents: [
        { id: 1, name: 'Заявка на ТУ', status: 'Проверен', date: '2024-01-15' },
        { id: 2, name: 'Схема подключения', status: 'На проверке', date: '2024-01-16' },
        { id: 3, name: 'Правоустанавливающие документы', status: 'Ожидает', date: null }
      ],
      comments: [
        { id: 1, author: 'Иванов А.П.', text: 'Документация соответствует требованиям', date: '2024-01-15' },
        { id: 2, author: 'Петров В.С.', text: 'Требуется уточнение схемы подключения', date: '2024-01-16' }
      ],
      deadline: '2024-01-25',
      priority: 'Средний'
    },
    {
      id: 2,
      applicationNumber: 'ТУ-ДЗ-2024-002',
      applicantName: 'ГУП "Мосводоканал"',
      applicantType: 'ГУП',
      address: 'г. Москва, ул. Водопроводная, д. 5',
      power: '500 кВт',
      voltage: '10 кВ',
      status: 'Завершена',
      stage: 'Проверка завершена',
      progress: 100,
      documents: [
        { id: 1, name: 'Заявка на ТУ', status: 'Проверен', date: '2024-01-10' },
        { id: 2, name: 'Схема подключения', status: 'Проверен', date: '2024-01-11' },
        { id: 3, name: 'Правоустанавливающие документы', status: 'Проверен', date: '2024-01-12' }
      ],
      comments: [
        { id: 1, author: 'Козлов М.И.', text: 'Все требования выполнены', date: '2024-01-12' }
      ],
      deadline: '2024-01-15',
      priority: 'Высокий'
    },
    {
      id: 3,
      applicationNumber: 'ТУ-ДЗ-2024-003',
      applicantName: 'ОАО "Мосгаз"',
      applicantType: 'ОАО',
      address: 'г. Москва, ул. Газовая, д. 15',
      power: '1 МВт',
      voltage: '10 кВ',
      status: 'На рассмотрении',
      stage: 'Начальная проверка',
      progress: 25,
      documents: [
        { id: 1, name: 'Заявка на ТУ', status: 'Ожидает', date: null },
        { id: 2, name: 'Схема подключения', status: 'Ожидает', date: null },
        { id: 3, name: 'Правоустанавливающие документы', status: 'Ожидает', date: null }
      ],
      comments: [],
      deadline: '2024-01-30',
      priority: 'Критический'
    },
    {
      id: 4,
      applicationNumber: 'ТУ-ДЗ-2024-004',
      applicantName: 'ООО "Торговый центр"',
      applicantType: 'ООО',
      address: 'г. Москва, ул. Торговая, д. 25',
      power: '200 кВт',
      voltage: '0,4 кВ',
      status: 'В процессе проверки',
      stage: 'Проверка документации',
      progress: 40,
      documents: [
        { id: 1, name: 'Заявка на ТУ', status: 'Проверен', date: '2024-01-18' },
        { id: 2, name: 'Схема подключения', status: 'На проверке', date: '2024-01-19' },
        { id: 3, name: 'Правоустанавливающие документы', status: 'Ожидает', date: null }
      ],
      comments: [
        { id: 1, author: 'Новиков А.В.', text: 'Требуется доработка схемы', date: '2024-01-19' }
      ],
      deadline: '2024-01-28',
      priority: 'Средний'
    }
  ],
  filters: {
    status: 'all',
    priority: 'all'
  }
};

const otherApplicantsTuSlice = createSlice({
  name: 'otherApplicantsTu',
  initialState,
  reducers: {
    addOtherApplicantsTu: (state, action) => {
      state.otherApplicantsTus.push(action.payload);
    },
    updateOtherApplicantsTu: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.otherApplicantsTus.findIndex(tu => tu.id === id);
      if (index !== -1) {
        state.otherApplicantsTus[index] = { ...state.otherApplicantsTus[index], ...updates };
      }
    },
    addComment: (state, action) => {
      const { tuId, comment } = action.payload;
      const tu = state.otherApplicantsTus.find(t => t.id === tuId);
      if (tu) {
        tu.comments.push(comment);
      }
    },
    updateDocumentStatus: (state, action) => {
      const { tuId, documentId, status } = action.payload;
      const tu = state.otherApplicantsTus.find(t => t.id === tuId);
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
  addOtherApplicantsTu, 
  updateOtherApplicantsTu, 
  addComment, 
  updateDocumentStatus, 
  setFilters 
} = otherApplicantsTuSlice.actions;
export default otherApplicantsTuSlice.reducer;