import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kpis: {
    totalApplications: 50,
    avgProcessingTime: 12,
    rejectionRate: 5,
  },
  hotspots: [
    { location: 'Грозный, ул. Мира', demand: 200, issues: 3 },
    { location: 'Грозный, ул. Победы', demand: 150, issues: 1 },
    { location: 'Аргун, ул. Центральная', demand: 100, issues: 2 },
  ],
  regionalStats: [
    { region: 'Грозный', applications: 30, avgTime: 10, rejections: 2 },
    { region: 'Аргун', applications: 15, avgTime: 14, rejections: 1 },
    { region: 'Гудермес', applications: 5, avgTime: 11, rejections: 0 },
  ],
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateKPI: (state, action) => {
      state.kpis = { ...state.kpis, ...action.payload };
    },
    updateHotspots: (state, action) => {
      state.hotspots.push(action.payload);
    },
    updateRegionalStats: (state, action) => {
      state.regionalStats.push(action.payload);
    },
  },
});

export const { updateKPI, updateHotspots, updateRegionalStats } = analyticsSlice.actions;
export default analyticsSlice.reducer;