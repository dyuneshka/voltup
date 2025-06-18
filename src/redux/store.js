import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';
import technicalReducer from './slices/technicalSlice';
import contractReducer from './slices/contractSlice';
import constructionReducer from './slices/constructionSlice';
import tuExecutionReducer from './slices/tuExecutionSlice';
import highVoltageTuReducer from './slices/highVoltageTuSlice';
import otherApplicantsTuReducer from './slices/otherApplicantsTuSlice';
import highPowerTuReducer from './slices/highPowerTuSlice';
import megaPowerTuReducer from './slices/megaPowerTuSlice';
import contractAmendmentReducer from './slices/contractAmendmentSlice';
import tariffManagementReducer from './slices/tariffManagementSlice';
import capitalConstructionReducer from './slices/capitalConstructionSlice';
import printFormsReducer from './slices/printFormsSlice';
import powerCalculationReducer from './slices/powerCalculationSlice';
import integrationReducer from './slices/integrationSlice';
import geoPortalReducer from './slices/geoPortalSlice';
import authReducer from './slices/authSlice';
import paymentReducer from './slices/paymentSlice';
import analyticsReducer from './slices/analyticsSlice';
import dashboardReducer from './slices/dashboardSlice';
import chatBotReducer from './slices/chatBotSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    technical: technicalReducer,
    contract: contractReducer,
    construction: constructionReducer,
    tuExecution: tuExecutionReducer,
    highVoltageTu: highVoltageTuReducer,
    otherApplicantsTu: otherApplicantsTuReducer,
    highPowerTu: highPowerTuReducer,
    megaPowerTu: megaPowerTuReducer,
    contractAmendment: contractAmendmentReducer,
    tariffManagement: tariffManagementReducer,
    capitalConstruction: capitalConstructionReducer,
    printForms: printFormsReducer,
    powerCalculation: powerCalculationReducer,
    integration: integrationReducer,
    geoPortal: geoPortalReducer,
    auth: authReducer,
    payment: paymentReducer,
    analytics: analyticsReducer,
    dashboard: dashboardReducer,
    chatBot: chatBotReducer,
  },
});

export default store;