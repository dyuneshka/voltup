import { createSlice } from '@reduxjs/toolkit';

const constructionSlice = createSlice({
  name: 'construction',
  initialState: {
    constructionControl: [],
    contracts: [],
    suppliers: [],
    materials: []
  },
  reducers: {
    createConstructionControl: (state, action) => {
      console.log('Creating construction control:', action.payload);
      state.constructionControl.push(action.payload);
    },
    updateConstructionControl: (state, action) => {
      const { id, ...updates } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === id);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex] = { 
          ...state.constructionControl[controlIndex], 
          ...updates 
        };
      }
    },
    completeConstructionStep: (state, action) => {
      const { controlId, stepId, stepData } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        const control = state.constructionControl[controlIndex];
        const updatedSteps = control.steps.map(step => {
          if (step.id === stepId) {
            return { ...step, status: 'completed', completed: true, ...stepData };
          }
          return step;
        });
        
        const nextStep = updatedSteps.find(step => !step.completed);
        const newCurrentStep = nextStep ? nextStep.id : control.currentStep;
        
        state.constructionControl[controlIndex] = {
          ...control,
          steps: updatedSteps,
          currentStep: newCurrentStep,
          status: newCurrentStep === control.currentStep ? 'Завершен' : 'В процессе'
        };
      }
    },
    selectWorkMethod: (state, action) => {
      const { controlId, method } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex].selectedWorkMethod = method;
      }
    },
    addConstructionDocument: (state, action) => {
      const { controlId, document } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex].documents.push(document);
      }
    },
    createContract: (state, action) => {
      console.log('Creating contract:', action.payload);
      state.contracts.push(action.payload);
    },
    updateContract: (state, action) => {
      const { id, ...updates } = action.payload;
      const contractIndex = state.contracts.findIndex(contract => contract.id === id);
      if (contractIndex !== -1) {
        state.contracts[contractIndex] = { ...state.contracts[contractIndex], ...updates };
      }
    },
    addSupplier: (state, action) => {
      console.log('Adding supplier:', action.payload);
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action) => {
      const { id, ...updates } = action.payload;
      const supplierIndex = state.suppliers.findIndex(supplier => supplier.id === id);
      if (supplierIndex !== -1) {
        state.suppliers[supplierIndex] = { ...state.suppliers[supplierIndex], ...updates };
      }
    },
    addMaterial: (state, action) => {
      console.log('Adding material:', action.payload);
      state.materials.push(action.payload);
    },
    updateMaterial: (state, action) => {
      const { id, ...updates } = action.payload;
      const materialIndex = state.materials.findIndex(material => material.id === id);
      if (materialIndex !== -1) {
        state.materials[materialIndex] = { ...state.materials[materialIndex], ...updates };
      }
    },
    startCompetition: (state, action) => {
      const { controlId, competitionData } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex] = {
          ...state.constructionControl[controlIndex],
          competition: competitionData
        };
      }
    },
    completeCompetition: (state, action) => {
      const { controlId, winner } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex] = {
          ...state.constructionControl[controlIndex],
          competition: {
            ...state.constructionControl[controlIndex].competition,
            status: 'completed',
            winner
          }
        };
      }
    },
    startContractProcess: (state, action) => {
      const { controlId, contractType } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex] = {
          ...state.constructionControl[controlIndex],
          contractProcess: {
            type: contractType,
            status: 'in-progress',
            startDate: new Date().toISOString()
          }
        };
      }
    },
    completeContractProcess: (state, action) => {
      const { controlId, contractData } = action.payload;
      const controlIndex = state.constructionControl.findIndex(cc => cc.id === controlId);
      if (controlIndex !== -1) {
        state.constructionControl[controlIndex] = {
          ...state.constructionControl[controlIndex],
          contractProcess: {
            ...state.constructionControl[controlIndex].contractProcess,
            status: 'completed',
            contractData,
            completionDate: new Date().toISOString()
          }
        };
      }
    }
  },
});

export const { 
  createConstructionControl,
  updateConstructionControl,
  completeConstructionStep,
  selectWorkMethod,
  addConstructionDocument,
  createContract,
  updateContract,
  addSupplier,
  updateSupplier,
  addMaterial,
  updateMaterial,
  startCompetition,
  completeCompetition,
  startContractProcess,
  completeContractProcess
} = constructionSlice.actions;

export default constructionSlice.reducer; 