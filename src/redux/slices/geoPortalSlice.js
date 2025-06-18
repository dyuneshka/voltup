import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  objects: [],
  coordinates: [],
  constructionPlans: [],
};

const geoPortalSlice = createSlice({
  name: 'geoPortal',
  initialState,
  reducers: {
    addObject: (state, action) => {
      state.objects.push(action.payload);
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    addConstructionPlan: (state, action) => {
      state.constructionPlans.push(action.payload);
    },
  },
});

export const { addObject, setCoordinates, addConstructionPlan } = geoPortalSlice.actions;
export default geoPortalSlice.reducer;