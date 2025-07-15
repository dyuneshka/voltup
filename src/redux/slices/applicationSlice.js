import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [],
  },
  reducers: {
    submitApplication: (state, action) => {
      // Добавляем новую заявку с полными данными
      const newApplication = {
        ...action.payload,
        id: Date.now(),
        status: 'Заполнена',
        submittedAt: new Date().toISOString(),
        // Добавляем поля, которые нужны для EmployeePanel
        power: '',
        stages: [],
        designDeadline: '',
        operationDeadline: '',
        assoData: {
          applicantType: 'Юридическое лицо',
          requestType: 'Электронная заявка',
          submissionMethod: 'Онлайн',
          requestTypeAso: 'Техническое присоединение',
          connectionType: 'Новая точка',
          loadNature: 'Промышленная',
          notificationMethod: 'Электронная почта',
          documentDelivery: 'Электронно',
        },
        objectData: {
          energyDevice: '',
          yearOfOperation: '',
          objectType: 'Промышленный объект',
          locationType: 'Городская местность',
          cadastralNumber: '',
        },
        files: [],
        otr: null,
      };
      state.applications.push(newApplication);
    },
    verifyApplication: (state, action) => {
      const { id, ...updates } = action.payload;
      const appIndex = state.applications.findIndex(app => app.id === id);
      if (appIndex !== -1) {
        // Обновляем существующую заявку
        state.applications[appIndex] = { ...state.applications[appIndex], ...updates };
      } else {
        // Добавляем новую заявку с полными данными
        state.applications.push({ id, ...updates });
      }
    },
    addApplication: (state, action) => {
      // Отдельный action для добавления новых заявок
      state.applications.push(action.payload);
    },
    updateApplicationStatus: (state, action) => {
      const { id, verificationStatus } = action.payload;
      const appIndex = state.applications.findIndex(app => app.id === id);
      if (appIndex !== -1) {
        state.applications[appIndex].verificationStatus = verificationStatus;
        if (verificationStatus === 'Успешно') {
          state.applications[appIndex].status = 'Проверена';
        } else if (verificationStatus === 'Ошибка в документах') {
          state.applications[appIndex].status = 'Отклонена';
        }
      }
    },
  },
});

export const { submitApplication, verifyApplication, addApplication, updateApplicationStatus } = applicationSlice.actions;
export default applicationSlice.reducer;