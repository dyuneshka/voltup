import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tariffs: [
    {
      id: 1,
      voltage: 'НН',
      voltageDescription: 'до 0,4 кВ',
      powerFrom: 0,
      powerTo: 150,
      settlementType: 'Городской',
      rate: 'С1',
      workType: 'Подключение к электрическим сетям',
      capitalCostType: 'Строительство ВЛ',
      costIndex: 1.0,
      ratePerKw: 2500,
      standardizedRate: 2500,
      multiplyByIndex: false,
      multiplyByPower: true,
      multiplyByQuantity: false,
      status: 'Активный',
      effectiveDate: '2024-01-01',
      createdBy: 'Иванов А.П.',
      lastModified: '2024-01-15'
    },
    {
      id: 2,
      voltage: 'СН2',
      voltageDescription: 'от 1 до 20 кВ',
      powerFrom: 150,
      powerTo: 670,
      settlementType: 'Городской',
      rate: 'С2',
      workType: 'Строительство ВЛ',
      capitalCostType: 'Строительство ВЛ',
      costIndex: 0.5,
      ratePerKw: 1800,
      standardizedRate: 1800,
      multiplyByIndex: true,
      multiplyByPower: false,
      multiplyByQuantity: true,
      status: 'Активный',
      effectiveDate: '2024-01-01',
      createdBy: 'Петров В.С.',
      lastModified: '2024-01-10'
    },
    {
      id: 3,
      voltage: 'СН1',
      voltageDescription: '35 кВ',
      powerFrom: 670,
      powerTo: 10000,
      settlementType: 'Сельский',
      rate: 'С3',
      workType: 'Строительство КЛ',
      capitalCostType: 'Строительство КЛ',
      costIndex: 1.0,
      ratePerKw: 3200,
      standardizedRate: 3200,
      multiplyByIndex: false,
      multiplyByPower: true,
      multiplyByQuantity: false,
      status: 'Активный',
      effectiveDate: '2024-01-01',
      createdBy: 'Сидоров М.И.',
      lastModified: '2024-01-12'
    },
    {
      id: 4,
      voltage: 'ВН',
      voltageDescription: '110 кВ и выше',
      powerFrom: 10000,
      powerTo: null,
      settlementType: 'Городской',
      rate: 'С4',
      workType: 'Строительство ПС',
      capitalCostType: 'Строительство ПС',
      costIndex: 1.0,
      ratePerKw: 4500,
      standardizedRate: 4500,
      multiplyByIndex: false,
      multiplyByPower: true,
      multiplyByQuantity: false,
      status: 'Активный',
      effectiveDate: '2024-01-01',
      createdBy: 'Козлов М.И.',
      lastModified: '2024-01-08'
    },
    {
      id: 5,
      voltage: 'НН',
      voltageDescription: 'до 0,4 кВ',
      powerFrom: 0,
      powerTo: 100,
      settlementType: 'Сельский',
      rate: 'С1',
      workType: 'Подключение к электрическим сетям',
      capitalCostType: 'Строительство ВЛ',
      costIndex: 0.8,
      ratePerKw: 2000,
      standardizedRate: 2000,
      multiplyByIndex: true,
      multiplyByPower: true,
      multiplyByQuantity: false,
      status: 'Активный',
      effectiveDate: '2024-01-01',
      createdBy: 'Новиков А.В.',
      lastModified: '2024-01-20'
    }
  ],
  workTypes: [
    'Подключение к электрическим сетям',
    'Строительство ВЛ',
    'Строительство КЛ',
    'Строительство ПС',
    'Реконструкция сетей',
    'Техническое обслуживание'
  ],
  capitalCostTypes: [
    'Строительство ВЛ',
    'Строительство КЛ',
    'Строительство ПС',
    'Реконструкция сетей',
    'Техническое обслуживание'
  ],
  filters: {
    voltage: 'all',
    settlementType: 'all',
    status: 'all',
    workType: 'all'
  },
  activeTab: 'new', // 'new' или 'old'
  showAddForm: false
};

const tariffManagementSlice = createSlice({
  name: 'tariffManagement',
  initialState,
  reducers: {
    addTariff: (state, action) => {
      const newTariff = {
        ...action.payload,
        id: Date.now(),
        status: 'Активный',
        effectiveDate: new Date().toISOString().split('T')[0],
        createdBy: 'Текущий пользователь',
        lastModified: new Date().toISOString().split('T')[0]
      };
      state.tariffs.push(newTariff);
    },
    updateTariff: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.tariffs.findIndex(tariff => tariff.id === id);
      if (index !== -1) {
        state.tariffs[index] = { 
          ...state.tariffs[index], 
          ...updates,
          lastModified: new Date().toISOString().split('T')[0]
        };
      }
    },
    deleteTariff: (state, action) => {
      const index = state.tariffs.findIndex(tariff => tariff.id === action.payload);
      if (index !== -1) {
        state.tariffs.splice(index, 1);
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowAddForm: (state, action) => {
      state.showAddForm = action.payload;
    },
    toggleTariffStatus: (state, action) => {
      const tariff = state.tariffs.find(t => t.id === action.payload);
      if (tariff) {
        tariff.status = tariff.status === 'Активный' ? 'Неактивный' : 'Активный';
        tariff.lastModified = new Date().toISOString().split('T')[0];
      }
    }
  },
});

export const { 
  addTariff, 
  updateTariff, 
  deleteTariff, 
  setFilters, 
  setActiveTab, 
  setShowAddForm,
  toggleTariffStatus
} = tariffManagementSlice.actions;
export default tariffManagementSlice.reducer; 