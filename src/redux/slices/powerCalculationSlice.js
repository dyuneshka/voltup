import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Документы "Измерение режима дня"
  dailyModeMeasurements: [
    {
      id: 1,
      number: 'ИРД-2024-001',
      organization: 'ООО "ЭнергоСеть"',
      measurementDate: '2024-02-15',
      modeDay: 'Зимний',
      status: 'Проведен',
      responsible: 'Иванов А.П.',
      createdDate: '2024-02-15',
      powerCenters: [
        {
          id: 1,
          name: 'ПС-110кВ "Центральная"',
          voltage: '110 кВ',
          seasonality: true,
          transformers: [
            {
              id: 1,
              name: 'ТР-1',
              power: 25,
              maxLoad: 18.5,
              maxLoadPercent: 74,
              emergencyLoad: 85,
              emergencyLoadPercent: 340
            },
            {
              id: 2,
              name: 'ТР-2',
              power: 25,
              maxLoad: 16.2,
              maxLoadPercent: 64.8,
              emergencyLoad: 80,
              emergencyLoadPercent: 320
            }
          ],
          totalMaxLoad: 34.7,
          totalMaxLoadPercent: 69.4
        },
        {
          id: 2,
          name: 'ПС-35кВ "Северная"',
          voltage: '35 кВ',
          seasonality: false,
          transformers: [
            {
              id: 3,
              name: 'ТР-1',
              power: 10,
              maxLoad: 7.8,
              maxLoadPercent: 78,
              emergencyLoad: 12,
              emergencyLoadPercent: 120
            }
          ],
          totalMaxLoad: 7.8,
          totalMaxLoadPercent: 78
        }
      ],
      technologicalOperations: {
        redistribution: 0,
        powerTransfer: 0,
        lossReduction: 0
      }
    }
  ],

  // Документы "Расчет загрузки центров питания"
  powerCenterCalculations: [
    {
      id: 1,
      number: 'РЗЦП-2024-001',
      organization: 'ООО "ЭнергоСеть"',
      responsible: 'Петров В.С.',
      calculationDate: '2024-02-16',
      status: 'Проведен',
      createdDate: '2024-02-16',
      powerCenters: [
        {
          id: 1,
          name: 'ПС-110кВ "Центральная"',
          voltage: '110 кВ',
          totalPower: 50,
          currentLoad: 34.7,
          currentLoadPercent: 69.4,
          technologicalConnections: 5.2,
          futureLoad: 39.9,
          futureLoadPercent: 79.8,
          deficit: 0,
          deficitPercent: 0,
          surplus: 10.1,
          surplusPercent: 20.2,
          status: 'Профицит'
        },
        {
          id: 2,
          name: 'ПС-35кВ "Северная"',
          voltage: '35 кВ',
          totalPower: 10,
          currentLoad: 7.8,
          currentLoadPercent: 78,
          technologicalConnections: 2.1,
          futureLoad: 9.9,
          futureLoadPercent: 99,
          deficit: 0,
          deficitPercent: 0,
          surplus: 0.1,
          surplusPercent: 1,
          status: 'Норма'
        },
        {
          id: 3,
          name: 'ПС-35кВ "Южная"',
          voltage: '35 кВ',
          totalPower: 16,
          currentLoad: 14.2,
          currentLoadPercent: 88.75,
          technologicalConnections: 3.5,
          futureLoad: 17.7,
          futureLoadPercent: 110.6,
          deficit: 1.7,
          deficitPercent: 10.6,
          surplus: 0,
          surplusPercent: 0,
          status: 'Дефицит'
        }
      ]
    }
  ],

  // Отчеты по загрузке центров питания
  powerCenterReports: [
    {
      id: 1,
      reportDate: '2024-02-16',
      organization: 'ООО "ЭнергоСеть"',
      voltageClass: '35 кВ и выше',
      status: 'Сформирован',
      data: [
        {
          powerCenter: 'ПС-110кВ "Центральная"',
          voltage: '110 кВ',
          totalPower: 50,
          currentLoad: 34.7,
          currentLoadPercent: 69.4,
          futureLoad: 39.9,
          futureLoadPercent: 79.8,
          deficit: 0,
          surplus: 10.1,
          status: 'Профицит'
        },
        {
          powerCenter: 'ПС-35кВ "Северная"',
          voltage: '35 кВ',
          totalPower: 10,
          currentLoad: 7.8,
          currentLoadPercent: 78,
          futureLoad: 9.9,
          futureLoadPercent: 99,
          deficit: 0,
          surplus: 0.1,
          status: 'Норма'
        },
        {
          powerCenter: 'ПС-35кВ "Южная"',
          voltage: '35 кВ',
          totalPower: 16,
          currentLoad: 14.2,
          currentLoadPercent: 88.75,
          futureLoad: 17.7,
          futureLoadPercent: 110.6,
          deficit: 1.7,
          surplus: 0,
          status: 'Дефицит'
        }
      ]
    }
  ],

  // Справочники
  organizations: [
    { id: 1, name: 'ООО "ЭнергоСеть"', code: 'ENS' },
    { id: 2, name: 'ООО "ЭнергоСтрой"', code: 'EST' },
    { id: 3, name: 'ООО "ТехСтрой"', code: 'TST' }
  ],

  powerCenters: [
    { id: 1, name: 'ПС-110кВ "Центральная"', voltage: '110 кВ', organization: 1 },
    { id: 2, name: 'ПС-35кВ "Северная"', voltage: '35 кВ', organization: 1 },
    { id: 3, name: 'ПС-35кВ "Южная"', voltage: '35 кВ', organization: 1 },
    { id: 4, name: 'ПС-110кВ "Западная"', voltage: '110 кВ', organization: 2 },
    { id: 5, name: 'ПС-35кВ "Восточная"', voltage: '35 кВ', organization: 2 }
  ],

  voltageClasses: [
    { id: 1, name: '35 кВ', value: '35' },
    { id: 2, name: '110 кВ', value: '110' },
    { id: 3, name: '220 кВ', value: '220' },
    { id: 4, name: '500 кВ', value: '500' }
  ],

  // Состояние интерфейса
  ui: {
    activeTab: 'measurements', // measurements, calculations, reports
    selectedDocument: null,
    showCreateModal: false,
    showPowerCenterModal: false,
    showReportFilters: false,
    editingMode: false
  },

  // Фильтры
  filters: {
    organization: 'all',
    dateFrom: '',
    dateTo: '',
    voltageClass: 'all',
    status: 'all'
  },

  // Настройки регламентных заданий
  scheduledTasks: [
    {
      id: 1,
      name: '(урск) Расчет загрузки ЦП',
      description: 'Автоматический расчет загрузки центров питания',
      schedule: '0 2 * * *', // Ежедневно в 2:00
      status: 'Активно',
      lastRun: '2024-02-16 02:00:00',
      nextRun: '2024-02-17 02:00:00'
    }
  ]
};

const powerCalculationSlice = createSlice({
  name: 'powerCalculation',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },

    setSelectedDocument: (state, action) => {
      state.ui.selectedDocument = action.payload;
    },

    setShowCreateModal: (state, action) => {
      state.ui.showCreateModal = action.payload;
    },

    setShowPowerCenterModal: (state, action) => {
      state.ui.showPowerCenterModal = action.payload;
    },

    setShowReportFilters: (state, action) => {
      state.ui.showReportFilters = action.payload;
    },

    setEditingMode: (state, action) => {
      state.ui.editingMode = action.payload;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Документы "Измерение режима дня"
    createDailyModeMeasurement: (state, action) => {
      const newDocument = {
        id: Date.now(),
        number: `ИРД-${new Date().getFullYear()}-${String(state.dailyModeMeasurements.length + 1).padStart(3, '0')}`,
        status: 'Черновик',
        createdDate: new Date().toISOString().split('T')[0],
        powerCenters: [],
        technologicalOperations: {
          redistribution: 0,
          powerTransfer: 0,
          lossReduction: 0
        },
        ...action.payload
      };
      state.dailyModeMeasurements.unshift(newDocument);
    },

    updateDailyModeMeasurement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.dailyModeMeasurements.findIndex(doc => doc.id === id);
      if (index !== -1) {
        state.dailyModeMeasurements[index] = { ...state.dailyModeMeasurements[index], ...updates };
      }
    },

    addPowerCenterToMeasurement: (state, action) => {
      const { documentId, powerCenter } = action.payload;
      const document = state.dailyModeMeasurements.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters.push(powerCenter);
      }
    },

    removePowerCenterFromMeasurement: (state, action) => {
      const { documentId, powerCenterId } = action.payload;
      const document = state.dailyModeMeasurements.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters = document.powerCenters.filter(pc => pc.id !== powerCenterId);
      }
    },

    updateTransformerData: (state, action) => {
      const { documentId, powerCenterId, transformerId, updates } = action.payload;
      const document = state.dailyModeMeasurements.find(doc => doc.id === documentId);
      if (document) {
        const powerCenter = document.powerCenters.find(pc => pc.id === powerCenterId);
        if (powerCenter) {
          const transformer = powerCenter.transformers.find(t => t.id === transformerId);
          if (transformer) {
            Object.assign(transformer, updates);
            // Пересчет процентов
            if (updates.maxLoad !== undefined) {
              transformer.maxLoadPercent = (updates.maxLoad / transformer.power) * 100;
            }
            if (updates.emergencyLoad !== undefined) {
              transformer.emergencyLoadPercent = (updates.emergencyLoad / transformer.power) * 100;
            }
          }
        }
      }
    },

    calculateMeasurementLoad: (state, action) => {
      const { documentId } = action.payload;
      const document = state.dailyModeMeasurements.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters.forEach(powerCenter => {
          let totalMaxLoad = 0;
          let totalMaxLoadPercent = 0;
          
          powerCenter.transformers.forEach(transformer => {
            totalMaxLoad += transformer.maxLoad || 0;
            totalMaxLoadPercent += transformer.maxLoadPercent || 0;
          });
          
          powerCenter.totalMaxLoad = totalMaxLoad;
          powerCenter.totalMaxLoadPercent = totalMaxLoadPercent / powerCenter.transformers.length;
        });
      }
    },

    conductDailyModeMeasurement: (state, action) => {
      const { documentId } = action.payload;
      const document = state.dailyModeMeasurements.find(doc => doc.id === documentId);
      if (document) {
        document.status = 'Проведен';
      }
    },

    // Документы "Расчет загрузки центров питания"
    createPowerCenterCalculation: (state, action) => {
      const newDocument = {
        id: Date.now(),
        number: `РЗЦП-${new Date().getFullYear()}-${String(state.powerCenterCalculations.length + 1).padStart(3, '0')}`,
        status: 'Черновик',
        createdDate: new Date().toISOString().split('T')[0],
        calculationDate: new Date().toISOString().split('T')[0],
        powerCenters: [],
        ...action.payload
      };
      state.powerCenterCalculations.unshift(newDocument);
    },

    updatePowerCenterCalculation: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.powerCenterCalculations.findIndex(doc => doc.id === id);
      if (index !== -1) {
        state.powerCenterCalculations[index] = { ...state.powerCenterCalculations[index], ...updates };
      }
    },

    fillPowerCenters: (state, action) => {
      const { documentId, organizationId } = action.payload;
      const document = state.powerCenterCalculations.find(doc => doc.id === documentId);
      if (document) {
        const orgPowerCenters = state.powerCenters.filter(pc => pc.organization === organizationId);
        document.powerCenters = orgPowerCenters.map(pc => ({
          id: pc.id,
          name: pc.name,
          voltage: pc.voltage,
          totalPower: 0,
          currentLoad: 0,
          currentLoadPercent: 0,
          technologicalConnections: 0,
          futureLoad: 0,
          futureLoadPercent: 0,
          deficit: 0,
          deficitPercent: 0,
          surplus: 0,
          surplusPercent: 0,
          status: 'Норма'
        }));
      }
    },

    addPowerCenterToCalculation: (state, action) => {
      const { documentId, powerCenter } = action.payload;
      const document = state.powerCenterCalculations.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters.push(powerCenter);
      }
    },

    removePowerCenterFromCalculation: (state, action) => {
      const { documentId, powerCenterId } = action.payload;
      const document = state.powerCenterCalculations.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters = document.powerCenters.filter(pc => pc.id !== powerCenterId);
      }
    },

    calculatePowerCenterLoad: (state, action) => {
      const { documentId } = action.payload;
      const document = state.powerCenterCalculations.find(doc => doc.id === documentId);
      if (document) {
        document.powerCenters.forEach(powerCenter => {
          // Расчет будущей нагрузки
          powerCenter.futureLoad = powerCenter.currentLoad + powerCenter.technologicalConnections;
          powerCenter.futureLoadPercent = (powerCenter.futureLoad / powerCenter.totalPower) * 100;
          
          // Определение дефицита/профицита
          if (powerCenter.futureLoad > powerCenter.totalPower) {
            powerCenter.deficit = powerCenter.futureLoad - powerCenter.totalPower;
            powerCenter.deficitPercent = (powerCenter.deficit / powerCenter.totalPower) * 100;
            powerCenter.surplus = 0;
            powerCenter.surplusPercent = 0;
            powerCenter.status = 'Дефицит';
          } else {
            powerCenter.surplus = powerCenter.totalPower - powerCenter.futureLoad;
            powerCenter.surplusPercent = (powerCenter.surplus / powerCenter.totalPower) * 100;
            powerCenter.deficit = 0;
            powerCenter.deficitPercent = 0;
            powerCenter.status = powerCenter.futureLoadPercent > 80 ? 'Норма' : 'Профицит';
          }
        });
      }
    },

    conductPowerCenterCalculation: (state, action) => {
      const { documentId } = action.payload;
      const document = state.powerCenterCalculations.find(doc => doc.id === documentId);
      if (document) {
        document.status = 'Проведен';
      }
    },

    // Отчеты
    generatePowerCenterReport: (state, action) => {
      const { reportDate, organization, voltageClass } = action.payload;
      const newReport = {
        id: Date.now(),
        reportDate,
        organization,
        voltageClass,
        status: 'Сформирован',
        data: []
      };
      
      // Получение данных из проведенных расчетов
      const calculations = state.powerCenterCalculations.filter(
        calc => calc.status === 'Проведен' && calc.organization === organization
      );
      
      if (calculations.length > 0) {
        const latestCalculation = calculations[0];
        newReport.data = latestCalculation.powerCenters
          .filter(pc => {
            const voltage = parseInt(pc.voltage);
            return voltageClass === 'all' || voltage >= parseInt(voltageClass);
          })
          .map(pc => ({
            powerCenter: pc.name,
            voltage: pc.voltage,
            totalPower: pc.totalPower,
            currentLoad: pc.currentLoad,
            currentLoadPercent: pc.currentLoadPercent,
            futureLoad: pc.futureLoad,
            futureLoadPercent: pc.futureLoadPercent,
            deficit: pc.deficit,
            surplus: pc.surplus,
            status: pc.status
          }));
      }
      
      state.powerCenterReports.unshift(newReport);
    },

    // Регламентные задания
    updateScheduledTask: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.scheduledTasks.findIndex(task => task.id === id);
      if (index !== -1) {
        state.scheduledTasks[index] = { ...state.scheduledTasks[index], ...updates };
      }
    },

    runScheduledTask: (state, action) => {
      const { taskId } = action.payload;
      const task = state.scheduledTasks.find(t => t.id === taskId);
      if (task) {
        task.lastRun = new Date().toISOString();
        // Логика выполнения задания
        console.log(`Выполняется задание: ${task.name}`);
      }
    }
  },
});

export const { 
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
} = powerCalculationSlice.actions;
export default powerCalculationSlice.reducer; 