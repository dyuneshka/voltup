import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';
import technicalReducer from './slices/technicalSlice';
import contractReducer from './slices/contractSlice';
import constructionReducer from './slices/constructionSlice';
import tuExecutionReducer from './slices/tuExecutionSlice';
import highVoltageTuReducer from './slices/highVoltageTuSlice';
import otherApplicantsTuReducer from './slices/otherApplicantsTuSlice';
import contractAmendmentReducer from './slices/contractAmendmentSlice';
import tariffManagementReducer from './slices/tariffManagementSlice';
import capitalConstructionReducer from './slices/capitalConstructionSlice';
import printFormsReducer from './slices/printFormsSlice';
import powerCalculationReducer from './slices/powerCalculationSlice';
import geoPortalReducer from './slices/geoPortalSlice';
import authReducer from './slices/authSlice';
import analyticsReducer from './slices/analyticsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    technical: technicalReducer,
    contract: contractReducer,
    construction: constructionReducer,
    tuExecution: tuExecutionReducer,
    highVoltageTu: highVoltageTuReducer,
    otherApplicantsTu: otherApplicantsTuReducer,
    contractAmendment: contractAmendmentReducer,
    tariffManagement: tariffManagementReducer,
    capitalConstruction: capitalConstructionReducer,
    printForms: printFormsReducer,
    powerCalculation: powerCalculationReducer,
    geoPortal: geoPortalReducer,
    auth: authReducer,
    analytics: analyticsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;