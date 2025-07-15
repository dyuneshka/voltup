import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Проекты договоров на технологическое присоединение
  contractProjects: [
    {
      id: 1,
      contractNumber: 'Д-2024-001',
      applicantName: 'ООО "ЭнергоСтрой"',
      address: 'г. Москва, ул. Энергетическая, д. 15',
      power: '150 кВт',
      voltage: '0,4 кВ',
      status: 'В работе',
      oksFlag: true,
      startDate: '2024-01-10',
      endDate: '2024-06-30',
      responsible: 'Иванов А.П.',
      budget: 2500000,
      progress: 65
    },
    {
      id: 2,
      contractNumber: 'Д-2024-002',
      applicantName: 'ИП Сидоров',
      address: 'г. Москва, ул. Строительная, д. 8',
      power: '75 кВт',
      voltage: '0,4 кВ',
      status: 'Завершен',
      oksFlag: true,
      startDate: '2024-01-05',
      endDate: '2024-05-15',
      responsible: 'Петров В.С.',
      budget: 1200000,
      progress: 100
    },
    {
      id: 3,
      contractNumber: 'Д-2024-003',
      applicantName: 'ООО "ТехСтрой"',
      address: 'г. Москва, ул. Инженерная, д. 22',
      power: '200 кВт',
      voltage: '0,4 кВ',
      status: 'Планирование',
      oksFlag: true,
      startDate: '2024-02-01',
      endDate: '2024-08-30',
      responsible: 'Сидоров М.И.',
      budget: 3500000,
      progress: 15
    }
  ],
  
  // Мероприятия, выполняемые сетевой организацией
  networkEvents: [
    {
      id: 1,
      contractId: 1,
      eventName: 'Строительство ВЛ 0,4 кВ',
      capitalCostType: 'Строительство',
      constructionObject: 'ОС-2024-001',
      status: 'В работе',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      responsible: 'Козлов М.И.',
      budget: 1500000,
      progress: 70,
      description: 'Строительство воздушной линии 0,4 кВ протяженностью 500м'
    },
    {
      id: 2,
      contractId: 1,
      eventName: 'Монтаж ТП',
      capitalCostType: 'Строительство',
      constructionObject: 'ОС-2024-001',
      status: 'Завершен',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      responsible: 'Новиков А.В.',
      budget: 800000,
      progress: 100,
      description: 'Монтаж трансформаторной подстанции 160 кВА'
    },
    {
      id: 3,
      contractId: 2,
      eventName: 'Реконструкция ВЛ',
      capitalCostType: 'Реконструкция',
      constructionObject: 'ОС-2024-002',
      status: 'Завершен',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      responsible: 'Смирнов П.К.',
      budget: 1000000,
      progress: 100,
      description: 'Реконструкция существующей ВЛ 0,4 кВ'
    },
    {
      id: 4,
      contractId: 3,
      eventName: 'Строительство КЛ',
      capitalCostType: 'Строительство',
      constructionObject: null,
      status: 'Планирование',
      startDate: '2024-02-15',
      endDate: '2024-07-15',
      responsible: 'Волков И.С.',
      budget: 2000000,
      progress: 10,
      description: 'Строительство кабельной линии 0,4 кВ'
    }
  ],
  
  // Объекты строительства по договору
  contractConstructionObjects: [
    {
      id: 1,
      objectNumber: 'ОС-2024-001',
      objectName: 'Строительство ВЛ и ТП для ООО "ЭнергоСтрой"',
      contractId: 1,
      status: 'В работе',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      responsible: 'Иванов А.П.',
      budget: 2300000,
      progress: 75,
      events: [1, 2],
      location: 'г. Москва, ул. Энергетическая, д. 15'
    },
    {
      id: 2,
      objectNumber: 'ОС-2024-002',
      objectName: 'Реконструкция ВЛ для ИП Сидоров',
      contractId: 2,
      status: 'Завершен',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      responsible: 'Петров В.С.',
      budget: 1000000,
      progress: 100,
      events: [3],
      location: 'г. Москва, ул. Строительная, д. 8'
    }
  ],
  
  // Объекты строительства (общий список)
  constructionObjects: [
    {
      id: 1,
      objectNumber: 'ОС-2024-001',
      objectName: 'Строительство ВЛ и ТП для ООО "ЭнергоСтрой"',
      status: 'В работе',
      type: 'Строительство',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      responsible: 'Иванов А.П.',
      budget: 2300000,
      progress: 75,
      location: 'г. Москва, ул. Энергетическая, д. 15',
      description: 'Комплексное строительство объектов электроснабжения'
    },
    {
      id: 2,
      objectNumber: 'ОС-2024-002',
      objectName: 'Реконструкция ВЛ для ИП Сидоров',
      status: 'Завершен',
      type: 'Реконструкция',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      responsible: 'Петров В.С.',
      budget: 1000000,
      progress: 100,
      location: 'г. Москва, ул. Строительная, д. 8',
      description: 'Реконструкция существующих сетей'
    },
    {
      id: 3,
      objectNumber: 'ОС-2023-015',
      objectName: 'Строительство ПС 110/10 кВ',
      status: 'Завершен',
      type: 'Строительство',
      startDate: '2023-06-01',
      endDate: '2023-12-15',
      responsible: 'Козлов М.И.',
      budget: 15000000,
      progress: 100,
      location: 'г. Москва, ул. Промышленная, д. 25',
      description: 'Строительство подстанции 110/10 кВ'
    }
  ],
  
  // Задачи
  tasks: [
    {
      id: 1,
      objectId: 1,
      taskName: 'Разработка проектной документации',
      status: 'Выполнена',
      priority: 'Высокий',
      assignedTo: 'Иванов А.П.',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      completedDate: '2024-02-10',
      description: 'Разработка проектной документации для строительства ВЛ и ТП'
    },
    {
      id: 2,
      objectId: 1,
      taskName: 'Получение разрешений на строительство',
      status: 'В работе',
      priority: 'Высокий',
      assignedTo: 'Петров В.С.',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      completedDate: null,
      description: 'Получение всех необходимых разрешений и согласований'
    },
    {
      id: 3,
      objectId: 1,
      taskName: 'Закупка материалов и оборудования',
      status: 'Ожидает',
      priority: 'Средний',
      assignedTo: 'Сидоров М.И.',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      completedDate: null,
      description: 'Закупка материалов и оборудования для строительства'
    },
    {
      id: 4,
      objectId: 2,
      taskName: 'Разработка проектной документации',
      status: 'Выполнена',
      priority: 'Высокий',
      assignedTo: 'Петров В.С.',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      completedDate: '2024-02-05',
      description: 'Разработка проектной документации для реконструкции ВЛ'
    },
    {
      id: 5,
      objectId: 2,
      taskName: 'Выполнение строительных работ',
      status: 'Выполнена',
      priority: 'Высокий',
      assignedTo: 'Смирнов П.К.',
      startDate: '2024-02-05',
      endDate: '2024-04-10',
      completedDate: '2024-04-05',
      description: 'Выполнение реконструкции ВЛ 0,4 кВ'
    }
  ],
  
  filters: {
    contractStatus: 'all',
    objectStatus: 'all',
    taskStatus: 'all',
    capitalCostType: 'all'
  },
  
  activeTab: 'contracts', // contracts, events, contractObjects, objects, tasks
  selectedContract: null,
  showCreateObjectModal: false,
  showBindObjectModal: false
};

const capitalConstructionSlice = createSlice({
  name: 'capitalConstruction',
  initialState,
  reducers: {
    addConstruction: (state, action) => {
      state.constructions.push(action.payload);
    },
    
    updateContractProject: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.contractProjects.findIndex(contract => contract.id === id);
      if (index !== -1) {
        state.contractProjects[index] = { ...state.contractProjects[index], ...updates };
      }
    },
    
    addNetworkEvent: (state, action) => {
      const newEvent = {
        ...action.payload,
        id: Date.now(),
        status: 'Планирование',
        progress: 0
      };
      state.networkEvents.push(newEvent);
    },
    
    updateNetworkEvent: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.networkEvents.findIndex(event => event.id === id);
      if (index !== -1) {
        state.networkEvents[index] = { ...state.networkEvents[index], ...updates };
      }
    },
    
    addConstructionObject: (state, action) => {
      const newObject = {
        ...action.payload,
        id: Date.now(),
        objectNumber: `ОС-${new Date().getFullYear()}-${String(state.constructionObjects.length + 1).padStart(3, '0')}`,
        status: 'Планирование',
        progress: 0
      };
      state.constructionObjects.push(newObject);
      state.contractConstructionObjects.push(newObject);
    },
    
    updateConstructionObject: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.constructionObjects.findIndex(obj => obj.id === id);
      if (index !== -1) {
        state.constructionObjects[index] = { ...state.constructionObjects[index], ...updates };
      }
      
      const contractIndex = state.contractConstructionObjects.findIndex(obj => obj.id === id);
      if (contractIndex !== -1) {
        state.contractConstructionObjects[contractIndex] = { ...state.contractConstructionObjects[contractIndex], ...updates };
      }
    },
    
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now(),
        status: 'Ожидает',
        completedDate: null
      };
      state.tasks.push(newTask);
    },
    
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates };
      }
    },
    
    bindEventToObject: (state, action) => {
      const { eventId, objectId } = action.payload;
      const event = state.networkEvents.find(e => e.id === eventId);
      if (event) {
        event.constructionObject = objectId;
      }
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    setSelectedContract: (state, action) => {
      state.selectedContract = action.payload;
    },
    
    setShowCreateObjectModal: (state, action) => {
      state.showCreateObjectModal = action.payload;
    },
    
    setShowBindObjectModal: (state, action) => {
      state.showBindObjectModal = action.payload;
    }
  },
});

export const { 
  addConstruction, 
  updateContractProject, 
  addNetworkEvent, 
  updateNetworkEvent,
  addConstructionObject,
  updateConstructionObject,
  addTask,
  updateTask,
  bindEventToObject,
  setFilters,
  setActiveTab,
  setSelectedContract,
  setShowCreateObjectModal,
  setShowBindObjectModal
} = capitalConstructionSlice.actions;
export default capitalConstructionSlice.reducer; 